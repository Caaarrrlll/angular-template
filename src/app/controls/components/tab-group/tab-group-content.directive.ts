import { Directive, InputSignal, TemplateRef, inject, input } from "@angular/core";

/**
 * Marks the content of one tab in `app-tab-group`. The key matches `_CustTab.classSelect`.
 *
 * @example
 *      <app-tab-group [tabList]="tabs">
 *          <ng-template appTabGroupContent="overview">Overview content</ng-template>
 *          <ng-template appTabGroupContent="details">Details content</ng-template>
 *      </app-tab-group>
 */
@Directive({
	selector: "ng-template[appTabGroupContent]",
})
export class TabGroupContentDirective {
	public readonly key: InputSignal<string> = input.required<string>({ alias: `appTabGroupContent` });
	public readonly templateRef: TemplateRef<unknown> = inject<TemplateRef<unknown>>(TemplateRef);
}
