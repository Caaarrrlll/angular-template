export interface _CustTabInterface {
	tab: _CustTabCoreInterface[];
	tabType: string;
	tabRadius?: string;
	tabLabelBackgroundColor?: string;
	tabLabelColor?: string;
	tabLabelHoverColor?: string;
	matTabHeaderBackgroundColor?: string;
	matTabMinWidth?: string;
	tabwidth?: string;
	matTabLabelBottomPadding?: string;
	matTabHeaderRightBackgroundColor?: string;
	matTabLableDefaultBackgroundColor?: string;
	matTabLabelTextAlign?: string;
	fontSize?: string;
}

export interface _CustTabCoreInterface {
	tabName: string;
	index: number;
	classSelect: string;
	icon?: string;
	isProcess?: boolean;
	canProgress?: boolean;
	states?: _CustTabStateInterface[];
	currentState?: string;
}

export interface _CustTabStateInterface {
	stateName: string;
	stateIcon: string;
}
