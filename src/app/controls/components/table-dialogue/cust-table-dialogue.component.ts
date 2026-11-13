import { CommonModule } from "@angular/common";
import { Component, Inject, Input, OnInit, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ButtonTertiaryComponent } from "@shared/components/button/button-tertiary/button-tertiary.component";
import { _CustTableInterface } from "@shared/components/table/cust-table.interface";
import { CurrencyComponent } from "@shared/components/currency/currency.component";
import { CustButtonInput } from "@shared/models/cust-basic-controls";
import { PostfixPipe } from "@shared/pipes/postfix/postfix.pipe";
import { ThousandSeparatorPipe } from "@shared/pipes/thousand-separator/thousand-separator.pipe";

@Component({
	selector: "app-cust-table-dialogue",
	templateUrl: "./cust-table-dialogue.component.html",
	styleUrls: ["./cust-table-dialogue.component.scss"],
	imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule, CurrencyComponent, ButtonTertiaryComponent, PostfixPipe, ThousandSeparatorPipe],
})
export class CustTableDialogueComponent implements OnInit {
	@Input() public dataSource!: MatTableDataSource<Record<string, unknown>>;
	@Input() public tableConfig!: _CustTableInterface[];
	@Input() public title: string = "";
	public displayedColumns?: string[];

	public readonly dialogRef = inject<MatDialogRef<CustTableDialogueComponent>>(MatDialogRef);

	constructor(@Inject(MAT_DIALOG_DATA) public data: Record<string, unknown>) {}

	public ngOnInit(): void {
		if (this.data["title"]) this.title = this.data["title"] as string;
		if (this.data["dataSource"]) this.dataSource = this.data["dataSource"] as MatTableDataSource<Record<string, unknown>>;

		if (this.data["tableConfig"]) {
			this.tableConfig = this.data["tableConfig"] as _CustTableInterface[];
			this.displayedColumns = this.tableConfig.map((config: _CustTableInterface): string => config.colName);
		}
	}

	public tableButton(column: _CustTableInterface): CustButtonInput {
		return {
			type: "",
			icon: column.icon ? column.icon : "",
			iconSide: column.icon ? "left" : "",
			tooltip: column.tooltip ? column.tooltip : "",
			display: column.disableDisplay ? "" : column.display,
			value: column.colName,
			disabled: false,
			isTableButton: true,
		};
	}

	public navigateToStock(element: Record<string, unknown>): void {
		this.dialogRef.close(element);
	}

	public closeDialog(): void {
		this.dialogRef.close();
	}
}
