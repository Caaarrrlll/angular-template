import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ConfirmationDialogComponent } from "@shared/components/confirmation-dialog/confirmation-dialog.component";
import { _ConfirmationDialogData } from "@shared/components/confirmation-dialog/confirmation-dialog.interface";
import { ExpandableGridFormComponent } from "@shared/components/expandable-grid/components/expandable-grid-form/expandable-grid-form.component";
import { _ExpandableGridAdditionalButtonInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-additional-button.interface";
import { _ExpandableGridDisplayOptionsInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-display-options.interface";
import { _ExpandableGridOptionsInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-options.interface";
import { _ExpandableGridRulesInterface } from "@shared/components/expandable-grid/core/interfaces/expandable-grid-rules.interface";
import { _ExpandableGridPaginatedDataInterface } from "@shared/components/expandable-grid/core/interfaces/paginated-response.interface";
import { _ExpandableGridRow } from "@shared/components/expandable-grid/core/types/expandable-grid-row.type";
import { TruncatePipe } from "@shared/pipes/truncate/truncate.pipe";
import { first } from "rxjs";

export type _ExpandableGridData<T> = _ExpandableGridPaginatedDataInterface<T> | T[];

@Component({
	selector: "app-expandable-grid",
	templateUrl: "./expandable-grid.component.html",
	styleUrls: ["./expandable-grid.component.scss"],
	standalone: true,
	imports: [MatButtonModule, MatDialogModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule, ExpandableGridFormComponent, TruncatePipe],
})
export class ExpandableGridComponent implements OnInit {
	private readonly dialog = inject(MatDialog);
	private _gridData?: _ExpandableGridData<_ExpandableGridRow>;
	private _paginator?: MatPaginator;

	public expandColumns: string[] = [];
	public expandedElement?: _ExpandableGridRow;
	public dataSource: MatTableDataSource<_ExpandableGridRow> = new MatTableDataSource<_ExpandableGridRow>();
	public showAdd = true;

	@Input()
	public get gridData(): _ExpandableGridData<_ExpandableGridRow> | undefined {
		return this._gridData;
	}

	public set gridData(value: _ExpandableGridData<_ExpandableGridRow> | undefined) {
		if (!value) {
			return;
		}

		this._gridData = value;
		this.initialize();
	}

	@Input() public isDisabled = false;
	@Input() public additionalButton?: _ExpandableGridAdditionalButtonInterface;
	@Input() public displayedColumns: _ExpandableGridDisplayOptionsInterface<_ExpandableGridRow>[] = [];
	@Input() public form!: FormGroup;
	@Input() public isLoading = false;
	@Input() public editableColumns: _ExpandableGridOptionsInterface[] = [];
	@Input() public pageSizeOptions: number[] = [10, 25, 50, 100];
	@Input() public gridRules: _ExpandableGridRulesInterface = {
		delete: true,
		edit: true,
		view: true,
		arrow: false,
	};

	@Output() public delete = new EventEmitter<_ExpandableGridRow>();
	@Output() public save = new EventEmitter<unknown>();
	@Output() public pageChange = new EventEmitter<PageEvent>();
	@Output() public expand = new EventEmitter<_ExpandableGridRow>();

	@ViewChild("paginator")
	public set paginator(value: MatPaginator | undefined) {
		this._paginator = value;
	}

	public get paginatedData(): _ExpandableGridPaginatedDataInterface<_ExpandableGridRow> | undefined {
		return this._gridData && !Array.isArray(this._gridData) ? this._gridData : undefined;
	}

	public ngOnInit(): void {
		this.expandColumns = [...this.displayedColumns.map((column) => column.columnDef), "expand"];
	}

	public formatCell(column: _ExpandableGridDisplayOptionsInterface<_ExpandableGridRow>, element: _ExpandableGridRow): string {
		const value = column.cell?.(element) ?? element[column.columnDef];
		return value === null || value === undefined || value === "null" ? "" : String(value);
	}

	public openReadonlyElement(element: _ExpandableGridRow, event?: Event): void {
		event?.stopPropagation();
		this.expandedElement = this.expandedElement === element ? undefined : element;
		this.form.disable();
		this.showAdd = !this.showAdd;
	}

	public openElement(element: _ExpandableGridRow, cellIndex?: number, event?: Event): void {
		event?.stopPropagation();
		this.expand.emit(element);
		this.expandedElement = this.expandedElement === element ? undefined : element;

		if (this.expandedElement && this.form.contains("cellIndex") && cellIndex !== undefined) {
			this.form.controls["cellIndex"].setValue(cellIndex);
		}

		if (this.isDisabled) {
			this.form.disable();
		} else {
			this.form.enable();
		}

		this.showAdd = !this.showAdd;
	}

	public close(): void {
		this.dataSource.data = this.dataSource.data.filter((row) => !row["isNew"]);
		this.expandedElement = undefined;
		this.showAdd = true;
	}

	public createElement(): void {
		const row: _ExpandableGridRow = Object.fromEntries(this.displayedColumns.map((column) => [column.columnDef, null]));
		row["isNew"] = true;
		this.dataSource.data = [row, ...this.dataSource.data];
		this.expandedElement = row;
		this.showAdd = false;
	}

	public confirmDelete(element: _ExpandableGridRow, event: Event): void {
		event.stopPropagation();
		this.dialog
			.open<ConfirmationDialogComponent, _ConfirmationDialogData, boolean>(ConfirmationDialogComponent, {
				data: {
					title: "Delete",
					description: "Are you sure you want to delete this item?",
				},
			})
			.afterClosed()
			.pipe(first())
			.subscribe((confirmed) => {
				if (confirmed) {
					this.delete.emit(element);
				}
			});
		this.showAdd = true;
	}

	public saveData(value: unknown): void {
		this.showAdd = true;
		this.save.emit(value);
	}

	public paginate(event: PageEvent): void {
		this.pageChange.emit(event);
	}

	private initialize(): void {
		this.showAdd = true;
		const gridData = this._gridData;
		this.dataSource.data = Array.isArray(gridData) ? gridData : (gridData?.data ?? []);

		if (!Array.isArray(gridData) && gridData && this._paginator) {
			this.dataSource.paginator = this._paginator;
		}
	}
}
