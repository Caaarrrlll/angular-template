import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { _ExpandableGridDisplayOptionsInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-display-options.interface";
import { _ExpandableGridOptionsInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-options.interface";
import { _ExpandableGridRulesInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-rules.interface";
import { _ExpandableGridRow } from "@shared/components/expandable-grid/core/types/expandable-grid-row.type";

@Injectable({
	providedIn: "root",
})
export class SandboxExpandableGridDataService {
	private readonly formBuilder = new FormBuilder();

	public readonly columns: _ExpandableGridDisplayOptionsInterface[] = [
		{ columnDef: "name", header: "Name" },
		{ columnDef: "email", header: "Email" },
		{ columnDef: "status", header: "Status" },
		{
			columnDef: "balance",
			header: "Balance",
			cell: (row) => `R ${Number(row["balance"] ?? 0).toFixed(2)}`,
		},
	];

	public readonly editableColumns: _ExpandableGridOptionsInterface[] = [
		{ key: "name", type: "input", title: "Name", maxLength: 80 },
		{ key: "email", type: "input", title: "Email", maxLength: 120 },
		{
			key: "status",
			type: "dropdown",
			title: "Status",
			typeValues: {
				active: "Active",
				pending: "Pending",
				suspended: "Suspended",
			},
		},
		{ key: "balance", type: "input", title: "Balance" },
	];

	public readonly rules: _ExpandableGridRulesInterface = {
		delete: true,
		edit: true,
		view: true,
		arrow: true,
	};

	public readonly rows: _ExpandableGridRow[] = [
		{ id: 1, name: "Acme Holdings", email: "ops@acme.test", status: "active", balance: 12450.5 },
		{ id: 2, name: "Bluebird Logistics", email: "accounts@bluebird.test", status: "pending", balance: 8790 },
		{ id: 3, name: "Cobalt Mining", email: "finance@cobalt.test", status: "suspended", balance: 42100.75 },
		{ id: 4, name: "Delta Retail", email: "hello@delta.test", status: "active", balance: 1550 },
	];

	public createForm(): FormGroup {
		return this.formBuilder.group({
			id: [null],
			name: ["", [Validators.required, Validators.maxLength(80)]],
			email: ["", [Validators.required, Validators.email]],
			status: ["active", [Validators.required]],
			balance: [0, [Validators.required]],
		});
	}
}
