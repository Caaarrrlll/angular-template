import { _Dictionary, _TableTypes } from "./cust-table.enum";

export interface _CustTableInterface {
	display: string;
	colName: string;
	sticky?: boolean;
	type?: _TableTypes;
	width: string;
	highlightColor?: string[];
	disableSort?: boolean;
	icon?: string;
	tooltip?: string;
	dictionary?: _Dictionary<string>;
	disableDisplay?: boolean;
	timeZone?: string;
}
