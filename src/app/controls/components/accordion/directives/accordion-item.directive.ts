import { ContentChild, Directive, Input } from "@angular/core";
import { AccordionContentDirective } from "@shared/components/accordion/directives/accordion-content.directive";
import { AccordionHeaderDirective } from "@shared/components/accordion/directives/accordion-header.directive";

@Directive({
	selector: "[appAccordionItem]",
	standalone: true,
})
export class AccordionItemDirective {
	@Input() public title = "";
	@Input() public disabled = false;
	@ContentChild(AccordionContentDirective) public content?: AccordionContentDirective;
	@ContentChild(AccordionHeaderDirective) public customHeader?: AccordionHeaderDirective;
}
