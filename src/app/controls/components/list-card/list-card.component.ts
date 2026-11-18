import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { ChipStatusComponent } from "@shared/components/chip-status/chip-status.component";
import { CountDownComponent } from "@shared/components/count-down/count-down.component";
import { ButtonV2Component } from "@shared/components/button/button-v2/button-v2.component";
import { CurrencyComponent } from "@shared/components/currency/currency.component";
import { CustButtonInput } from "@shared/models/cust-basic-controls";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustTablePropertiesConfig,
	_DataProcessResponse,
} from "@shared/components/card-table/cust-card-table.interface";
import { _TableTypes } from "@shared/components/card-table/cust-table.enum";
import { _HeaderAlignment, _HeaderTypes, _StatusChip } from "./list-card.enum";
import { _CardCol, _CardListButtons, _CardRow, _ListCardButtonClick } from "./list-card.interface";
import { _CustCardHeaderDataInterface } from "./list-card-data-header.interface";

export interface _ListCardParentDataContext {
	data: Record<string, unknown>;
	config: unknown;
	claims: string[];
}

export interface _ListCardParentButtonContext {
	data: Record<string, unknown>;
	claims: string[];
}

@Component({
	selector: "app-list-card",
	templateUrl: "./list-card.component.html",
	styleUrls: ["./list-card.component.scss"],
	imports: [CommonModule, MatCardModule, MatIconModule, ChipStatusComponent, CountDownComponent, ButtonV2Component, CurrencyComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCardComponent implements OnChanges, OnInit {
	@Input() public data?: Record<string, unknown>;
	@Input() public cardHeader!: _CustCardHeaderTableInterface[];
	@Input() public tableButtonConfig?: _CustCardButtonTableInterface[];
	@Input() public tableConfig!: _CustCardTableInterface[];
	@Input() public tablePropertiesConfig!: _CustTablePropertiesConfig[];
	@Input() public parentDataProcess: ((context: _ListCardParentDataContext) => _DataProcessResponse | undefined) | undefined;
	@Input() public parentButtonProcess: ((context: _ListCardParentButtonContext) => _CardListButtons) | undefined;
	@Input() public claims: string[] = [];
	@Input() public dateFormat = "yyyy/MM/dd";
	@Input() public timeFormat = "HH:mm:ss";
	@Input() public spinner?: number;

	@Output() public buttonClick: EventEmitter<_ListCardButtonClick> = new EventEmitter<_ListCardButtonClick>();

	public pulseColour = "";
	public taskName: string | undefined = undefined;
	public cardRows: _CardRow[] = [];
	public cardCols: _CardCol[] = [];
	public cardHeaders: _CustCardHeaderDataInterface[] = [];
	public maxLines = 0;

	public ngOnChanges(changes: SimpleChanges): void {
		const spinnerChange = changes["spinner"] as SimpleChange | undefined;
		if (!spinnerChange?.firstChange) {
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

	public tableButton(detail: _CardCol, type = "Tertiary"): CustButtonInput {
		return {
			type: type,
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

		// No buttons configured: skip the empty button row (the template reads the row's last item).
		if (this.cardCols.length > 0) {
			this.cardRows.push({
				item: [...this.cardCols],
				colSCSS: "col-no-border",
				pulse: this.taskName !== undefined && !this.data["taskAccepted"],
				width: "13%",
			});
		}
		this.cardCols.splice(0, this.cardCols.length);
	}

	private mapButton(): void {
		for (const config of this.tableButtonConfig ?? []) {
			this.cardCols.push({
				value: config.value,
				type: "button",
				buttonClick: config.buttonClick,
				buttonType: config.buttonType,
			});
		}
	}

	private mapDataParent(data: Record<string, unknown>, config: _CustCardTableInterface): void {
		const resp = this.parentDataProcess?.({
			data: data,
			config: config,
			claims: this.claims,
		});

		if (resp) {
			if (resp.type === "chipsStatus") {
				this.cardCols.push({
					label: config.display,
					value: resp.response,
					type: resp.type,
					valueColor: resp.action,
				});
			} else {
				this.cardCols.push({
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: empty string must fall back
					label: resp.label ? resp.label : config.display,
					value: resp.response,
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: empty string must fall back
					type: resp.type ? resp.type : "text",
					iconName: resp.iconName,
					iconColour: resp.iconColour,
					imageIcons: resp.imageIcons,
				});
			}
		}
	}

	private mapField(data: Record<string, unknown>): void {
		let currentCol = 1;

		let lines = 0;
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

			if (config.type === _TableTypes.Parent && this.parentDataProcess) {
				this.mapDataParent(data, config);
			} else {
				const field: string = config.field,
					sub: string | undefined = config.fieldSub;

				if (!sub && data[field]) {
					this.cardCols.push({
						label: config.display,
						value: data[field] as string,
						type: config.type ?? "",
					});
				} else if (sub) {
					const fieldValue: unknown = data[field];
					const subValue: unknown = fieldValue ? (fieldValue as Record<string, unknown>)[sub] : undefined;

					this.cardCols.push({
						label: config.display,
						value: !fieldValue
							? "N/A"
							: subValue
								? (subValue as string)
								: config.type === _TableTypes.Text
									? "N/A"
									: config.type === _TableTypes.Boolean
										? subValue
											? "Yes"
											: "No"
										: (subValue as string),
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

	private mapHeaderParent(data: Record<string, unknown>, config: _CustCardHeaderTableInterface): void {
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
					alignment: (resp.alignment as _HeaderAlignment | undefined) ?? _HeaderAlignment.center,
					statusType: resp.action,
				});
			} else if (resp.textPre) {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.display,
					alignment: (resp.alignment as _HeaderAlignment | undefined) ?? _HeaderAlignment.center,
					textColor: config.textColor,
					textPre: resp.textPre,
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: 0 must fall back
					length: resp.length ? resp.length : 40,
				});
			} else if (resp.postText) {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.status,
					alignment: (resp.alignment as _HeaderAlignment | undefined) ?? _HeaderAlignment.center,
					textColor: config.textColor,
					postText: resp.postText,
					postLable: resp.postLable,
					statusType: resp.action,
				});
			} else {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.display,
					alignment: (resp.alignment as _HeaderAlignment | undefined) ?? _HeaderAlignment.center,
					textColor: config.textColor,
				});
			}
		}
	}

	private mapHeader(data: Record<string, unknown>): void {
		for (const config of this.cardHeader) {
			if (config.type === "Parent" && this.parentDataProcess) {
				this.mapHeaderParent(data, config);
			} else {
				const field: string = config.field,
					sub: string | undefined = config.fieldSub;

				if (config.type && config.type === "status") {
					this.cardHeaders.push({
						text: data[field] as string,
						type: _HeaderTypes.status,
						alignment: _HeaderAlignment.end,
						statusType: this.setStatusChip(data[config.field] as string),
						postText: config.postText !== undefined ? (data[config.postText] as string) : undefined,
						postLable: config.postLable,
					});
				} else if (sub && !config.textPre) {
					this.cardHeaders.push({
						text: (data[field] as Record<string, unknown>)[sub] as string,
						type: config.type ?? "",
						alignment: _HeaderAlignment.start,
					});
				} else if (sub && config.textPre) {
					this.cardHeaders.push({
						text: (data[field] as Record<string, unknown>)[sub] as string,
						type: _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						textPre: data[config.textPre] as string,
					});
				} else if (config.textPre) {
					this.cardHeaders.push({
						text: (data[field] as Record<string, unknown>)[sub ?? "undefined"] as string,
						type: _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						textPre: data[config.textPre] as string,
					});
				} else {
					this.cardHeaders.push({
						text: data[field] as string,
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
