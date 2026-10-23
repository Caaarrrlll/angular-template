import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmationDialogComponent } from "@controls/index";
import { _CustTableInterface } from "@controls/cust-table/interfaces/cust-table.interface";

@Component({
	selector: "app-cust-table-dialogue",
	templateUrl: "./cust-table-dialogue.component.html",
	styleUrls: ["./cust-table-dialogue.component.scss"],
})
export class CustTableDialogueComponent implements OnInit {
	@Input() dataSource: MatTableDataSource<any>;
	@Input() tableConfig: _CustTableInterface[];
	@Input() title: string;
	displayedColumns: string[];

	constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

	ngOnInit(): void {
		if (this.data.title) this.title = this.data.title;
		if (this.data.dataSource) this.dataSource = this.data.dataSource;

		if (this.data.tableConfig) {
			this.tableConfig = this.data.tableConfig;
			this.displayedColumns = this.tableConfig.map((config) => config.colName);
		}
	}

	navigateToStock(element): void {
		this.dialogRef.close(element);
	}

	closeDialog(): void {
		this.dialogRef.close();
	}
}
