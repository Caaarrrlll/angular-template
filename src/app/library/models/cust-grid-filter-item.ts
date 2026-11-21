export interface _CustGridFilterCondition {
	field: string;
	operator?: string;
	value: unknown;
}

export interface _CustGridFilterConfig {
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
 * One filter of the grid-filters bar: its config (type + options) and the conditions it currently produces.
 */
export interface _CustGridFilterItem {
	name: string;
	display?: string;
	active?: boolean;
	config: _CustGridFilterConfig;
	filter: {
		filters: _CustGridFilterCondition[];
		logic?: "and" | "or";
	};
}
