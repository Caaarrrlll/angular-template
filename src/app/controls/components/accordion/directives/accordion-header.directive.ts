import { Directive, inject, TemplateRef } from "@angular/core";

@Directive({
	selector: "[appAccordionHeader]",
})
export class AccordionHeaderDirective {
	public readonly templateRef: TemplateRef<unknown> = inject(TemplateRef);
}
