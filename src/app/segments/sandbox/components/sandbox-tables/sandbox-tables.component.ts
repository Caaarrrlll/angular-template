import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { _SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { SandboxExpandableGridDataService } from "@segments/sandbox/services/sandbox-expandable-grid-data.service";
import { _SandboxLeadRow, _SandboxProductRow, _SandboxSort, SandboxTablesDataService } from "@segments/sandbox/services/sandbox-tables-data.service";
import { CardTableComponent } from "@shared/components/card-table/card-table.component";
import { ExpandableGridComponent } from "@shared/components/expandable-grid/expandable-grid.component";
import { _ExpandableGridRow } from "@shared/components/expandable-grid/core/types/expandable-grid-row.type";
import { _DisplayedColumnChoice, GridFiltersComponent } from "@shared/components/grid-filters/grid-filters.component";
import { _CustGridFilterCondition, _CustGridFilterItem } from "@shared/models/cust-grid-filter-item";
import { TableComponent } from "@shared/components/table/table.component";
import { _CustInputGeneral } from "@shared/models/cust-basic-controls";
import { _CustPage } from "@shared/models/cust-page";
import { HighlightSearchMatchPipe } from "@shared/pipes/highlight-search-match/highlight-search-match.pipe";
import { OrderByPipe } from "@shared/pipes/order-by/order-by.pipe";
import { ArraySortPipe } from "@shared/pipes/sort/array-sort.pipe";
import { ThousandSeparatorPipe } from "@shared/pipes/thousand-separator/thousand-separator.pipe";
import { NEVER, Observable, of, throwError } from "rxjs";

/** Which observable the table demos feed into the control (each one maps to an `apiResponse` view state). */
export type _SandboxDataMode = `data` | `empty` | `loading` | `error`;

/** Shape of the objects `app-table` / `app-card-table` emit through `buttonActionOut`. */
interface _SandboxTableAction {
	action?: string;
	data?: unknown;
}

type _SandboxSearchField = `productCode` | `category` | `name` | `price` | `deliveryDistance`;

@Component({
	selector: "app-sandbox-tables",
	templateUrl: "./sandbox-tables.component.html",
	styleUrls: ["./sandbox-tables.component.scss"],
	imports: [
		SandboxPageComponent,
		SandboxDemoComponent,
		ExpandableGridComponent,
		TableComponent,
		CardTableComponent,
		GridFiltersComponent,
		MatButtonModule,
		JsonPipe,
		HighlightSearchMatchPipe,
		OrderByPipe,
		ArraySortPipe,
		ThousandSeparatorPipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxTablesComponent {
	private readonly expandableGridData = inject(SandboxExpandableGridDataService);
	private readonly tablesData = inject(SandboxTablesDataService);

	public readonly dataModes: _SandboxDataMode[] = [`data`, `empty`, `loading`, `error`];

	// ------------------------------------------------------------ expandable grid
	public readonly gridColumns = this.expandableGridData.columns;
	public readonly editableColumns = this.expandableGridData.editableColumns;
	public readonly gridRules = this.expandableGridData.rules;
	public readonly gridForm: FormGroup = this.expandableGridData.createForm();
	public readonly gridRows: WritableSignal<_ExpandableGridRow[]> = signal<_ExpandableGridRow[]>(this.expandableGridData.rows);
	public readonly gridLog = new _SandboxEventLog();

	// ------------------------------------------------------------------ app-table
	public readonly tableColumns = this.tablesData.productColumns;
	public readonly tableFilter: _CustGridFilterItem = this.tablesData.createProductFilter();
	public readonly tableMode: WritableSignal<_SandboxDataMode> = signal<_SandboxDataMode>(`data`);
	public readonly tableExporting: WritableSignal<boolean> = signal<boolean>(false);
	public readonly tableLog = new _SandboxEventLog(10);

	private readonly tableRows: WritableSignal<_SandboxProductRow[]> = signal<_SandboxProductRow[]>([...this.tablesData.products]);
	private readonly tableSearch: WritableSignal<string> = signal<string>(``);
	private readonly tableSort: WritableSignal<_SandboxSort> = signal<_SandboxSort>({ field: `listedDate`, direction: `desc` });
	private readonly tablePage: WritableSignal<{ page: number; pageSize: number }> = signal({ page: 0, pageSize: 5 });

	private readonly tableMatches: Signal<_SandboxProductRow[]> = computed(() =>
		this.tablesData.sortProducts(this.tablesData.filterProducts(this.tableRows(), this.tableSearch()), this.tableSort()),
	);

	/** A new observable per change: the table re-subscribes through `apiResponse | async`. */
	public readonly tableList: Signal<Observable<unknown>> = computed(() => {
		const { page, pageSize } = this.tablePage();
		return this.toModeObservable(this.tableMode(), this.tableMatches().slice(page * pageSize, (page + 1) * pageSize));
	});

	public readonly tableCustPage: Signal<_CustPage> = computed(() => this.buildPage(this.tablePage(), this.tableMode() === `data` ? this.tableMatches().length : 0, [5, 10, 25]));

	// ------------------------------------------------------------- app-card-table
	public readonly cardWrapper = this.tablesData.leadCardWrapper;
	public readonly cardFilters: _CustGridFilterItem[] = this.tablesData.createLeadFilters();
	public readonly cardDataProcess = this.tablesData.leadDataProcess;
	public readonly cardMode: WritableSignal<_SandboxDataMode> = signal<_SandboxDataMode>(`data`);
	/** Bumping `spinner` tells every card to clear its button loading state. */
	public readonly cardSpinner: WritableSignal<number> = signal<number>(0);
	public readonly cardLog = new _SandboxEventLog(10);

	private readonly cardRows: WritableSignal<_SandboxLeadRow[]> = signal<_SandboxLeadRow[]>([...this.tablesData.leads]);
	private readonly cardCustomer: WritableSignal<string> = signal<string>(``);
	private readonly cardStatus: WritableSignal<string> = signal<string>(``);
	private readonly cardBranchOnly: WritableSignal<boolean> = signal<boolean>(false);
	private readonly cardSortDirection: WritableSignal<`asc` | `desc`> = signal<`asc` | `desc`>(`desc`);
	private readonly cardPage: WritableSignal<{ page: number; pageSize: number }> = signal({ page: 0, pageSize: 3 });

	public readonly cardUpperToggle: Signal<_CustInputGeneral> = computed(() => ({ label: `Pretoria only`, value: String(this.cardBranchOnly()) }));

	private readonly cardMatches: Signal<_SandboxLeadRow[]> = computed(() => {
		const customer = this.cardCustomer().trim().toLowerCase();
		const status = this.cardStatus();
		const factor = this.cardSortDirection() === `asc` ? 1 : -1;
		return this.cardRows()
			.filter((lead) => !customer || lead.customerName.toLowerCase().includes(customer))
			.filter((lead) => !status || lead.status === status)
			.filter((lead) => !this.cardBranchOnly() || lead.branch === `Pretoria`)
			.sort((a, b) => a.createdOn.localeCompare(b.createdOn) * factor);
	});

	public readonly cardList: Signal<Observable<unknown>> = computed(() => {
		const { page, pageSize } = this.cardPage();
		return this.toModeObservable(this.cardMode(), this.cardMatches().slice(page * pageSize, (page + 1) * pageSize));
	});

	public readonly cardCustPage: Signal<_CustPage> = computed(() => this.buildPage(this.cardPage(), this.cardMode() === `data` ? this.cardMatches().length : 0, [3, 6, 12]));

	// ------------------------------------------------------ app-grid-filters
	public readonly showcaseFilters: _CustGridFilterItem[] = this.tablesData.createFilterShowcase();
	public readonly showcaseColumns: string[] = [`category`, `name`, `price`, `quantity`];
	public readonly showSortButton: WritableSignal<boolean> = signal<boolean>(true);
	public readonly showAddButton: WritableSignal<boolean> = signal<boolean>(true);
	public readonly showCustomButton: WritableSignal<boolean> = signal<boolean>(true);
	public readonly showUpperToggle: WritableSignal<boolean> = signal<boolean>(true);
	public readonly selectableColumns: WritableSignal<boolean> = signal<boolean>(true);
	public readonly filtersExporting: WritableSignal<boolean> = signal<boolean>(false);
	public readonly filtersUpperToggle: _CustInputGeneral = { label: `Include sold`, value: `false` };
	/** The filter bar's own working items (from filterRefresh); it no longer edits showcaseFilters, so conditions are read from these. */
	private barItems: _CustGridFilterItem[] = [];
	/** Snapshot of the active conditions, refreshed on every filter-bar output. */
	public readonly activeConditions: WritableSignal<_CustGridFilterCondition[]> = signal<_CustGridFilterCondition[]>([]);
	public readonly filtersLog = new _SandboxEventLog(10);

	// -------------------------------------------------------- search + pipes demo
	public readonly searchTerm: WritableSignal<string> = signal<string>(``);
	public readonly searchSortField: WritableSignal<_SandboxSearchField> = signal<_SandboxSearchField>(`productCode`);
	public readonly searchSortDirection: WritableSignal<`asc` | `desc`> = signal<`asc` | `desc`>(`asc`);
	public readonly searchFields: { field: _SandboxSearchField; display: string }[] = [
		{ field: `productCode`, display: `Product code` },
		{ field: `category`, display: `Category` },
		{ field: `name`, display: `Name` },
		{ field: `price`, display: `Price` },
		{ field: `deliveryDistance`, display: `Delivery (km)` },
	];

	/** Hostile-looking text: must render as literal text, with only the matched part wrapped in <mark>. */
	public readonly searchUnsafeSample = `<img src=x onerror="alert(1)"> Monitor (27-inch) & <b>not bold</b>`;

	/** Trimmed term for `searchMatch` (the pipe matches literally and escapes HTML itself). */
	public readonly searchPattern: Signal<string> = computed(() => this.searchTerm().trim());

	/** Fresh array per change: `orderBy` and `sort` both sort their input in place. */
	public readonly searchRows: Signal<_SandboxProductRow[]> = computed(() => this.tablesData.filterProducts(this.tablesData.products, this.searchTerm()));
	public readonly searchCategories: Signal<_SandboxProductRow[]> = computed(() => [...this.searchRows()]);

	/** Comparator for the `orderBy` pipe; a new function per sort change so the pure pipe re-runs. */
	public readonly searchComparator: Signal<(a: _SandboxProductRow, b: _SandboxProductRow) => number> = computed(() => {
		const field = this.searchSortField();
		const factor = this.searchSortDirection() === `asc` ? 1 : -1;
		return (a: _SandboxProductRow, b: _SandboxProductRow): number => {
			const left = a[field];
			const right = b[field];
			return (typeof left === `string` && typeof right === `string` ? left.localeCompare(right) : Number(left) - Number(right)) * factor;
		};
	});

	// ------------------------------------------------------------ expandable grid
	public onGridDelete(row: _ExpandableGridRow): void {
		this.gridRows.update((rows) => rows.filter((item) => item[`id`] !== row[`id`]));
		this.gridLog.add(`delete: row ${String(row[`id`])}`);
	}

	public onGridSave(value: unknown): void {
		const row = value as _ExpandableGridRow;
		const id = row[`id`] as number | null | undefined;

		if (id === null || id === undefined) {
			this.gridRows.update((rows) => [{ ...row, id: this.nextId() }, ...rows]);
		} else {
			this.gridRows.update((rows) => rows.map((item) => (item[`id`] === id ? { ...item, ...row } : item)));
		}

		this.gridLog.add(`save: row ${String(id ?? `new`)}`);
	}

	// ------------------------------------------------------------------ app-table
	public onTableAction(event: unknown): void {
		const { action, data } = event as _SandboxTableAction;

		switch (action) {
			case `updateFilters`: {
				const text = (data as _CustGridFilterItem).config.options.text ?? ``;
				this.tableSearch.set(text);
				this.tablePage.update((page) => ({ ...page, page: 0 }));
				this.tableLog.add(`buttonActionOut: updateFilters "${text}"`);
				break;
			}
			case `announceSortChange`: {
				const sort = data as Sort;
				this.tableSort.set({ field: sort.active, direction: sort.direction === `asc` ? `asc` : `desc` });
				this.tableLog.add(`buttonActionOut: announceSortChange ${sort.active} ${sort.direction || `(cleared -> desc)`}`);
				break;
			}
			case `pageChange`: {
				const page = data as PageEvent;
				this.tablePage.set({ page: page.pageIndex, pageSize: page.pageSize });
				this.tableLog.add(`buttonActionOut: pageChange index ${String(page.pageIndex)}, size ${String(page.pageSize)}`);
				break;
			}
			case `Favourite`: {
				const productCode = (data as _SandboxProductRow).productCode;
				this.tableRows.update((rows) => rows.map((row) => (row.productCode === productCode ? { ...row, favourite: !row.favourite } : row)));
				this.tableLog.add(`buttonActionOut: Favourite ${productCode}`);
				break;
			}
			case `exportToExcel`:
				this.tableExporting.set(true);
				this.tableLog.add(`buttonActionOut: exportToExcel (exporting indicator on)`);
				break;
			case `View`:
			case `Product code`:
				this.tableLog.add(`buttonActionOut: ${action} ${(data as _SandboxProductRow).productCode}`);
				break;
			default:
				// Refresh, add, ...
				this.tableLog.add(`buttonActionOut: ${action ?? `(none)`}`);
		}
	}

	// ------------------------------------------------------------- app-card-table
	public onCardAction(event: unknown): void {
		const { action, data } = event as _SandboxTableAction;

		switch (action) {
			case `updateFilter`: {
				const item = data as _CustGridFilterItem;
				const value = item.filter.filters[0]?.value;
				if (item.name === `customerName`) {
					this.cardCustomer.set(typeof value === `string` ? value : ``);
				} else if (item.name === `status`) {
					this.cardStatus.set(typeof value === `string` ? value : ``);
				}
				this.cardPage.update((page) => ({ ...page, page: 0 }));
				this.cardLog.add(`buttonActionOut: updateFilter ${item.name} = ${JSON.stringify(value ?? null)}`);
				break;
			}
			case `clearFilter`:
				this.cardCustomer.set(``);
				this.cardStatus.set(``);
				this.cardLog.add(`buttonActionOut: clearFilter`);
				break;
			case `updateSort`: {
				const sort = data as Sort;
				this.cardSortDirection.set(sort.direction === `asc` ? `asc` : `desc`);
				this.cardLog.add(`buttonActionOut: updateSort ${sort.direction}`);
				break;
			}
			case `upperToggle`:
				this.cardBranchOnly.set(data === true);
				this.cardPage.update((page) => ({ ...page, page: 0 }));
				this.cardLog.add(`buttonActionOut: upperToggle (data: ${String(data)})`);
				break;
			case `pageChange`: {
				const page = data as PageEvent;
				this.cardPage.set({ page: page.pageIndex, pageSize: page.pageSize });
				this.cardLog.add(`buttonActionOut: pageChange index ${String(page.pageIndex)}, size ${String(page.pageSize)}`);
				break;
			}
			case `archiveLead`: {
				const leadCode = (data as _SandboxLeadRow).leadCode;
				this.cardRows.update((rows) => rows.filter((row) => row.leadCode !== leadCode));
				this.cardLog.add(`buttonActionOut: archiveLead ${leadCode}`);
				break;
			}
			case `openLead`:
				this.cardLog.add(`buttonActionOut: openLead ${(data as _SandboxLeadRow).leadCode} (button stays loading until spinner changes)`);
				break;
			case `refreshFilter`:
				this.cardLog.add(`buttonActionOut: refreshFilter (${String((data as _CustGridFilterItem[]).length)} filters)`);
				break;
			default:
				// refresh, create, customButtonClicked, announceSortChange
				this.cardLog.add(`buttonActionOut: ${action ?? `(none)`}`);
		}
	}

	public finishCardActions(): void {
		this.cardSpinner.update((value) => value + 1);
		this.cardLog.add(`spinner -> ${String(this.cardSpinner())} (clears card button loading)`);
	}

	public resetCardRows(): void {
		this.cardRows.set([...this.tablesData.leads]);
	}

	// ------------------------------------------------------ app-grid-filters
	public onFilterChanged(item: _CustGridFilterItem): void {
		this.syncConditions();
		this.filtersLog.add(`filterChanged: ${item.name} active=${String(item.active ?? false)}`);
	}

	public onFilterRefresh(items: _CustGridFilterItem[]): void {
		this.barItems = items;
		this.syncConditions();
		this.filtersLog.add(`filterRefresh: ${String(items.length)} filters`);
	}

	public onFiltersCleared(): void {
		this.syncConditions();
		this.filtersLog.add(`clearButtonClicked`);
	}

	public onSortChanged(sort: Sort): void {
		this.filtersLog.add(`sortChanged: ${sort.direction}`);
	}

	public onUpperToggleChanged(checked: boolean): void {
		this.filtersLog.add(`upperToggleChanged: ${String(checked)}`);
	}

	public onDisplayedColumnsChanged(choices: _DisplayedColumnChoice[]): void {
		const visible = choices.filter((choice) => choice.activated).map((choice) => choice.value);
		this.filtersLog.add(`displayedColumnsChanged: [${visible.join(`, `)}]`);
	}

	public logFilters(message: string): void {
		this.filtersLog.add(message);
	}

	// -------------------------------------------------------- search + pipes demo
	public onSearchInput(event: Event): void {
		this.searchTerm.set((event.target as HTMLInputElement).value);
	}

	public sortSearchBy(field: _SandboxSearchField): void {
		if (this.searchSortField() === field) {
			this.searchSortDirection.update((direction) => (direction === `asc` ? `desc` : `asc`));
		} else {
			this.searchSortField.set(field);
			this.searchSortDirection.set(`asc`);
		}
	}

	public toggle(flag: WritableSignal<boolean>): void {
		flag.update((value) => !value);
	}

	// -------------------------------------------------------------------- helpers
	private syncConditions(): void {
		this.activeConditions.set(this.barItems.flatMap((item) => item.filter.filters));
	}

	private toModeObservable(mode: _SandboxDataMode, rows: unknown[]): Observable<unknown> {
		switch (mode) {
			case `empty`:
				return of([]);
			case `loading`:
				return NEVER;
			case `error`:
				return throwError(() => new Error(`Sandbox: simulated API failure`));
			default:
				return of(rows);
		}
	}

	/** A fresh in-memory `_CustPage` for the paginator. */
	private buildPage(state: { page: number; pageSize: number }, total: number, sizes: number[]): _CustPage {
		const page = new _CustPage();
		page.page = state.page;
		page.pageSize = state.pageSize;
		page.pageTotal = total;
		page.pageSizeOptions = sizes;
		return page;
	}

	private nextId(): number {
		return this.gridRows().reduce((max, item) => Math.max(max, Number(item[`id`] ?? 0)), 0) + 1;
	}
}
