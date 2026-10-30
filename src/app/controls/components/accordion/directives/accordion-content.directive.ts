import { Directive, inject, TemplateRef } from "@angular/core";

@Directive({
	selector: "[appAccordionContent]",
	standalone: true,
})
export class AccordionContentDirective {
	public readonly templateRef: TemplateRef<unknown> = inject(TemplateRef);
}
