export interface CustTabConfig {
	tab: CustTab[];
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

export interface CustTab {
	tabName: string;
	index: number;
	classSelect: string;
	icon?: string;
	isProcess?: boolean;
	canProgress?: boolean;
	states?: CustTabState[];
	currentState?: string;
}

export interface CustTabState {
	stateName: string;
	stateIcon: string;
}
