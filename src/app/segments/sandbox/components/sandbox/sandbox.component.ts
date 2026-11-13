import { Component, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { _SandboxAccordionItem, SandboxAccordionDataService } from "@segments/sandbox/services/sandbox-accordion-data.service";
import { SandboxExpandableGridDataService } from "@segments/sandbox/services/sandbox-expandable-grid-data.service";
import { AccordionComponent } from "@shared/components/accordion/accordion.component";
import { AccordionContentDirective } from "@shared/components/accordion/directives/accordion-content.directive";
import { AccordionHeaderDirective } from "@shared/components/accordion/directives/accordion-header.directive";
import { AccordionItemDirective } from "@shared/components/accordion/directives/accordion-item.directive";
import { ExpandableGridComponent } from "@shared/components/expandable-grid/expandable-grid.component";
import { _ExpandableGridRow } from "@shared/components/expandable-grid/core/types/expandable-grid-row.type";
import { LoggerService } from "@shared/services/logger.service";

@Component({
	selector: "app-sandbox",
	templateUrl: "./sandbox.component.html",
	styleUrls: ["./sandbox.component.scss"],
	standalone: true,
	imports: [MatIconModule, AccordionComponent, AccordionContentDirective, AccordionHeaderDirective, AccordionItemDirective, ExpandableGridComponent],
})
export class SandboxComponent {
	private readonly logger = inject(LoggerService);
	private readonly accordionData = inject(SandboxAccordionDataService);
	private readonly expandableGridData = inject(SandboxExpandableGridDataService);

	public readonly accordionItems: _SandboxAccordionItem[] = this.accordionData.items;
	public readonly gridColumns = this.expandableGridData.columns;
	public readonly editableColumns = this.expandableGridData.editableColumns;
	public readonly gridRules = this.expandableGridData.rules;
	public readonly gridForm: FormGroup = this.expandableGridData.createForm();
	public gridRows: _ExpandableGridRow[] = this.expandableGridData.rows;

	public onAccordionExpanded(expanded: boolean): void {
		this.logger.log(`Accordion item toggled: ${expanded}`);
	}

	public onGridDelete(row: _ExpandableGridRow): void {
		this.gridRows = this.gridRows.filter((item) => item["id"] !== row["id"]);
		this.logger.log(`Deleted sandbox row ${String(row["id"])}`);
	}

	public onGridSave(value: unknown): void {
		const row = value as _ExpandableGridRow;
		const id = row["id"];

		if (id === null || id === undefined) {
			this.gridRows = [{ ...row, id: this.nextId() }, ...this.gridRows];
		} else {
			this.gridRows = this.gridRows.map((item) => (item["id"] === id ? { ...item, ...row } : item));
		}

		this.logger.log(`Saved sandbox row ${String(id ?? "new")}`);
	}

	private nextId(): number {
		return this.gridRows.reduce((max, item) => Math.max(max, Number(item["id"] ?? 0)), 0) + 1;
	}
}
