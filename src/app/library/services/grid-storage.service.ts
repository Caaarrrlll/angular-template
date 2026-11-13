import { Injectable } from "@angular/core";
import { _LinQGridFilterCondition, _LinQGridFilterItem } from "@shared/components/linq-grid-filters/linq-grid-filter-item.model";
import { LinQRequestState } from "@shared/models/lin-q-request-state";

@Injectable({
	providedIn: "root",
})
export class GridStorageService {
	public state: LinQRequestState = {
		skip: 0,
		take: 50,
		sorts: [
			{
				field: "creationDate",
				direction: "desc",
			},
		],
	};

	public getCachedFilters(name: string): _LinQGridFilterItem[] {
		const stored: string | null = sessionStorage.getItem(name);
		const filters: _LinQGridFilterItem[] = stored ? (JSON.parse(stored) as _LinQGridFilterItem[]) : [];

		filters.map((filter: _LinQGridFilterItem): _LinQGridFilterItem => {
			if (filter.active) {
				if (filter.config.type === "date" && filter.config.options.date) {
					filter.config.options.date = new Date(filter.config.options.date);
				}
				if (filter.config.type === "dateRange" && filter.config.options.range) {
					if (filter.config.options.range.start) {
						filter.config.options.range.start = new Date(filter.config.options.range.start);
					}
					if (filter.config.options.range.end) {
						filter.config.options.range.end = new Date(filter.config.options.range.end);
					}

					filter.filter.filters.map((intFilter: _LinQGridFilterCondition): _LinQGridFilterCondition => {
						intFilter.value = new Date(intFilter.value as string | number | Date);
						return intFilter;
					});
				}
			}
			return filter;
		});
		return filters;
	}

	public setCachedFilters(name: string, setup: _LinQGridFilterItem[]): void {
		sessionStorage.setItem(name, JSON.stringify(setup));
	}

	public setLinQCachedFilters(name: string, setup: LinQRequestState): void {
		sessionStorage.setItem(name, JSON.stringify(setup));
	}

	public getLinQCachedFilters(name: string): LinQRequestState {
		const stored: string | null = sessionStorage.getItem(name);
		return stored ? (JSON.parse(stored) as LinQRequestState) : this.state;
	}
}
