import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { DateAdapter, MatNativeDateModule, provideNativeDateAdapter } from "@angular/material/core";
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
import { CustInputGeneral } from "@shared/models/cust-basic-controls";
import { _LinQGridFilterItem } from "./linq-grid-filter-item.model";

export interface _DisplayedColumnChoice {
	display: string;
	activated: boolean;
	value: string;
}

/**
 * Rebuilt minimal replacement for the legacy Kendo-based linq grid filter bar
 * (legacy source was not present in the repo; rebuilt best-effort against the
 * API consumed by the table and card-table controls, with the custom-backend
 * filter logic intentionally omitted).
 */
@Component({
	selector: "app-linq-grid-filters",
	templateUrl: "./linq-grid-filters.component.html",
	styleUrls: ["./linq-grid-filters.component.scss"],
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
	providers: [provideNativeDateAdapter()],
})
export class LinqGridFiltersComponent implements OnInit {
	@Input() public gridFilters: _LinQGridFilterItem | _LinQGridFilterItem[] | null | undefined = null;
	@Input() public showSortButton: boolean = false;
	@Input() public showAddButton: boolean = true;
	@Input() public showCustomButton: boolean = false;
	@Input() public customButtonTooltip?: string = "";
	@Input() public customButtonIcon?: string = "";
	@Input() public showUpperToggle: boolean = false;
	@Input() public upperToggle?: CustInputGeneral;
	@Input() public selectableColumns: boolean = false;
	@Input() public displayedColumns: string[] = [];
	@Input() public exporting: boolean = false;

	@Output() public refreshClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public clearButtonClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public filterChanged: EventEmitter<_LinQGridFilterItem> = new EventEmitter<_LinQGridFilterItem>();
	@Output() public sortChanged: EventEmitter<Sort> = new EventEmitter<Sort>();
	@Output() public addButtonClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public filterRefresh: EventEmitter<_LinQGridFilterItem[]> = new EventEmitter<_LinQGridFilterItem[]>();
	@Output() public customButtonClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public upperToggleChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public displayedColumnsChanged: EventEmitter<_DisplayedColumnChoice[]> = new EventEmitter<_DisplayedColumnChoice[]>();

	public sortDirection: "asc" | "desc" = "desc";
	public filterItems: _LinQGridFilterItem[] = [];
	public columnChoices: _DisplayedColumnChoice[] = [];

	private readonly dateAdapter: DateAdapter<Date> = inject(DateAdapter);

	public ngOnInit(): void {
		this.filterItems = this.normalizeFilters(this.gridFilters);
		for (const item of this.filterItems) {
			this.rehydrateFilterDates(item);
		}
		this.columnChoices = this.displayedColumns.map((column: string): _DisplayedColumnChoice => ({ display: column, activated: true, value: column }));
		this.filterRefresh.emit(this.filterItems);
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

	public textChanged(item: _LinQGridFilterItem, value: string): void {
		item.active = value.length > 0;
		item.config.options["text"] = value;
		item.filter.filters = value.length > 0 ? [{ field: item.name, operator: "contains", value: value }] : [];
		this.filterChanged.emit(item);
	}

	public dateChanged(item: _LinQGridFilterItem, value: Date | null): void {
		item.active = value !== null;
		item.config.options["date"] = value ?? undefined;
		item.filter.filters = value ? [{ field: item.name, operator: "eq", value: value }] : [];
		this.filterChanged.emit(item);
	}

	public rangeChanged(item: _LinQGridFilterItem, bound: "start" | "end", value: Date | null): void {
		const range = item.config.options.range ?? { start: null as Date | null, end: null as Date | null };
		range[bound] = value;
		item.config.options["range"] = range;		item.active = range.start !== null && range.end !== null;
		item.filter.filters = item.active
			? [
					{ field: item.name, operator: "gte", value: range.start },
					{ field: item.name, operator: "lte", value: range.end },
			  ]
			: [];
		this.filterChanged.emit(item);
	}

	public selectChanged(item: _LinQGridFilterItem, value: unknown): void {
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

	public rangeStart(item: _LinQGridFilterItem): Date | null {
		return (item.config.options.range?.start as Date) ?? null;
	}

	public rangeEnd(item: _LinQGridFilterItem): Date | null {
		return (item.config.options.range?.end as Date) ?? null;
	}

	private normalizeFilters(gridFilters: _LinQGridFilterItem | _LinQGridFilterItem[] | null | undefined): _LinQGridFilterItem[] {
		if (!gridFilters) {
			return [];
		}
		return Array.isArray(gridFilters) ? gridFilters : [gridFilters];
	}

	private rehydrateFilterDates(item: _LinQGridFilterItem): void {
		// cached filters come back from sessionStorage as ISO strings
		if (item.active && item.config.type === "date" && item.config.options.date) {
			item.config.options.date = this.dateAdapter.parse(item.config.options.date as unknown as string, "yyyy/MM/dd") ?? item.config.options.date;
		}
		if (item.active && item.config.type === "dateRange" && item.config.options.range) {
			item.config.options.range.start = this.dateAdapter.parse(item.config.options.range.start as unknown as string, "yyyy/MM/dd") ?? item.config.options.range.start;
			item.config.options.range.end = this.dateAdapter.parse(item.config.options.range.end as unknown as string, "yyyy/MM/dd") ?? item.config.options.range.end;
			for (const condition of item.filter.filters) {
				condition.value = new Date(condition.value as unknown as string);
			}
		}
	}
}
