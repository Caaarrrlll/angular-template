import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { ChipStatusComponent } from "@shared/components/chip-status/chip-status.component";
import { CountDownComponent } from "@shared/components/count-down/count-down.component";
import { ButtonPrimaryComponent } from "@shared/components/button/button-primary/button-primary.component";
import { ButtonSecondaryComponent } from "@shared/components/button/button-secondary/button-secondary.component";
import { ButtonTertiaryComponent } from "@shared/components/button/button-tertiary/button-tertiary.component";
import { CurrencyComponent } from "@shared/components/currency/currency.component";
import { CustButtonInput } from "@shared/models/cust-basic-controls";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustTablePropertiesConfig,
	_DataProcessResponse,
} from "@shared/components/card-table/cust-card-table.interface";
import { _HeaderAlignment, _HeaderTypes, _StatusChip } from "./list-card.enum";
import { _CardCol, _CardListButtons, _CardRow, _ListCardButtonClick } from "./list-card.interface";
import { _CustCardHeaderDataInterface } from "./list-card-data-header.interface";

export interface _ListCardParentDataContext {
	data: Record<string, any>;
	config: unknown;
	claims: string[];
}

export interface _ListCardParentButtonContext {
	data: Record<string, any>;
	claims: string[];
}

@Component({
	selector: "app-list-card",
	templateUrl: "./list-card.component.html",
	styleUrls: ["./list-card.component.scss"],
	imports: [
		CommonModule,
		MatCardModule,
		MatIconModule,
		ChipStatusComponent,
		CountDownComponent,
		ButtonPrimaryComponent,
		ButtonSecondaryComponent,
		ButtonTertiaryComponent,
		CurrencyComponent,
	],
})
export class ListCardComponent implements OnChanges, OnInit {
	@Input() public data?: Record<string, any>;
	@Input() public cardHeader!: _CustCardHeaderTableInterface[];
	@Input() public tableButtonConfig!: _CustCardButtonTableInterface[];
	@Input() public tableConfig!: _CustCardTableInterface[];
	@Input() public tablePropertiesConfig!: _CustTablePropertiesConfig[];
	@Input() public parentDataProcess: ((context: _ListCardParentDataContext) => _DataProcessResponse | undefined) | undefined;
	@Input() public parentButtonProcess: ((context: _ListCardParentButtonContext) => _CardListButtons) | undefined;
	@Input() public claims: string[] = [];
	@Input() public dateFormat: string = "yyyy/MM/dd";
	@Input() public timeFormat: string = "HH:mm:ss";
	@Input() public spinner?: number;

	@Output() public buttonClick: EventEmitter<_ListCardButtonClick> = new EventEmitter<_ListCardButtonClick>();

	public pulseColour: string = "";
	public taskName: string | undefined = undefined;
	public cardRows: _CardRow[] = [];
	public cardCols: _CardCol[] = [];
	public cardHeaders: _CustCardHeaderDataInterface[] = [];
	public maxLines: number = 0;

	public ngOnChanges(changes: SimpleChanges): void {
		if (!changes["spinner"]?.firstChange) {
			for (const row of this.cardRows) {
				for (const col of row.item) {
					if (col.type === "button" && col.loading) {
						col.loading = false;
					}
				}
			}
		}
	}

	public ngOnInit(): void {
		if (!this.data) {
			return;
		}
		this.mapData();
	}

	public buttonAction(action: _CardCol): void {
		const retObj: _ListCardButtonClick = {
			action: action,
			data: this.data ?? {},
		};

		for (const row of this.cardRows) {
			for (const col of row.item) {
				if (col.value === action.value) {
					if ("loading" in col) {
						col.loading = true;
					}
				}
			}
		}

		this.buttonClick.emit(retObj);
	}

	public setPulseColour(timeRemaining: number): void {
		this.pulseColour = timeRemaining >= 60 ? "pulse" : timeRemaining > 0 ? "urgent" : "";
	}

	public tableButton(detail: _CardCol): CustButtonInput {
		return {
			type: "",
			icon: "",
			tooltip: "",
			display: detail.value,
			value: detail.buttonClick ?? "",
			disabled: false,
			isTableButton: true,
			width: "110px",
			loading: detail.loading ?? false,
		};
	}

	public countDownTime(detail: _CardCol): number {
		return Number(detail.value);
	}

	private mapData(): void {
		if (!this.data) {
			return;
		}
		this.mapField(this.data);
		this.mapHeader(this.data);

		if (this.parentButtonProcess) {
			const res: _CardListButtons = this.parentButtonProcess({
				data: this.data,
				claims: this.claims,
			});

			this.taskName = res.taskName;
			for (const buttonToAdd of res.buttons) {
				this.cardCols.push(buttonToAdd);
			}
			if (this.tableButtonConfig) {
				this.mapButton();
			}
		} else {
			this.mapButton();
		}

		this.cardRows.push({
			item: [...this.cardCols],
			colSCSS: "col-no-border",
			pulse: this.taskName !== undefined && !this.data["taskAccepted"],
			width: "13%",
		});
		this.cardCols.splice(0, this.cardCols.length);
	}

	private mapButton(): void {
		for (const config of this.tableButtonConfig) {
			this.cardCols.push({
				value: config.value,
				type: "button",
				buttonClick: config.buttonClick,
				buttonType: config.buttonType,
			});
		}
	}

