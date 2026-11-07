import { Injectable } from "@angular/core";

export interface _SandboxAccordionItem {
	title: string;
	body: string;
	disabled: boolean;
}

@Injectable({
	providedIn: "root",
})
export class SandboxAccordionDataService {
	public readonly items: _SandboxAccordionItem[] = [
		{
			title: "Account overview",
			body: "Mock account summary used to exercise the accordion content projection.",
			disabled: false,
		},
		{
			title: "Billing history",
			body: "Mock invoice history with a longer body so the expansion animation has something to reveal.",
			disabled: false,
		},
		{
			title: "Disabled item",
			body: "This item should not be expandable because it is disabled.",
			disabled: true,
		},
		{
			title: "Support tickets",
			body: "Mock support ticket content rendered through the accordion content directive.",
			disabled: false,
		},
	];
}
