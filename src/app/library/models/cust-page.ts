import { _LinQGridFilterItem } from "@shared/models/linq-grid-filter-item";

/**
 * In-memory pagination state shared by the table and card-table paginators.
 * It has no storage side effects: a page that should survive a reload persists it itself.
 */
export class _CUSTPage {
	page = 0;
	pageSize = 25;
	pageTotal = 0;
	pageSizeOptions: number[] = [25, 50, 100, 200];
	filters: _LinQGridFilterItem[] = [];

	/** Updates the given fields; `null`/`undefined` keeps the current value. */
	setAttributes(page?: number | null, pageSize?: number | null, pageTotal?: number | null, filters?: _LinQGridFilterItem[], pageSizeOptions?: number[]): void {
		this.page = page ?? this.page;
		this.pageSize = pageSize ?? this.pageSize;
		this.pageTotal = pageTotal ?? this.pageTotal;
		this.pageSizeOptions = pageSizeOptions ?? this.pageSizeOptions;
		this.filters = filters ?? this.filters;
	}
}
