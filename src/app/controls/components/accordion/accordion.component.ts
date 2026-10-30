import { accordionExpansionAnimation } from "@animations/accordion-expansion-animation";
import { NgTemplateOutlet } from "@angular/common";
import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from "@angular/core";
import { AccordionItemDirective } from "@shared/components/accordion/directives/accordion-item.directive";

@Component({
	selector: "app-accordion",
	templateUrl: "./accordion.component.html",
	styleUrls: ["./accordion.component.scss"],
	standalone: true,
	imports: [NgTemplateOutlet],
})
export class AccordionComponent implements OnInit {
	public readonly animation = accordionExpansionAnimation;
	public expanded = new Set<number>();

	@Input() public collapsing = true;
	@Input() public expandFirst = false;
	@ContentChildren(AccordionItemDirective) public items!: QueryList<AccordionItemDirective>;
	@Output() public expandedItem = new EventEmitter<boolean>();

	public ngOnInit(): void {
		if (this.expandFirst) {
			this.toggleState(0);
		}
	}

	public readonly toggleState = (index: number): void => {
		if (this.expanded.has(index)) {
			this.expanded.delete(index);
			this.expandedItem.emit(false);
			return;
		}

		if (this.collapsing) {
			this.expanded.clear();
		}

		this.expanded.add(index);
		this.expandedItem.emit(true);
	};
}
