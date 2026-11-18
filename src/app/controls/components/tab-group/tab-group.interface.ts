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

/** One tab. For `tabType: "vertical"` the process-gap/divider styling covers the first 12 tabs. */
export interface CustTab {
	tabName: string;
	index: number;
	/** Key of this tab's content: `<ng-template appTabGroupContent="<classSelect>">` (AUD-16). */
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
