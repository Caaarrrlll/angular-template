import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { SandboxExpandableGridDataService } from "@segments/sandbox/services/sandbox-expandable-grid-data.service";
import { _SandboxLeadRow, _SandboxVehicleRow, SandboxTablesDataService } from "@segments/sandbox/services/sandbox-tables-data.service";
import { CardTableComponent } from "@shared/components/card-table/card-table.component";
import { ExpandableGridComponent } from "@shared/components/expandable-grid/expandable-grid.component";
import { _ExpandableGridRow } from "@shared/components/expandable-grid/core/types/expandable-grid-row.type";
import { _DisplayedColumnChoice, LinqGridFiltersComponent } from "@shared/components/linq-grid-filters/linq-grid-filters.component";
import { _LinQGridFilterCondition, _LinQGridFilterItem } from "@shared/models/linq-grid-filter-item";
import { TableComponent } from "@shared/components/table/table.component";
import { CustInputGeneral } from "@shared/models/cust-basic-controls";
import { _CUSTPage } from "@shared/models/cust-page";
import { LinQRequestState, LinQSort } from "@shared/models/lin-q-request-state";
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

type _SandboxSearchField = `reference` | `make` | `model` | `price` | `mileage`;

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
		LinqGridFiltersComponent,
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
	public readonly gridLog = new SandboxEventLog();

	// ------------------------------------------------------------------ app-table
	/** localStorage key the table uses to persist its sort (control-owned behaviour). */
	public readonly tableStorageName = `sandbox-tables-vehicle-sort`;
	public readonly tableColumns = this.tablesData.vehicleColumns;
	public readonly tableFilter: _LinQGridFilterItem = this.tablesData.createVehicleFilter();
	/** Mutated by the table (it writes `sorts`), so it stays a plain object rather than a signal. */
	public readonly tableRequestState: LinQRequestState = { skip: 0, take: 5, sorts: [] };
	public readonly tableMode: WritableSignal<_SandboxDataMode> = signal<_SandboxDataMode>(`data`);
	public readonly tableExporting: WritableSignal<boolean> = signal<boolean>(false);
	public readonly tableLog = new SandboxEventLog(10);

	private readonly tableRows: WritableSignal<_SandboxVehicleRow[]> = signal<_SandboxVehicleRow[]>([...this.tablesData.vehicles]);
	private readonly tableSearch: WritableSignal<string> = signal<string>(``);
	private readonly tableSort: WritableSignal<LinQSort> = signal<LinQSort>({ field: `listedDate`, direction: `desc` });
	private readonly tablePage: WritableSignal<{ page: number; pageSize: number }> = signal({ page: 0, pageSize: 5 });

	private readonly tableMatches: Signal<_SandboxVehicleRow[]> = computed(() =>
		this.tablesData.sortVehicles(this.tablesData.filterVehicles(this.tableRows(), this.tableSearch()), this.tableSort()),
	);

	/** A new observable per change: the table re-subscribes through `apiResponse | async`. */
	public readonly tableList: Signal<Observable<unknown>> = computed(() => {
		const { page, pageSize } = this.tablePage();
		return this.toModeObservable(this.tableMode(), this.tableMatches().slice(page * pageSize, (page + 1) * pageSize));
	});

	public readonly tableCustPage: Signal<_CUSTPage> = computed(() =>
		this.buildPage(`sandbox-tables-vehicle-page`, this.tablePage(), this.tableMode() === `data` ? this.tableMatches().length : 0, [5, 10, 25]),
	);

	// ------------------------------------------------------------- app-card-table
	public readonly cardWrapper = this.tablesData.leadCardWrapper;
	public readonly cardFilters: _LinQGridFilterItem[] = this.tablesData.createLeadFilters();
	public readonly cardDataProcess = this.tablesData.leadDataProcess;
	public readonly cardMode: WritableSignal<_SandboxDataMode> = signal<_SandboxDataMode>(`data`);
	/** Bumping `spinner` tells every card to clear its button loading state. */
	public readonly cardSpinner: WritableSignal<number> = signal<number>(0);
	public readonly cardLog = new SandboxEventLog(10);

	private readonly cardRows: WritableSignal<_SandboxLeadRow[]> = signal<_SandboxLeadRow[]>([...this.tablesData.leads]);
	private readonly cardCustomer: WritableSignal<string> = signal<string>(``);
	private readonly cardStatus: WritableSignal<string> = signal<string>(``);
	private readonly cardBranchOnly: WritableSignal<boolean> = signal<boolean>(false);
	private readonly cardSortDirection: WritableSignal<`asc` | `desc`> = signal<`asc` | `desc`>(`desc`);
	private readonly cardPage: WritableSignal<{ page: number; pageSize: number }> = signal({ page: 0, pageSize: 3 });

	public readonly cardUpperToggle: Signal<CustInputGeneral> = computed(() => ({ label: `Pretoria only`, value: String(this.cardBranchOnly()) }));

	private readonly cardMatches: Signal<_SandboxLeadRow[]> = computed(() => {
		const customer = this.cardCustomer().trim().toLowerCase();
		const status = this.cardStatus();
		const factor = this.cardSortDirection() === `asc` ? 1 : -1;
		return this.cardRows()
			.filter((lead) => !customer || lead.customer.toLowerCase().includes(customer))
			.filter((lead) => !status || lead.status === status)
			.filter((lead) => !this.cardBranchOnly() || lead.branch === `Pretoria`)
			.sort((a, b) => a.createdDate.localeCompare(b.createdDate) * factor);
	});

	public readonly cardList: Signal<Observable<unknown>> = computed(() => {
		const { page, pageSize } = this.cardPage();
		return this.toModeObservable(this.cardMode(), this.cardMatches().slice(page * pageSize, (page + 1) * pageSize));
	});

	public readonly cardCustPage: Signal<_CUSTPage> = computed(() =>
		this.buildPage(`sandbox-tables-lead-page`, this.cardPage(), this.cardMode() === `data` ? this.cardMatches().length : 0, [3, 6, 12]),
	);

	// ------------------------------------------------------ app-linq-grid-filters
	public readonly showcaseFilters: _LinQGridFilterItem[] = this.tablesData.createFilterShowcase();
	public readonly showcaseColumns: string[] = [`make`, `model`, `price`, `mileage`];
	public readonly showSortButton: WritableSignal<boolean> = signal<boolean>(true);
	public readonly showAddButton: WritableSignal<boolean> = signal<boolean>(true);
	public readonly showCustomButton: WritableSignal<boolean> = signal<boolean>(true);
	public readonly showUpperToggle: WritableSignal<boolean> = signal<boolean>(true);
	public readonly selectableColumns: WritableSignal<boolean> = signal<boolean>(true);
	public readonly filtersExporting: WritableSignal<boolean> = signal<boolean>(false);
	public readonly filtersUpperToggle: CustInputGeneral = { label: `Include sold`, value: `false` };
	/** The filter bar's own working items (from filterRefresh); it no longer edits showcaseFilters, so conditions are read from these. */
	private barItems: _LinQGridFilterItem[] = [];
	/** Snapshot of the active conditions, refreshed on every filter-bar output. */
	public readonly activeConditions: WritableSignal<_LinQGridFilterCondition[]> = signal<_LinQGridFilterCondition[]>([]);
	public readonly filtersLog = new SandboxEventLog(10);

	// -------------------------------------------------------- search + pipes demo
	public readonly searchTerm: WritableSignal<string> = signal<string>(``);
	public readonly searchSortField: WritableSignal<_SandboxSearchField> = signal<_SandboxSearchField>(`reference`);
	public readonly searchSortDirection: WritableSignal<`asc` | `desc`> = signal<`asc` | `desc`>(`asc`);
	public readonly searchFields: { field: _SandboxSearchField; display: string }[] = [
		{ field: `reference`, display: `Reference` },
		{ field: `make`, display: `Make` },
		{ field: `model`, display: `Model` },
		{ field: `price`, display: `Price (R)` },
		{ field: `mileage`, display: `Mileage (km)` },
	];

	/** Hostile-looking text: must render as literal text, with only the matched part wrapped in <mark>. */
	public readonly searchUnsafeSample = `<img src=x onerror="alert(1)"> Toyota (Cross) & <b>not bold</b>`;

	/** Trimmed term for `searchMatch` (the pipe matches literally and escapes HTML itself). */
	public readonly searchPattern: Signal<string> = computed(() => this.searchTerm().trim());

	/** Fresh array per change: `orderBy` and `sort` both sort their input in place. */
	public readonly searchRows: Signal<_SandboxVehicleRow[]> = computed(() => this.tablesData.filterVehicles(this.tablesData.vehicles, this.searchTerm()));
	public readonly searchMakes: Signal<_SandboxVehicleRow[]> = computed(() => [...this.searchRows()]);

	/** Comparator for the `orderBy` pipe; a new function per sort change so the pure pipe re-runs. */
	public readonly searchComparator: Signal<(a: _SandboxVehicleRow, b: _SandboxVehicleRow) => number> = computed(() => {
		const field = this.searchSortField();
		const factor = this.searchSortDirection() === `asc` ? 1 : -1;
		return (a: _SandboxVehicleRow, b: _SandboxVehicleRow): number => {
			const left = a[field];
			const right = b[field];
			return (typeof left === `string` && typeof right === `string` ? left.localeCompare(right) : Number(left) - Number(right)) * factor;
		};
	});

	public constructor() {
		// The table restores a cached sort from localStorage in ngAfterContentInit; mirror it once rendered.
		afterNextRender(() => {
			const sort = this.tableRequestState.sorts.at(0);
			if (sort?.field) {
				this.tableSort.set(sort);
			}
		});
	}

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
				const text = (data as _LinQGridFilterItem).config.options.text ?? ``;
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
				const reference = (data as _SandboxVehicleRow).reference;
				this.tableRows.update((rows) => rows.map((row) => (row.reference === reference ? { ...row, favourite: !row.favourite } : row)));
				this.tableLog.add(`buttonActionOut: Favourite ${reference}`);
				break;
			}
			case `exportToExcel`:
				this.tableExporting.set(true);
				this.tableLog.add(`buttonActionOut: exportToExcel (exporting indicator on)`);
				break;
			case `View`:
			case `Reference`:
				this.tableLog.add(`buttonActionOut: ${action} ${(data as _SandboxVehicleRow).reference}`);
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
				const item = data as _LinQGridFilterItem;
				const value = item.filter.filters[0]?.value;
				if (item.name === `customer`) {
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
				const leadId = (data as _SandboxLeadRow).leadId;
				this.cardRows.update((rows) => rows.filter((row) => row.leadId !== leadId));
				this.cardLog.add(`buttonActionOut: archiveLead ${leadId}`);
				break;
			}
			case `openLead`:
				this.cardLog.add(`buttonActionOut: openLead ${(data as _SandboxLeadRow).leadId} (button stays loading until spinner changes)`);
				break;
			case `refreshFilter`:
				this.cardLog.add(`buttonActionOut: refreshFilter (${String((data as _LinQGridFilterItem[]).length)} filters)`);
				break;
			default:
				// refresh, createLead, customButtonClicked, announceSortChange
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

	// ------------------------------------------------------ app-linq-grid-filters
	public onFilterChanged(item: _LinQGridFilterItem): void {
		this.syncConditions();
		this.filtersLog.add(`filterChanged: ${item.name} active=${String(item.active ?? false)}`);
	}

	public onFilterRefresh(items: _LinQGridFilterItem[]): void {
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

	/** `_CUSTPage` reads sessionStorage by name in its constructor; these names are never written, so it stays in-memory. */
	private buildPage(storageName: string, state: { page: number; pageSize: number }, total: number, sizes: number[]): _CUSTPage {
		const page = new _CUSTPage(storageName);
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
