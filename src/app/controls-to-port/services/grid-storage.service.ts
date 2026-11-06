import { Injectable } from "@angular/core";
import { DataSourceRequestState } from "@progress/kendo-data-query";
import { GridFilter } from "src/app/controls/grid-filters/filters.model";

@Injectable({
	providedIn: "root",
})
export class GridStorageService {
	state: DataSourceRequestState = {
		skip: 0,
		take: 50,
		sort: [
			{
				field: "creationDate",
				dir: "desc",
			},
		],
		filter: {
			filters: [],
			logic: "and",
		},
	};

	constructor() {}

	getCachedFilters(name: string) {
		let filters = JSON.parse(sessionStorage.getItem(name));

		filters?.map((filter) => {
			if (filter.active) {
				if (filter.config.type == "date") {
					filter.config.options.date = new Date(filter.config.options.date);
				}
				if (filter.config.type == "dateRange") {
					filter.config.options.range.start = new Date(filter.config.options.range.start);
					filter.config.options.range.end = new Date(filter.config.options.range.end);

					filter.filter.filters.map((intFilter) => {
						return (intFilter.value = new Date(intFilter.value));
					});
				}
				return filter;
			}
		});
		return filters;
	}

	setCachedFilters(name: string, setup: GridFilter[]) {
		sessionStorage.setItem(name, JSON.stringify(setup));
	}

	setLinQCachedFilters(name: string, setup: any) {
		sessionStorage.setItem(name, JSON.stringify(setup));
	}

	getLinQCachedFilters(name: string) {
		return JSON.parse(sessionStorage.getItem(name));
	}
}
