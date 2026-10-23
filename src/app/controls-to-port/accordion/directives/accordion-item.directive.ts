import { ContentChild, Directive, Input } from "@angular/core";
import { AccordionHeader } from "src/app/controls/accordion/directives/accordian-header.directive";
import { AccordionContent } from "src/app/controls/accordion/directives/accordion-content.directive";

@Directive({
	selector: "accordion-item",
})
export class AccordionItem {
	@Input() title = "";
	@Input() disabled = false;
	@ContentChild(AccordionContent) content: AccordionContent;
	@ContentChild(AccordionHeader) customHeader: AccordionHeader;
}
