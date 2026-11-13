import { _HeaderAlignment, _HeaderTypes } from "./list-card.enum";

export interface _CustCardHeaderDataInterface {
	text: string;
	type: _HeaderTypes | string;
	alignment?: _HeaderAlignment;
	textColor?: string;
	textPre?: string;
	textExtended?: string;
	fontSize?: string;
	length?: number;
	icon?: string;
	statusType?: string;
	postText?: string;
	postLable?: string;
}
