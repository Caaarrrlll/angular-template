import { _LinQGridFilterItem } from "@controls/linq-grid-filters/linq-grid-filter-item.model";

export class _CUSTPage {
	page: number = 0;
	pageSize: number = 25;
	pageTotal: number = 0;
	pageSizeOptions: number[] = [25, 50, 100, 200];
	filters: _LinQGridFilterItem[] = [];
	lastScrollPosition: string = "";

	constructor(pageStorageName: string) {
		const cacheString: string | null = sessionStorage.getItem(pageStorageName);

		if (typeof cacheString == "string") {
			const cache = JSON.parse(cacheString);
			if (cache) {
				this.page = cache.page;
				this.pageSize = cache.pageSize;
				this.pageTotal = cache.pageTotal;
				this.pageSizeOptions = cache.pageSizeOptions;
				this.filters = cache.filters;
				this.lastScrollPosition = cache.lastScrollPosition;
			}
		}
	}

	setPageCache(pageStorageName: string) {
		sessionStorage.setItem(pageStorageName, JSON.stringify(this));
	}

	setAttributes(
		pageStorageName: string,
		page?: number | null,
		pageSize?: number | null,
		pageTotal?: number | null,
		filters?: _LinQGridFilterItem[],
		pageSizeOptions?: number[],
		lastScrollPosition?: string
	) {
		this.page = page != undefined && page != null ? page : this.page;
		this.pageSize = pageSize != undefined && pageSize != null ? pageSize : this.pageSize;
		this.pageTotal = pageTotal != undefined && pageTotal != null ? pageTotal : this.pageTotal;
		this.pageSizeOptions = pageSizeOptions != undefined && pageSizeOptions != null ? pageSizeOptions : this.pageSizeOptions;
		this.filters = filters !== undefined && filters !== null ? filters : this.filters;
		this.lastScrollPosition = lastScrollPosition != undefined && lastScrollPosition != null ? lastScrollPosition : this.lastScrollPosition;
		this.setPageCache(pageStorageName);
	}
}
