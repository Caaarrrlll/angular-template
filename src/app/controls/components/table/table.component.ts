import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ComponentRef, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSortModule, Sort, SortDirection } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { ButtonComponent } from "@shared/components/button/button/button.component";
import { CurrencyComponent } from "@shared/components/currency/currency.component";
import { GridFiltersComponent } from "@shared/components/grid-filters/grid-filters.component";
import { _CustGridFilterItem } from "@shared/models/cust-grid-filter-item";
import { _CustButtonInput } from "@shared/models/cust-basic-controls";
import { _CustPage } from "@shared/models/cust-page";
import { ApiResponsePipe } from "@shared/pipes/api-response/api-response.pipe";
import { DayAndHoursPipe } from "@shared/pipes/day-and-hours/day-and-hours.pipe";
import { PostfixPipe } from "@shared/pipes/postfix/postfix.pipe";
import { SpaceBetweenUppercasePipe } from "@shared/pipes/space-between-uppercase/space-between-uppercase.pipe";
import { ThousandSeparatorPipe } from "@shared/pipes/thousand-separator/thousand-separator.pipe";
import { Observable } from "rxjs";
import { _CustTableColumnHoverInterface } from "./cust-table-column-hover.interface";
import { _CustTableInterface } from "./cust-table.interface";
import { PASSED_INFO } from "./table-constants.const";

@Component({
	selector: "app-table",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"],
	imports: [
		CommonModule,
		ApiResponsePipe,
		DayAndHoursPipe,
		PostfixPipe,
		SpaceBetweenUppercasePipe,
		ThousandSeparatorPipe,
		GridFiltersComponent,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		CurrencyComponent,
		ButtonComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{ provide: PASSED_INFO, useValue: "" }],
})
export class TableComponent implements OnChanges {
	@Input() public filters?: _CustGridFilterItem;
	@Input() public listObservable?: Observable<unknown>;
	@Input({ required: true }) public tableConfig!: _CustTableInterface[];
	@Input() public custPage?: _CustPage;
	@Input() public defaultSort = "";
	/** Initial sort arrow for `defaultSort`; later changes are reported through the `announceSortChange` action. */
	@Input() public defaultSortDirection: SortDirection = "desc";
	@Input() public showCustomButton = false;
	@Input() public showAddButton = false;
	/**
	 * When using the expandable input, this will only indicate if there are any entries in the table that are expandable.
	 * If there is an expandable entry it needs to be in the interface and set in the map of the observable (listObservable)
	 */
	@Input() public expandable = false;
	@Input() public selectableColumns = false;
	@Input() public template?: ComponentRef<unknown>;
	@Output() public buttonActionOut: EventEmitter<unknown> = new EventEmitter<unknown>();

	@Input() public exporting = false;
	public displayedColumns: string[] = [];
	public columnsToDisplayWithExpand: string[] = [];
	public expandedElement: unknown = null;
	public displayedColumnsFilter: { display: string; activated: boolean; value: string }[] = [];
	public hasPagination = false;
	public hasFilters = false;
	public currentHover: _CustTableColumnHoverInterface = {
		column: null,
		index: null,
	};

	public myInjector: Injector = Injector.NULL;

	private readonly injector = inject(Injector);

	/** Column setup follows its inputs (it used to be read once on init, so later config changes were ignored). */
	public ngOnChanges(changes: SimpleChanges): void {
		if (`tableConfig` in changes || `expandable` in changes) {
			this.mapColumns();
		}
		this.hasPagination = this.custPage != null;
		this.hasFilters = this.filters != null;
	}

	private mapColumns(): void {
		this.displayedColumnsFilter = this.tableConfig.map((data: _CustTableInterface) => ({ display: data.display, activated: true, value: data.colName }));
		this.displayedColumns = this.tableConfig.map((item: _CustTableInterface): string => item.colName);

		this.columnsToDisplayWithExpand = this.displayedColumns;

		if (this.expandable) {
			this.columnsToDisplayWithExpand = ["expand", ...this.displayedColumns];
		}
	}

	public buttonEmit(object: unknown, action: string, colName?: string): void {
		if (action === "displayedColumnsChanged") {
			this.displayedColumnsFilter = object as { display: string; activated: boolean; value: string }[];
			this.columnsToDisplayWithExpand = this.displayedColumnsFilter.filter((data) => data.activated).map((data) => data.value);
			return;
		}

		const retObj = {
			action: action === "" ? colName : action,
			data: object,
		};

		this.buttonActionOut.emit(retObj);
	}

	/** Reports the new sort (Angular Material's `Sort`) to the parent, which fetches/orders the data; button columns are ignored. */
	public announceSortChange($event: Sort): void {
		const matchingItem = this.tableConfig.find((item: _CustTableInterface) => item.colName === $event.active);
		if (matchingItem?.type?.includes("button")) {
			return;
		}

		this.buttonEmit($event, "announceSortChange");
	}

	public setInjector(row: unknown): void {
		this.myInjector = Injector.create({ providers: [{ provide: PASSED_INFO, useValue: row }], parent: this.injector });
	}

	public isDateInPast(dateIn: Date | null | undefined): boolean {
		if (!dateIn) return false;
		return new Date(dateIn) < new Date();
	}

	public mouseLeave(): void {
		this.currentHover = {
			index: null,
			column: null,
		};
	}

	public mouseOver(index: number, column: string): void {
		this.currentHover = {
			index: index,
			column: column,
		};
	}

	public tableButton(config: _CustTableInterface, icon = "", display = "", iconSide = "", type = "Primary"): _CustButtonInput {
		const resolvedIcon = icon || (config.icon ?? "");
		return {
			type: type,
			icon: resolvedIcon,
			iconSide: iconSide || (resolvedIcon ? "left" : ""),
			tooltip: config.tooltip ?? "",
			display: config.disableDisplay ? "" : display || config.display,
			value: config.colName,
			disabled: false,
			isTableButton: true,
		};
	}
}
