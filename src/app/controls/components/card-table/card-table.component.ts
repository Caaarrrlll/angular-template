import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSortModule, Sort, SortDirection } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { GridFiltersComponent } from "@shared/components/grid-filters/grid-filters.component";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustTablePropertiesConfig,
	_CustTableWrapperInterface,
} from "@shared/components/card-table/cust-card-table.interface";
import { ListCardComponent, _ListCardParentButtonContext, _ListCardParentDataContext } from "@shared/components/list-card/list-card.component";
import { _CustGridFilterItem } from "@shared/models/cust-grid-filter-item";
import { ApiResponsePipe } from "@shared/pipes/api-response/api-response.pipe";
import { _CustPage } from "@shared/models/cust-page";
import { _CustInputGeneral } from "@shared/models/cust-basic-controls";
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
		GridFiltersComponent,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		ListCardComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTableComponent implements OnChanges {
	@Input() public listObservable?: Observable<unknown>;
	@Input() public filters?: _CustGridFilterItem[];
	@Input() public custPage!: _CustPage;
	@Input() public tableWrapper!: _CustTableWrapperInterface;
	@Input() public parentDataProcess: ((context: _CardTableParentDataContext) => ReturnType<NonNullable<ListCardComponent["parentDataProcess"]>>) | undefined;
	@Input() public parentButtonProcess: ((context: _CardTableParentButtonContext) => ReturnType<NonNullable<ListCardComponent["parentButtonProcess"]>>) | undefined;
	@Input() public claims: string[] = [];
	@Input() public spinner?: number;
	@Input() public showAddButton = true;
	@Input() public showSortButton = false;
	@Input() public showCustomButton = false;
	@Input() public customButtonTooltip?: string;
	@Input() public customButtonIcon?: string;
	@Input() public showUpperToggle = false;
	@Input() public upperToggle?: _CustInputGeneral;
	@Input() public defaultSort = "";
	/** Initial sort arrow for `defaultSort`; later changes are reported through the `announceSortChange` action. */
	@Input() public defaultSortDirection: SortDirection = "desc";
	/** Hide the grid-filters bar (refresh/add/sort/custom buttons included) for a plain card list. */
	@Input() public showFilterBar = true;
	/** Hide the paginator, e.g. when the list is not paged; `custPage` is then not read. */
	@Input() public showPaginator = true;

	@Output() public buttonActionOut: EventEmitter<unknown> = new EventEmitter<unknown>();

	public cardHeader!: _CustCardHeaderTableInterface[];
	public tableConfig!: _CustCardTableInterface[];
	public tablePropertiesConfig!: _CustTablePropertiesConfig[];
	public tableButtonConfig!: _CustCardButtonTableInterface[];

	public displayedColumns: string[] = ["item"];

	/** Re-reads `tableWrapper` whenever it gets a new reference (it used to be read once on init). */
	public ngOnChanges(): void {
		this.cardHeader = this.tableWrapper.cardHeaders;
		this.tableConfig = this.tableWrapper.cardTable;
		this.tablePropertiesConfig = this.tableWrapper.cardTableProperties;
		this.tableButtonConfig = this.tableWrapper.cardButtonTable;
	}

	public buttonEmit(data: unknown, action: string): void {
		const retObj = {
			action: action,
			data: data,
		};

		this.buttonActionOut.emit(retObj);
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

	public refresh(): void {
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

	public navigateToCreate(): void {
		const retObj = {
			action: "create",
			data: null,
		};

		this.buttonActionOut.emit(retObj);
	}

	public upperToggleChange(checked: boolean): void {
		const retObj = {
			action: "upperToggle",
			data: checked,
		};

		this.buttonActionOut.emit(retObj);
	}
}