	private mapDataParent(data: Record<string, any>, config: Record<string, any>): void {
		const resp = this.parentDataProcess?.({
			data: data,
			config: config,
			claims: this.claims,
		});

		if (resp) {
			if (resp.type === "chipsStatus") {
				this.cardCols.push({
					label: config["display"],
					value: resp.response,
					type: resp.type ? resp.type : "text",
					valueColor: resp.action,
				});
			} else {
				this.cardCols.push({
					label: resp.label ? resp.label : config["display"],
					value: resp.response,
					type: resp.type ? resp.type : "text",
					iconName: resp.iconName,
					iconColour: resp.iconColour,
					imageIcons: resp.imageIcons,
				});
			}
		}
	}

	private mapField(data: Record<string, any>): void {
		let currentCol: number = 1;

		let lines: number = 0;
		for (const config of this.tableConfig) {
			if (currentCol !== config.column) {
				this.cardRows.push({
					item: [...this.cardCols],
					colSCSS: "col-with-border-left",
					pulse: false,
					width: this.tablePropertiesConfig[currentCol - 1].width,
				});

				if (lines - 1 > this.maxLines) {
					this.maxLines = lines - 1;
				}

				lines = 0;
				this.cardCols.splice(0, this.cardCols.length);

				currentCol = config.column;
			}

			if (config.type === "Parent" && this.parentDataProcess) {
				this.mapDataParent(data, config as unknown as Record<string, any>);
			} else {
				const field: string = config.field,
					sub: string | undefined = config.fieldSub;

				if (!sub && data[field]) {
					this.cardCols.push({
						label: config.display,
						value: data[field],
						type: config.type ?? "",
					});
				} else if (sub) {
					this.cardCols.push({
						label: config.display,
						value: !data[field]
							? "N/A"
							: data[field][sub]
								? data[field][sub]
								: config.type === "text"
									? "N/A"
									: config.type === "boolean"
										? data[field][sub]
											? "Yes"
											: "No"
										: data[field][sub],
						type: config.type ?? "",
					});
				}
			}
			lines++;
		}
		// In the case that the last column has the most lines
		if (lines - 2 > this.maxLines) {
			this.maxLines = lines - 2;
		}

		this.cardRows.push({
			item: [...this.cardCols],
			colSCSS: "col-with-border-left",
			pulse: false,
			width: this.tablePropertiesConfig[currentCol - 1].width,
		});
		this.cardCols.splice(0, this.cardCols.length);
	}

	private mapHeaderParent(data: Record<string, any>, config: Record<string, any>): void {
		const resp = this.parentDataProcess?.({
			data: data,
			config: config,
			claims: this.claims,
		});

		if (resp) {
			if (resp.type === "chipsStatus" && !resp.postText) {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.chipsStatus,
					alignment: (resp.alignment as _HeaderAlignment) ?? _HeaderAlignment.center,
					statusType: resp.action,
				});
			} else if (resp.textPre) {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.display,
					alignment: (resp.alignment as _HeaderAlignment) ?? _HeaderAlignment.center,
					textColor: config["textColor"],
					textPre: resp.textPre,
					length: resp.length ? resp.length : 40,
				});
			} else if (resp.postText) {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.status,
					alignment: (resp.alignment as _HeaderAlignment) ?? _HeaderAlignment.center,
					textColor: config["textColor"],
					postText: resp.postText,
					postLable: resp.postLable,
					statusType: resp.action,
				});
			} else {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.display,
					alignment: (resp.alignment as _HeaderAlignment) ?? _HeaderAlignment.center,
					textColor: config["textColor"],
				});
			}
		}
	}

	private mapHeader(data: Record<string, any>): void {
		for (const config of this.cardHeader) {
			if (config.type === "Parent" && this.parentDataProcess) {
				this.mapHeaderParent(data, config as unknown as Record<string, any>);
			} else {
				const field: string = config.field,
					sub: string | undefined = config.fieldSub;

				if (config.type && config.type === "status") {
					this.cardHeaders.push({
						text: data[field],
						type: _HeaderTypes.status,
						alignment: _HeaderAlignment.end,
						statusType: this.setStatusChip(data[config.field]),
						postText: data[config.postText as string],
						postLable: config.postLable,
					});
				} else if (sub && !config.textPre) {
					this.cardHeaders.push({
						text: data[field][sub],
						type: config.type ?? "",
						alignment: _HeaderAlignment.start,
					});
				} else if (config.textPre) {
					this.cardHeaders.push({
						text: data[field][sub as string],
						type: _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						textPre: data[config.textPre],
					});
				} else {
					this.cardHeaders.push({
						text: data[field],
						type: config.type ?? "",
						alignment: _HeaderAlignment.start,
					});
				}
			}
		}
	}

	private setStatusChip(description: string): _StatusChip {
		if (["Ready for invoicing"].includes(description)) return _StatusChip.Informative;
		if (["Error", "Lost Sale", "Completed - No Sale"].includes(description)) return _StatusChip.Negative;
		if (["New Lead", "Assigned"].includes(description)) return _StatusChip.newSale;
		if (["In Progress", "Sale Process Started", "Sale Initiated", "Not yet submitted"].includes(description)) return _StatusChip.Action;
		if (["Lead Expired"].includes(description)) return _StatusChip.Default;

		return _StatusChip.Default;
	}
}
