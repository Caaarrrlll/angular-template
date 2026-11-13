import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { LinqGridFiltersComponent } from "@shared/components/linq-grid-filters/linq-grid-filters.component";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustTablePropertiesConfig,
	_CustTableWrapperInterface,
} from "@shared/components/card-table/cust-card-table.interface";
import { ListCardComponent, _ListCardParentButtonContext, _ListCardParentDataContext } from "@shared/components/list-card/list-card.component";
import { _LinQGridFilterItem } from "@shared/components/linq-grid-filters/linq-grid-filter-item.model";
import { ApiResponsePipe } from "@shared/pipes/api-response/api-response.pipe";
import { _CUSTPage } from "@shared/models/cust-page";
import { CustInputGeneral } from "@shared/models/cust-basic-controls";
import { Observable } from "rxjs";

export interface _CardTableParentDataContext extends _ListCardParentDataContext {
	claims: string[];
}

export interface _CardTableParentButtonContext extends _ListCardParentButtonContext {
	claims: string[];
}

@Component({
	selector: "app-card-table",
	templateUrl: "./card-table.component.html",
	styleUrls: ["./card-table.component.scss"],
	imports: [
		CommonModule,
		ApiResponsePipe,
		LinqGridFiltersComponent,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		ListCardComponent,
	],
})
export class CardTableComponent implements AfterContentInit {
	@Input() public listObservable?: Observable<unknown>;
	@Input() public filters?: _LinQGridFilterItem[];
	@Input() public custPage!: _CUSTPage;
	@Input() public tableWrapper!: _CustTableWrapperInterface;
	@Input() public parentDataProcess: ((context: _CardTableParentDataContext) => ReturnType<NonNullable<ListCardComponent["parentDataProcess"]>>) | undefined;
	@Input() public parentButtonProcess: ((context: _CardTableParentButtonContext) => ReturnType<NonNullable<ListCardComponent["parentButtonProcess"]>>) | undefined;
	@Input() public claims: string[] = [];
	@Input() public storageName?: string;
	@Input() public spinner?: number;
	@Input() public showAddButton: boolean = true;
	@Input() public showSortButton: boolean = false;
	@Input() public showCustomButton: boolean = false;
	@Input() public customButtonTooltip?: string;
	@Input() public customButtonIcon?: string;
	@Input() public showUpperToggle: boolean = false;
	@Input() public upperToggle?: CustInputGeneral;
	@Input() public defaultSort: string = "";

	@Output() public buttonActionOut: EventEmitter<unknown> = new EventEmitter<unknown>();

	public cardHeader!: _CustCardHeaderTableInterface[];
	public tableConfig!: _CustCardTableInterface[];
	public tablePropertiesConfig!: _CustTablePropertiesConfig[];
	public tableButtonConfig!: _CustCardButtonTableInterface[];

	public displayedColumns: string[] = ["lead"];
	public openInNewTab: boolean = false;
	public selectedVehicle: unknown;
	public scrollToId: string = "";

	public ngAfterContentInit(): void {
		this.cardHeader = this.tableWrapper.cardHeaders;
		this.tableConfig = this.tableWrapper.cardTable;
		this.tablePropertiesConfig = this.tableWrapper.cardTableProperties;
		this.tableButtonConfig = this.tableWrapper.cardButtonTable;
	}

	public buttonEmit(vehicle: unknown, action: string): void {
		const retObj = {
			action: action,
			data: vehicle,
		};

		this.buttonActionOut.emit(retObj);
		if (action === "View") {
			this.selectedVehicle = vehicle;
			if ((vehicle as Record<string, unknown>)["stockNumber"] && !this.openInNewTab) {
				localStorage.setItem("lastScrollPosition", (vehicle as Record<string, unknown>)["stockNumber"] as string);
			} else {
				this.scrollToId = "";
			}
		}
	}

	public announceSortChange($event: Sort): void {
		this.buttonEmit($event, "announceSortChange");
	}

	public buttonAction(event: unknown): void {
		const retObj = {
			action: (event as Record<string, Record<string, string>>)["action"]["buttonClick"],
			data: (event as Record<string, unknown>)["data"],
		};

		this.buttonActionOut.emit(retObj);
	}

	public pageChange(event: PageEvent): void {
		const retObj = {
			action: "pageChange",
			data: event,
		};

		this.buttonActionOut.emit(retObj);
	}

	public refreshLeads(): void {
		const retObj = {
			action: "refresh",
			data: null,
		};

		this.buttonActionOut.emit(retObj);
	}

	public updateFilter(event: unknown): void {
		const retObj = {
			action: "updateFilter",
			data: event,
		};

		this.buttonActionOut.emit(retObj);
	}

	public updateSort(event: unknown): void {
		const retObj = {
			action: "updateSort",
			data: event,
		};

		this.buttonActionOut.emit(retObj);
	}

	public filtersClear(): void {
		const retObj = {
			action: "clearFilter",
		};

		this.buttonActionOut.emit(retObj);
	}

	public customButtonClicked(): void {
		const retObj = {
			action: "customButtonClicked",
		};

		this.buttonActionOut.emit(retObj);
	}

	public filterRefresh(event: unknown): void {
		const retObj = {
			action: "refreshFilter",
			data: event,
		};

		this.buttonActionOut.emit(retObj);
	}

	public navigateToCreateLead(): void {
		const retObj = {
			action: "createLead",
			data: null,
		};

		this.buttonActionOut.emit(retObj);
	}

	public upperToggleChange(): void {
		const retObj = {
			action: "upperToggle",
			data: null,
		};

		this.buttonActionOut.emit(retObj);
	}
}
