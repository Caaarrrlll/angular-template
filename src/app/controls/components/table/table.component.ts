import { animate, state, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, ComponentRef, EventEmitter, inject, Injector, Input, OnDestroy, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { _LinQGridFilterItem } from "@controls/linq-grid-filters/linq-grid-filter-item.model";
import { LinqGridFiltersModule } from "@controls/linq-grid-filters/linq-grid-filters.module";
import { _CustButtonInputType, _CustCheckboxInput } from "@controls/cust-basic-controls/cust-basic-controls.interface";
import { CustButtonV2Module } from "@controls/cust-basic-controls/cust-button-v2/cust-button-v2.module";
import { CustButtonModule } from "@controls/cust-button/cust-button.module";
import { _CUSTPage } from "@controls/cust-page/cust-page.class";
import { CustCurrencyModule } from "@controls/cust-currency/cust-currency.module";
import { CustKeyValueModule } from "@controls/cust-key-value/cust-key-value.module";
import { _CustTableColumnHoverInterface } from "@shared/components/table/cust-table-column-hover.interface";
import { _CustTableInterface } from "@shared/components/table/cust-table.interface";
import { PASSED_INFO } from "@shared/components/table/table-constants.const";
import { LinQRequestState } from "@models/LinQRequestState/LinQRequestState";
import { PostfixModule } from "@pipes/postfix/postfix.module";
import { PipesModule } from "@pipes/pipes.module";
import { Observable, Subject } from "rxjs";

@Component({
	selector: "app-table",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		PipesModule,
		PostfixModule,
		LinqGridFiltersModule,
		MatCheckboxModule,
		MatPaginatorModule,
		MatMenuModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatButtonModule,
		CustButtonModule,
		MatIconModule,
		CustCurrencyModule,
		CustButtonV2Module,
		CustKeyValueModule,
	],
	providers: [{ provide: PASSED_INFO, useValue: "" }],
	animations: [
		trigger("detailExpand", [
			state("collapsed", style({ height: "0px", minHeight: "0" })),
			state("expanded", style({ height: "*" })),
			transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
		]),
	],
})
export class TableComponent implements OnDestroy, AfterContentInit {
	@Input() filters: _LinQGridFilterItem;
	@Input() listObservable: Observable<unknown>;
	@Input() storageNameIn: string;
	@Input() tableConfig: _CustTableInterface[];
	@Input() requestState: LinQRequestState;
	@Input() custPage: _CUSTPage;
	@Input() defaultSort: string;
	@Input() showCustomButton: boolean;
	@Input() showAddButton: boolean;
	/**
	 * When using the expandable input, this will only indicate if there are any entries in the table that are expandable.
	 * If there is an expandable entry it needs to be in the interface and set in the map of the observable (listObservable)
	 *
	 * For an example, take a look at the LeadProcessInstancesComponent and _SlmsProcessInstance.
	 */
	@Input() expandable: boolean = false;
	@Input() selectableColumns: boolean = false;
	@Input() template: ComponentRef<any>;
	@Output() buttonActionOut: EventEmitter<unknown> = new EventEmitter<unknown>();

	@Input() exporting: boolean = false;
	openInNewTab: boolean = false;
	selectedVehicle: unknown;
	destroy$ = new Subject();
	displayedColumns: string[] = [];
	scrollToId: string = "";
	columnsToDisplayWithExpand: string[] = [];
	displayedColumnsFilter: _CustCheckboxInput[];
	hasPagination: boolean = false;
	hasFilters: boolean = false;
	currentHover: _CustTableColumnHoverInterface = {
		column: null,
		index: null,
	};

	myInjector: Injector;
	clearCash: _CustButtonInputType = {
		icon: "",
		tooltip: "View the detail",
		display: "View",
		value: "clearStockOperationsCache",
		disabled: false,
	};

	public readonly injector = inject(Injector);

	ngAfterContentInit(): void {
		this.loadConfig();
		this.displayedColumnsFilter = this.tableConfig.map((data) => ({ display: data.display, activated: true, value: data.colName }));
		this.displayedColumns = this.tableConfig.map((item) => {
			return item.colName;
		});

		this.columnsToDisplayWithExpand = this.displayedColumns;

		if (this.expandable) {
			this.columnsToDisplayWithExpand = ["expand", ...this.displayedColumns];
		}

		this.hasPagination = this.custPage == null ? false : true;
		this.hasFilters = this.filters == null ? false : true;
	}

	loadConfig(): void {
		this.openInNewTab = localStorage.getItem("operations_open_in_new_tab") == "true";

		if (!this.openInNewTab) {
			this.scrollToId = localStorage.getItem("lastScrollPosition");
			this._scrollToPosition();
		}

		this.requestState.sorts = JSON.parse(localStorage.getItem(this.storageNameIn));
		if (!this.requestState.sorts) {
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

	buttonEmit(object: any, action: string, colName?: string): void {
		if (action === "displayedColumnsChanged") {
			this.displayedColumnsFilter = object;
			this.columnsToDisplayWithExpand = object.filter((data) => data.activated).map((data) => data.value);
			return;
		}

		const retObj = {
			action: action == "" ? colName : action,
			data: object,
		};

		this.buttonActionOut.emit(retObj);
		if (action == "View") {
			this.selectedVehicle = object;
			if (object["stockNumber"] && !this.openInNewTab) {
				localStorage.setItem("lastScrollPosition", object["stockNumber"]);
			} else {
				this.scrollToId = "";
			}
		}
	}

	announceSortChange($event: MatSort): void {
		const matchingItem = this.tableConfig.find((item) => item.colName === $event.active);
		if (matchingItem?.type?.includes("button")) {
			return;
		}

		this.requestState.sorts = [
			{
				field: $event.active,
				direction: $event.direction == "asc" ? "asc" : "desc",
			},
		];
		localStorage.setItem(this.storageNameIn, JSON.stringify(this.requestState.sorts));

		this.buttonEmit($event, "announceSortChange");
	}

	showInTab(event: Event): void {
		localStorage.setItem("operations_open_in_new_tab", event["checked"]);
		this.openInNewTab = event["checked"];
		if (!this.openInNewTab) {
			this.scrollToId = "";
		}
	}

	private async _scrollToPosition(timeoutSet: number = 500) {
		const rowid = localStorage.getItem("lastScrollPosition");
		setTimeout(() => {
			let rows = Array.from(document.querySelectorAll(".mat-row"));
			let selectedRowIdx = rows.findIndex((row) => row.id === rowid);
			if (selectedRowIdx > -1) {
				let selectedRow = rows[selectedRowIdx - 1];
				if (selectedRow) {
					selectedRow.scrollIntoView();
				}
			} else {
				if (timeoutSet < 6000) {
					this._scrollToPosition((timeoutSet *= 2));
				}
			}
		}, timeoutSet);
	}

	setInjector(row: any): void {
		this.myInjector = Injector.create({ providers: [{ provide: PASSED_INFO, useValue: row }], parent: this.injector });
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.complete();
	}

	isDateInPast(dateIn: Date): boolean {
		if (!dateIn) return false;
		return new Date(dateIn) < new Date();
	}

	mouseLeave(): void {
		this.currentHover = {
			index: null,
			column: null,
		};
	}

	mouseOver(index: number, column: string): void {
		this.currentHover = {
			index: index,
			column: column,
		};
	}
}
