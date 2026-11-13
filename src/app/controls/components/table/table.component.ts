import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, ComponentRef, EventEmitter, Injector, Input, OnDestroy, Output, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { ButtonPrimaryComponent } from "@shared/components/button/button-primary/button-primary.component";
import { ButtonSecondaryComponent } from "@shared/components/button/button-secondary/button-secondary.component";
import { ButtonTertiaryComponent } from "@shared/components/button/button-tertiary/button-tertiary.component";
import { CurrencyComponent } from "@shared/components/currency/currency.component";
import { LinqGridFiltersComponent } from "@shared/components/linq-grid-filters/linq-grid-filters.component";
import { _LinQGridFilterItem } from "@shared/components/linq-grid-filters/linq-grid-filter-item.model";
import { CustButtonInput } from "@shared/models/cust-basic-controls";
import { LinQRequestState } from "@shared/models/lin-q-request-state";
import { _CUSTPage } from "@shared/models/cust-page";
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
		LinqGridFiltersComponent,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		CurrencyComponent,
		ButtonPrimaryComponent,
		ButtonSecondaryComponent,
		ButtonTertiaryComponent,
	],
	providers: [{ provide: PASSED_INFO, useValue: "" }],
})
export class TableComponent implements OnDestroy, AfterContentInit {
	@Input() public filters?: _LinQGridFilterItem;
	@Input() public listObservable?: Observable<unknown>;
	@Input() public storageNameIn!: string;
	@Input({ required: true }) public tableConfig!: _CustTableInterface[];
	@Input({ required: true }) public requestState!: LinQRequestState;
	@Input() public custPage?: _CUSTPage;
	@Input() public defaultSort: string = "";
	@Input() public showCustomButton: boolean = false;
	@Input() public showAddButton: boolean = false;
	/**
	 * When using the expandable input, this will only indicate if there are any entries in the table that are expandable.
	 * If there is an expandable entry it needs to be in the interface and set in the map of the observable (listObservable)
	 */
	@Input() public expandable: boolean = false;
	@Input() public selectableColumns: boolean = false;
	@Input() public template?: ComponentRef<unknown>;
	@Output() public buttonActionOut: EventEmitter<unknown> = new EventEmitter<unknown>();

	@Input() public exporting: boolean = false;
	public openInNewTab: boolean = false;
	public selectedVehicle: unknown;
	public displayedColumns: string[] = [];
	public scrollToId: string = "";
	public columnsToDisplayWithExpand: string[] = [];
	public expandedElement: unknown = null;
	public displayedColumnsFilter: { display: string; activated: boolean; value: string }[] = [];
	public hasPagination: boolean = false;
	public hasFilters: boolean = false;
	public currentHover: _CustTableColumnHoverInterface = {
		column: null,
		index: null,
	};

	public myInjector: Injector = Injector.NULL;

	private readonly injector = inject(Injector);

	public ngAfterContentInit(): void {
		this.loadConfig();
		this.displayedColumnsFilter = this.tableConfig.map((data: _CustTableInterface) => ({ display: data.display, activated: true, value: data.colName }));
		this.displayedColumns = this.tableConfig.map((item: _CustTableInterface): string => item.colName);

		this.columnsToDisplayWithExpand = this.displayedColumns;

		if (this.expandable) {
			this.columnsToDisplayWithExpand = ["expand", ...this.displayedColumns];
		}

		this.hasPagination = this.custPage == null ? false : true;
		this.hasFilters = this.filters == null ? false : true;
	}

	private loadConfig(): void {
		this.openInNewTab = localStorage.getItem("operations_open_in_new_tab") === "true";

		if (!this.openInNewTab) {
			this.scrollToId = localStorage.getItem("lastScrollPosition") ?? "";
			this.scrollToPosition();
		}

		this.requestState.sorts = JSON.parse(localStorage.getItem(this.storageNameIn) ?? "null");		if (!this.requestState.sorts) {
			this.requestState.sorts = [
				{
					field: this.defaultSort,
					direction: "desc",
				},
			];
			localStorage.setItem(this.storageNameIn, JSON.stringify(this.requestState.sorts));
		}

		this.defaultSort = this.requestState.sorts[0].field;
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
		if (action === "View") {
			this.selectedVehicle = object;
			if ((object as Record<string, unknown>)["stockNumber"] && !this.openInNewTab) {
				localStorage.setItem("lastScrollPosition", (object as Record<string, unknown>)["stockNumber"] as string);
			} else {
				this.scrollToId = "";
			}
		}
	}

	public announceSortChange($event: Sort): void {
		const matchingItem = this.tableConfig.find((item: _CustTableInterface) => item.colName === $event.active);
		if (matchingItem?.type?.includes("button")) {
			return;
		}

		this.requestState.sorts = [
			{
				field: $event.active,
				direction: $event.direction === "asc" ? "asc" : "desc",
			},
		];
		localStorage.setItem(this.storageNameIn, JSON.stringify(this.requestState.sorts));

		this.buttonEmit($event, "announceSortChange");
	}

	/**
	 * Replaces the legacy `setTimeout` recursion: retries with
	 * `requestAnimationFrame` until the target row exists (or ~6s pass).
	 */
	private scrollToPosition(deadline: number = performance.now() + 6000): void {
		const rowid = localStorage.getItem("lastScrollPosition");
		const rows = Array.from(document.querySelectorAll<HTMLElement>(".mat-row"));
		const selectedRowIdx = rows.findIndex((row: HTMLElement) => row.id === rowid);
		if (selectedRowIdx > -1) {
			const selectedRow = rows[selectedRowIdx - 1];
			if (selectedRow) {
				selectedRow.scrollIntoView();
			}
			return;
		}
		if (performance.now() < deadline) {
			requestAnimationFrame(() => this.scrollToPosition(deadline));
		}
	}

	public setInjector(row: unknown): void {
		this.myInjector = Injector.create({ providers: [{ provide: PASSED_INFO, useValue: row }], parent: this.injector });
	}

	public ngOnDestroy(): void {
		// nothing long-lived: template-bound observables tear down with the view
	}

	public isDateInPast(dateIn: Date): boolean {
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

	public tableButton(config: _CustTableInterface, icon: string = "", display: string = "", iconSide: string = ""): CustButtonInput {
		const resolvedIcon = icon || config.icon || "";
		return {
			type: "",
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
