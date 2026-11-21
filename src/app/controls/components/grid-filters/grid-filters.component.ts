import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from "@angular/core";
import { DateAdapter, MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Sort } from "@angular/material/sort";
import { ReactiveFormsModule } from "@angular/forms";
import { _CustInputGeneral } from "@shared/models/cust-basic-controls";
import { _CustGridFilterItem } from "@shared/models/cust-grid-filter-item";

export interface _DisplayedColumnChoice {
	display: string;
	activated: boolean;
	value: string;
}

/**
 * Filter bar for the table and card-table controls: text, number, boolean, date, date-range and select filters,
 * plus optional refresh / add / sort / custom / column-chooser buttons. It only emits filter conditions; the parent
 * applies them (client-side or in its own API request).
 */
@Component({
	selector: "app-grid-filters",
	templateUrl: "./grid-filters.component.html",
	styleUrls: ["./grid-filters.component.scss"],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatNativeDateModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatTooltipModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFiltersComponent implements OnChanges {
	@Input() public gridFilters: _CustGridFilterItem | _CustGridFilterItem[] | null | undefined = null;
	@Input() public showSortButton = false;
	@Input() public showAddButton = true;
	@Input() public showCustomButton = false;
	@Input() public customButtonTooltip?: string = "";
	@Input() public customButtonIcon?: string = "";
	@Input() public showUpperToggle = false;
	@Input() public upperToggle?: _CustInputGeneral;
	@Input() public selectableColumns = false;
	@Input() public displayedColumns: string[] = [];
	@Input() public exporting = false;

	@Output() public refreshClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public clearButtonClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public filterChanged: EventEmitter<_CustGridFilterItem> = new EventEmitter<_CustGridFilterItem>();
	@Output() public sortChanged: EventEmitter<Sort> = new EventEmitter<Sort>();
	@Output() public addButtonClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public filterRefresh: EventEmitter<_CustGridFilterItem[]> = new EventEmitter<_CustGridFilterItem[]>();
	@Output() public customButtonClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public upperToggleChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public displayedColumnsChanged: EventEmitter<_DisplayedColumnChoice[]> = new EventEmitter<_DisplayedColumnChoice[]>();

	public sortDirection: "asc" | "desc" = "desc";
	public filterItems: _CustGridFilterItem[] = [];
	public columnChoices: _DisplayedColumnChoice[] = [];

	private readonly dateAdapter: DateAdapter<Date> = inject<DateAdapter<Date>>(DateAdapter);

	/**
	 * Inputs are re-read whenever they get a new reference (they used to be read once on init). The filter items are
	 * deep-copied: the bar edits its own copies and reports them through the outputs, never the caller's objects.
	 */
	public ngOnChanges(changes: SimpleChanges): void {
		if (`gridFilters` in changes) {
			this.filterItems = this.normalizeFilters(this.gridFilters).map((item: _CustGridFilterItem): _CustGridFilterItem => structuredClone(item));
			for (const item of this.filterItems) {
				this.rehydrateFilterDates(item);
			}
			this.filterRefresh.emit(this.filterItems);
		}
		if (`displayedColumns` in changes) {
			this.columnChoices = this.displayedColumns.map((column: string): _DisplayedColumnChoice => ({ display: column, activated: true, value: column }));
		}
	}

	public refresh(): void {
		this.refreshClicked.emit();
	}

	public clearFilters(): void {
		for (const item of this.filterItems) {
			item.active = false;
			item.config.options = {};
			item.filter.filters = [];
		}
		this.clearButtonClicked.emit();
	}

	public add(): void {
		this.addButtonClicked.emit();
	}

	public customButton(): void {
		this.customButtonClicked.emit();
	}

	public toggleSort(): void {
		this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
		this.sortChanged.emit({ active: "", direction: this.sortDirection });
	}

	public upperToggleChange(checked: boolean): void {
		this.upperToggleChanged.emit(checked);
	}

	public textChanged(item: _CustGridFilterItem, value: string): void {
		item.active = value.length > 0;
		item.config.options.text = value;
		item.filter.filters = value.length > 0 ? [{ field: item.name, operator: "contains", value: value }] : [];
		this.filterChanged.emit(item);
	}

	public dateChanged(item: _CustGridFilterItem, value: Date | null): void {
		item.active = value !== null;
		item.config.options.date = value ?? undefined;
		item.filter.filters = value ? [{ field: item.name, operator: "eq", value: value }] : [];
		this.filterChanged.emit(item);
	}

	public rangeChanged(item: _CustGridFilterItem, bound: "start" | "end", value: Date | null): void {
		const range = item.config.options.range ?? { start: null as Date | null, end: null as Date | null };
		range[bound] = value;
		item.config.options.range = range;
		item.active = range.start !== null && range.end !== null;
		item.filter.filters = item.active
			? [
					{ field: item.name, operator: "gte", value: range.start },
					{ field: item.name, operator: "lte", value: range.end },
				]
			: [];
		this.filterChanged.emit(item);
	}

	public selectChanged(item: _CustGridFilterItem, value: unknown): void {
		item.active = value !== null && value !== undefined && value !== "";
		item.filter.filters = item.active ? [{ field: item.name, operator: "eq", value: value }] : [];
		this.filterChanged.emit(item);
	}

	public toggleColumn(choice: _DisplayedColumnChoice): void {
		for (const item of this.columnChoices) {
			if (item.value === choice.value) {
				item.activated = !item.activated;
			}
		}
		this.displayedColumnsChanged.emit(this.columnChoices);
	}

	public rangeStart(item: _CustGridFilterItem): Date | null {
		return item.config.options.range?.start ?? null;
	}

	public rangeEnd(item: _CustGridFilterItem): Date | null {
		return item.config.options.range?.end ?? null;
	}

	private normalizeFilters(gridFilters: _CustGridFilterItem | _CustGridFilterItem[] | null | undefined): _CustGridFilterItem[] {
		if (!gridFilters) {
			return [];
		}
		return Array.isArray(gridFilters) ? gridFilters : [gridFilters];
	}

	private rehydrateFilterDates(item: _CustGridFilterItem): void {
		// filters restored from JSON (e.g. a fork's own cache) carry dates as ISO strings
		if (item.active && item.config.type === "date" && item.config.options.date) {
			item.config.options.date = this.dateAdapter.parse(item.config.options.date, "yyyy/MM/dd") ?? item.config.options.date;
		}
		if (item.active && item.config.type === "dateRange" && item.config.options.range) {
			item.config.options.range.start = this.dateAdapter.parse(item.config.options.range.start, "yyyy/MM/dd") ?? item.config.options.range.start;
			item.config.options.range.end = this.dateAdapter.parse(item.config.options.range.end, "yyyy/MM/dd") ?? item.config.options.range.end;
			for (const condition of item.filter.filters) {
				condition.value = new Date(condition.value as string);
			}
		}
	}
}
