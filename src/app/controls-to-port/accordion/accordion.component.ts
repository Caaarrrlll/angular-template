import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from "@angular/core";
import { AccordionItem } from "src/app/controls/accordion/directives/accordion-item.directive";

@Component({
	selector: "app-accordion",
	templateUrl: "./accordion.component.html",
	styleUrls: ["./accordion.component.scss"],
	animations: [
		trigger("contentExpansion", [
			state("expanded", style({ height: "*", opacity: 1, visibility: "visible" })),
			state("collapsed", style({ height: "0px", opacity: 0, visibility: "hidden" })),
			transition("expanded <=> collapsed", animate("200ms cubic-bezier(.37,1.04,.68,.98)")),
		]),
	],
})
export class AccordionComponent implements OnInit {
	expanded = new Set<number>();
	@Input() collapsing = true;
	@Input() expandFirst = false;
	@ContentChildren(AccordionItem) items: QueryList<AccordionItem>;
	@Output() expandedItem = new EventEmitter();

	ngOnInit(): void {
		if (this.expandFirst) this.toggleState(0);
	}

	getToggleState = (index: number) => {
		return this.toggleState.bind(this, index);
	};

	toggleState = (index: number) => {
		if (this.expanded.has(index)) {
			this.expanded.delete(index);
			this.expandedItem.emit(false);
		} else {
			if (this.collapsing) {
				this.expanded.clear();
			}
			this.expanded.add(index);
			this.expandedItem.emit(true);
		}
	};
}
