import { _Dictionary } from "@controls/index";
import { _TableTypes } from "@shared/components/table/cust-table.enum";

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
}
