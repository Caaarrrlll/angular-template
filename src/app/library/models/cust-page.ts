import { _CustGridFilterItem } from "@shared/models/cust-grid-filter-item";

/**
 * In-memory pagination state shared by the table and card-table paginators.
 * It has no storage side effects: a page that should survive a reload persists it itself.
 */
export class _CustPage {
	page = 0;
	pageSize = 25;
	pageTotal = 0;
	pageSizeOptions: number[] = [25, 50, 100, 200];
	filters: _CustGridFilterItem[] = [];

	/** Updates the given fields; `null`/`undefined` keeps the current value. */
	setAttributes(page?: number | null, pageSize?: number | null, pageTotal?: number | null, filters?: _CustGridFilterItem[], pageSizeOptions?: number[]): void {
		this.page = page ?? this.page;
		this.pageSize = pageSize ?? this.pageSize;
		this.pageTotal = pageTotal ?? this.pageTotal;
		this.pageSizeOptions = pageSizeOptions ?? this.pageSizeOptions;
		this.filters = filters ?? this.filters;
	}
}
