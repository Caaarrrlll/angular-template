export interface _LinQGridFilterCondition {
	field: string;
	operator?: string;
	value: unknown;
}

export interface _LinQGridFilterConfig {
	type: "text" | "number" | "boolean" | "date" | "dateRange" | "select";
	options: {
		date?: Date;
		range?: { start: Date | null; end: Date | null };
		text?: string;
		optionsList?: { display: string; value: unknown }[];
		[key: string]: unknown;
	};
}

/**
 * Minimal rebuild of the legacy linq grid filter item (legacy source was not
 * present in the repo; shape inferred from the cached-filter usage in
 * `GridStorageService` and the filter-bar consumers).
 */
export interface _LinQGridFilterItem {
	name: string;
	display?: string;
	active?: boolean;
	config: _LinQGridFilterConfig;
	filter: {
		filters: _LinQGridFilterCondition[];
		logic?: "and" | "or";
	};
}
