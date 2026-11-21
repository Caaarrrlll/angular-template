import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

interface _SandboxFamilyCard {
	path: string;
	title: string;
	description: string;
}

@Component({
	selector: "app-sandbox",
	templateUrl: "./sandbox.component.html",
	styleUrls: ["./sandbox.component.scss"],
	imports: [RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxComponent {
	public readonly families: _SandboxFamilyCard[] = [
		{
			path: "buttons",
			title: "Buttons",
			description: "button (all _CustButtonType variants), button-toggle, fab-button.",
		},
		{
			path: "inputs",
			title: "Inputs",
			description: "input-text/email/number/phone/currency/select with validation and error states.",
		},
		{
			path: "data-display",
			title: "Data display",
			description: "key-value trio, chips, chip-status.",
		},
		{
			path: "cards",
			title: "Cards",
			description: "card, card-header, housing-card, info-card, list-card.",
		},
		{
			path: "small-controls",
			title: "Small controls",
			description: "loader, currency, slide-toggle, numeric-up-down, count-down.",
		},
		{
			path: "media",
			title: "Media",
			description: "carousel, gallery, gallery-preview, zoom-image, zoomable-image.",
		},
		{
			path: "tabs",
			title: "Tabs",
			description: "tab-group, tabs + tab with back/next navigation.",
		},
		{
			path: "selection",
			title: "Selection",
			description: "checkbox-group, range-checkbox-group, range-date-picker, time-span-picker, range-slider.",
		},
		{
			path: "dialogs",
			title: "Dialogs",
			description: "media-dialog, confirmation-dialog, table-dialogue, dynamic-material-dialog, dynamic-window.",
		},
		{
			path: "upload",
			title: "Upload",
			description: "drag-drop-file-upload with the drag-and-drop-files directive.",
		},
		{
			path: "tables",
			title: "Tables",
			description: "table, card-table, expandable-grid, grid-filters.",
		},
		{
			path: "misc",
			title: "Misc",
			description: "accordion, search-address, copy-text + zoom directive demos.",
		},
		{
			path: "forms",
			title: "Signal Forms",
			description: "Reference demo: new form work built with @angular/forms/signals.",
		},
	];
}
