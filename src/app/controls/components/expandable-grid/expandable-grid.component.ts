import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PaginationConstants } from "@apis/process-engine/constants/pagination-constants";
import { _Dictionary } from "@apis/process-engine/models/dictionary.interface";
import { _MatPaginatorInterface } from "@apis/process-engine/models/mat-paginator.interface";
import { _PaginatedResponseInterface } from "@apis/process-engine/models/paginated-response.interface";
import { _ExpandableGridAdditionalButtonInterface } from "@controls/expandable-grid/core/interfaces/expandable-grid-additional-button.interface";
import { DialogService } from "@modules/process-engine-v2/shared/services/dialog.service";
import { filter, first } from "rxjs";
import { _ExpandableGridDisplayOptionsInterface } from "./core/interfaces/expandable-grid-display-options.interface";
import { _ExpandableGridOptionsInterface } from "./core/interfaces/expandable-grid-options.interface";
import { _ExpandableGridRulesInterface } from "./core/interfaces/expandable-grid-rules.interface";

@Component({
	selector: "app-expandable-grid",
	templateUrl: "./expandable-grid.component.html",
	styleUrls: ["./expandable-grid.component.scss"],
	animations: [
		trigger("detailExpand", [
			state("collapsed", style({ height: "0px", minHeight: "0" })),
			state("expanded", style({ height: "*" })),
			transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
		]),
	],
})
export class ExpandableGridComponent implements OnInit {
	private _gridData: any = undefined;
	private _paginator!: MatPaginator;

	public expandColumns: string[] = [];
	public expandedElement: any = undefined;
	public paginationConstants = PaginationConstants;
	public dataSource: MatTableDataSource<_PaginatedResponseInterface<any>> = new MatTableDataSource<_PaginatedResponseInterface<any>>();
	public showAdd: boolean = true;

	@Input()
	public get gridData(): any {
		return this._gridData;
	}

	public set gridData(v: any) {
		if (!!v) {
			this._gridData = v;
			this.initialize();
		}
	}

	@Input() public isDisabled: boolean = false;
	@Input() public additionalButton?: _ExpandableGridAdditionalButtonInterface;
	@Input() public displayedColumns: _ExpandableGridDisplayOptionsInterface[] = [];
	@Input() public form!: FormGroup;
	@Input() public componentData!: _PaginatedResponseInterface<any> | any;
	@Input() public isLoading: boolean = false;
	@Input() public editableColumns: _ExpandableGridOptionsInterface[] = [];
	@Input() public gridRules: _ExpandableGridRulesInterface = {
		delete: true,
		edit: true,
		view: true,
		arrow: false,
	};

	@Output() public onDelete = new EventEmitter<Event>();
	@Output() public onSave = new EventEmitter<Event>();
	@Output() public onPaginate = new EventEmitter<_MatPaginatorInterface>();
	@Output() public onExpandElement? = new EventEmitter<Event>();

	@ViewChild("paginator") set paginator(value: MatPaginator) {
		this._paginator = value;
	}

	constructor(private _dialogService: DialogService) {}

	private initialize(): void {
		this.showAdd = true;
		this.dataSource.data = this.gridData?.data ?? this.gridData;
		if (!this.gridData.data) {
			this.dataSource.paginator = this._paginator!;
		}
	}

	public openReadonlyElement(element: any): void {
		this.expandedElement = this.expandedElement === element ? undefined : element;
		this.form.disable();
		this.showAdd = !this.showAdd;
	}

	public openElement(element: any, cellIndex: any, $event?: Event): void {
		$event?.stopPropagation();
		this.onExpandElement?.emit(element);
		this.expandedElement = this.expandedElement === element ? undefined : element;
		if (this.expandedElement && !!this.form.controls["cellIndex"]) {
			this.expandedElement["cellIndex"] = cellIndex;
		}
		if (this.isDisabled) {
			this.form.disable();
		} else {
			this.form.enable();
		}
		this.showAdd = !this.showAdd;
	}

	public close(): void {
		this.dataSource.data = this.dataSource.data.filter((x: any) => !x.isNew);
		this.expandedElement = undefined;
		this.showAdd = true;
	}

	public createElement(): void {
		let obj: _Dictionary<string> = {};
		const data: _Dictionary<string>[] = [];
		for (const key of this.displayedColumns) {
			obj = { ...obj, ...{ [key.columnDef]: null } };
		}
		obj = { ...obj, ...{ isNew: "true" } };
		data.push(obj);
		this.dataSource.data = [...(data as any[]), ...this.dataSource.data];
		this.expandedElement = obj;
		this.showAdd = false;
	}

	public deleteElement(element: any, $event: Event): void {
		$event.stopPropagation();
		this._dialogService
			.openConfirmationDialog()
			.pipe(
				first(),
				filter((v) => !!v)
			)
			.subscribe(() => this.onDelete.emit(element));
		this.showAdd = true;
	}

	saveData(event): void {
		this.showAdd = true;
		this.onSave.emit(event);
	}

	public paginate(page: _MatPaginatorInterface): void {
		this.onPaginate.emit(page);
	}

	public ngOnInit(): void {
		this.expandColumns = [...this.displayedColumns.map((x) => x.columnDef), "expand"];
	}
}
