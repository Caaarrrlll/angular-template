import { _LinQGridFilterItem } from "@shared/components/linq-grid-filters/linq-grid-filter-item.model";

export class _CUSTPage {
	page = 0;
	pageSize = 25;
	pageTotal = 0;
	pageSizeOptions: number[] = [25, 50, 100, 200];
	filters: _LinQGridFilterItem[] = [];
	lastScrollPosition = "";

	constructor(pageStorageName: string) {
		const cacheString: string | null = sessionStorage.getItem(pageStorageName);

		if (typeof cacheString === "string") {
			const cache: unknown = JSON.parse(cacheString);
			if (cache) {
				const parsedCache = cache as _CUSTPage;
				this.page = parsedCache.page;
				this.pageSize = parsedCache.pageSize;
				this.pageTotal = parsedCache.pageTotal;
				this.pageSizeOptions = parsedCache.pageSizeOptions;
				this.filters = parsedCache.filters;
				this.lastScrollPosition = parsedCache.lastScrollPosition;
			}
		}
	}

	setPageCache(pageStorageName: string): void {
		sessionStorage.setItem(pageStorageName, JSON.stringify(this));
	}

	setAttributes(
		pageStorageName: string,
		page?: number | null,
		pageSize?: number | null,
		pageTotal?: number | null,
		filters?: _LinQGridFilterItem[],
		pageSizeOptions?: number[],
		lastScrollPosition?: string,
	): void {
		this.page = page ?? this.page;
		this.pageSize = pageSize ?? this.pageSize;
		this.pageTotal = pageTotal ?? this.pageTotal;
		this.pageSizeOptions = pageSizeOptions ?? this.pageSizeOptions;
		this.filters = filters ?? this.filters;
		this.lastScrollPosition = lastScrollPosition ?? this.lastScrollPosition;
		this.setPageCache(pageStorageName);
	}
}
