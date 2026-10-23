import { animate, state, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { _CustButtonInputType, _custInputGeneral } from "@controls/cust-basic-controls/cust-basic-controls.interface";
import { CustButtonV2Module } from "@controls/cust-basic-controls/cust-button-v2/cust-button-v2.module";
import { CustListCardModule } from "@controls/cust-basic-controls/cust-list-card/cust-list-card.module";
import { CustSlideToggleModule } from "@controls/cust-basic-controls/cust-slide-toggle/cust-slide-toggle.module";
import { CustButtonModule } from "@controls/cust-button/cust-button.module";
import { CustCurrencyModule } from "@controls/cust-currency/cust-currency.module";
import { _CUSTPage } from "@controls/cust-page/cust-page.class";
import { _LinQGridFilterItem } from "@controls/linq-grid-filters/linq-grid-filter-item.model";
import { LinqGridFiltersModule } from "@controls/linq-grid-filters/linq-grid-filters.module";
import { PipesModule } from "@pipes/pipes.module";
import { PostfixModule } from "@pipes/postfix/postfix.module";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustTablePropertiesConfig,
	_CustTableWrapperInterface,
} from "@shared/components/card-table/cust-card-table.interface";
import { Observable, Subject } from "rxjs";

@Component({
	selector: "app-card-table",
	templateUrl: "./card-table.component.html",
	styleUrls: ["./card-table.component.scss"],
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
		CustListCardModule,
		CustSlideToggleModule,
	],
	animations: [
		trigger("detailExpand", [
			state("collapsed", style({ height: "0px", minHeight: "0" })),
			state("expanded", style({ height: "*" })),
			transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
		]),
	],
})
export class CardTableComponent implements OnDestroy, AfterContentInit {

	@Input() listObservable: Observable<unknown>;
	@Input() filters: _LinQGridFilterItem[];
	@Input() custPage: _CUSTPage;
	@Input() tableWrapper: _CustTableWrapperInterface;
	@Input() parentDataProcess: Function;
	@Input() parentButtonProcess: Function;
	@Input() storageName: string;
	@Input() spinner?: number;
	@Input() showAddButton: boolean = true;
	@Input() showSortButton: boolean = false;
	@Input() showCustomButton: boolean = false;
	@Input() customButtonTooltip: string;
	@Input() customButtonIcon: string;
	@Input() showUpperToggle: boolean = false;
	@Input() upperToggle: _custInputGeneral;

	@Output() buttonActionOut: EventEmitter<unknown> = new EventEmitter<unknown>();

	cardHeader: _CustCardHeaderTableInterface[];
	tableConfig: _CustCardTableInterface[];
	tablePropertiesConfig: _CustTablePropertiesConfig[];
	tableButtonConfig: _CustCardButtonTableInterface[];

	displayedColumns: string[] = ["lead"];
	openInNewTab: boolean = false;
	selectedVehicle: unknown;
	destroy$ = new Subject();
	scrollToId: string = "";
	canSeeMyLeadsFilter = false;

	clearCash: _CustButtonInputType = {
		icon: "",
		tooltip: "View the detail",
		display: "View",
		value: "clearStockOperationsCache",
		disabled: false,
	};

	taskName = undefined;



	ngAfterContentInit(): void {
		this.cardHeader = this.tableWrapper.cardHeaders;
		this.tableConfig = this.tableWrapper.cardTable;
		this.tablePropertiesConfig = this.tableWrapper.cardTableProperties;
		this.tableButtonConfig = this.tableWrapper.cardButtonTable;
	}

	buttonEmit(vehicle: unknown, action: string): void {
		const retObj = {
			action: action,
			data: vehicle,
		};

		this.buttonActionOut.emit(retObj);
		if (action == "View") {
			this.selectedVehicle = vehicle;
			if (vehicle["stockNumber"] && !this.openInNewTab) {
				localStorage.setItem("lastScrollPosition", vehicle["stockNumber"]);
			} else {
				this.scrollToId = "";
			}
		}
	}

	announceSortChange($event: MatSort): void {
		this.buttonEmit($event, "announceSortChange");
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.complete();
	}

	buttonAction(event: unknown): void {
		const retObj = {
			action: event["action"]["buttonClick"],
			data: event["data"],
		};

		this.buttonActionOut.emit(retObj);
	}

	pageChange(event: _CUSTPage): void {
		const retObj = {
			action: "pageChange",
			data: event,
		};

		this.buttonActionOut.emit(retObj);
	}

	refreshLeads(): void {
		const retObj = {
			action: "refresh",
			data: null,
		};

		this.buttonActionOut.emit(retObj);
	}

	updateFilter(event: unknown): void {
		const retObj = {
			action: "updateFilter",
			data: event,
		};

		this.buttonActionOut.emit(retObj);
	}

	updateSort(event: unknown): void {
		const retObj = {
			action: "updateSort",
			data: event,
		};

		this.buttonActionOut.emit(retObj);
	}

	filtersClear(): void {
		const retObj = {
			action: "clearFilter",
		};

		this.buttonActionOut.emit(retObj);
	}

	customButtonClicked(): void {
		const retObj = {
			action: "customButtonClicked",
		};

		this.buttonActionOut.emit(retObj);
	}

	filterRefresh(event: unknown): void {
		const retObj = {
			action: "refreshFilter",
			data: event,
		};

		this.buttonActionOut.emit(retObj);
	}

	navigateToCreateLead(): void {
		const retObj = {
			action: "createLead",
			data: null,
		};

		this.buttonActionOut.emit(retObj);
	}

	upperToggleChange(): void {
		const retObj = {
			action: "upperToggle",
			data: null,
		};

		this.buttonActionOut.emit(retObj);
	}
}
