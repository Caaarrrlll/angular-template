import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderDataInterface,
	_CustCardHeaderMenuInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustFooterChips,
	_CustTablePropertiesExtConfig,
	_DataProcessResponse,
} from "@shared/components/card-table/cust-card-table.interface";
import { _TableTypes } from "@shared/components/card-table/cust-table.enum";
import { _HeaderAlignment, _HeaderTypes, _StatusChip } from "@shared/components/list-card/list-card.enum";
import { _CardCol, _CardRow } from "@shared/components/list-card/list-card.interface";
import { CustButtonInput } from "@shared/models/cust-basic-controls";
import { ButtonPrimaryComponent } from "@shared/components/button/button-primary/button-primary.component";
import { ButtonV2Component } from "@shared/components/button/button-v2/button-v2.component";
import { ChipStatusComponent } from "@shared/components/chip-status/chip-status.component";
import { CurrencyComponent } from "@shared/components/currency/currency.component";
import { _DisplayDetail, _InfoCardButtonClick } from "./info-card.models";

export interface _InfoCardParentDataContext {
	data: Record<string, any>;
	config: unknown;
	claims: string[];
}

@Component({
	selector: "app-info-card",
	templateUrl: "./info-card.component.html",
	styleUrls: ["./info-card.component.scss"],
	imports: [CommonModule, MatCardModule, MatDividerModule, MatIconModule, ButtonPrimaryComponent, ButtonV2Component, ChipStatusComponent, CurrencyComponent],
})
export class InfoCardComponent implements AfterContentInit {
	@Input() public data!: Record<string, any>;
	@Input({ required: true }) public cardHeader!: _CustCardHeaderTableInterface[];
	@Input() public tableHeaderMenu?: _CustCardHeaderMenuInterface;
	@Input() public tableButtonConfig?: _CustCardButtonTableInterface[];
	@Input({ required: true }) public tableConfig!: _CustCardTableInterface[];
	@Input({ required: true }) public tableProperties!: _CustTablePropertiesExtConfig;
	@Input() public parentDataProcess: ((context: _InfoCardParentDataContext) => _DataProcessResponse | undefined) | undefined;
	@Input() public claims: string[] = [];
	@Input() public dateFormat: string = "yyyy/MM/dd";
	@Input() public footerChips?: _CustFooterChips;

	@Output() public buttonClick: EventEmitter<_InfoCardButtonClick> = new EventEmitter<_InfoCardButtonClick>();
	@Output() public menuClickEvent: EventEmitter<string> = new EventEmitter<string>();

	public cardRows: _CardRow[] = [];
	public cardCols: _CardCol[] = [];
	public cardHeaders: _CustCardHeaderDataInterface[] = [];
	public maxLines: number = 0;
	public showDetailCard: boolean = false;
	public top: number = 0;
	public left: number = 0;
	public displayDetails: _DisplayDetail[] = [];
	public errorActionButton: string = "";

	public ngAfterContentInit(): void {
		this.mapData();

		if (this.tableProperties.heightAuto) {
			this.tableProperties.height = this.tableConfig.length * 22 + "px";
		}
	}

	public buttonAction(action: string): void {
		const retObj: _InfoCardButtonClick = {
			action: action,
			data: this.data,
		};

		this.buttonClick.emit(retObj);
	}

	public displayList(detail: _CardCol): _DisplayDetail[] {
		return (detail.list as _DisplayDetail[]) ?? [];
	}

	public tableButton(detail: _CardCol, width: string): CustButtonInput {
		return {
			type: "",
			icon: "",
			tooltip: "",
			display: detail.buttonClick ?? "",
			value: detail.buttonClick ?? "",
			disabled: false,
			isTableButton: true,
			width: width,
			loading: detail.loading ?? false,
		};
	}

	public headerButton(menu: _CustCardHeaderMenuInterface): CustButtonInput {
		return {
			type: "icon",
			icon: "edit",
			tooltip: "",
			display: "",
			value: menu.action ?? "",
			disabled: false,
		};
	}

	private mapData(): void {
		this.mapHeader(this.data);
		this.mapField(this.data);
	}

	private mapDataParent(data: Record<string, any>, config: Record<string, any>): void {
		const resp = this.parentDataProcess?.({
			data: data,
			config: config,
			claims: this.claims,
		});

		if (resp) {
			switch (resp.type) {
				case _TableTypes.DisplayList: {
					this.cardCols.push({
						label: config["display"],
						value: resp.response,
						type: resp.type ? resp.type : _TableTypes.Text,
						valueColor: resp.action,
						buttonClick: resp.buttonAction,
						list: resp.displayList,
					});
					break;
				}
				case "button": {
					this.cardCols.push({
						label: config["display"],
						value: resp.response,
						type: resp.type ? resp.type : _TableTypes.Text,
						valueColor: resp.action,
						buttonClick: resp.buttonAction,
					});
					break;
				}
				case "chipsStatus": {
					this.cardCols.push({
						label: config["display"],
						value: resp.response,
						type: resp.type ? resp.type : _TableTypes.Text,
						valueColor: resp.action,
					});
					break;
				}
				case "textLink": {
					this.cardCols.push({
						label: config["display"],
						value: resp.response,
						type: resp.type ? resp.type : _TableTypes.Text,
						valueColor: resp.action,
						url: resp.url,
					});
					break;
				}
				case "textWithEdit": {
					this.cardCols.push({
						label: config["display"],
						value: resp.response,
						type: resp.type,
						buttonClick: resp.editAction,
					});
					break;
				}
				case "textCombined": {
					this.cardCols.push({
						label: config["display"],
						value: resp.response,
						type: resp.type,
						buttonClick: resp.buttonAction,
					});
					break;
				}
				default: {
					this.cardCols.push({
						label: resp.label ? resp.label : config["display"],
						value: resp.response,
						type: resp.type ? resp.type : _TableTypes.Text,
					});
					break;
				}
			}
		}
	}

	private mapField(data: Record<string, any>): void {
		let currentCol: number = 1;

		if (!data) {
			return;
		}

		for (const config of this.tableConfig) {
			if (currentCol !== config.column) {
				this.cardRows.push({
					item: [...this.cardCols],
					colSCSS: "col-with-border-left",
					pulse: false,
					width: this.tableProperties.width[currentCol - 1],
				});

				if (this.cardCols.length > this.maxLines) {
					this.maxLines = this.cardCols.length;
				}

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
						type: config.type,
						buttonClick: config.editAction,
					});
				} else if (sub) {
					if (data[field]) {
						this.cardCols.push({
							label: config.display,
							value: data[field][sub]
								? data[field][sub]
								: config.type === _TableTypes.Text
									? "N/A"
									: config.type === "boolean"
										? data[field][sub]
											? "Yes"
											: "No"
										: data[field][sub],
							type: config.type,
							buttonClick: config.editAction,
						});
					} else if (config.type === _TableTypes.TextWithEdit) {
						this.cardCols.push({
							label: config.display,
							value: "Not selected",
							type: config.type,
							buttonClick: config.editAction,
						});
					}
				}
			}
		}

		this.cardRows.push({
			item: [...this.cardCols],
			colSCSS: "col-with-no-border",
			pulse: false,
			width: this.tableProperties.width[currentCol - 1],
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
			if (resp.type === "chipsStatus") {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.chipsStatus,
					alignment: resp.alignment ? resp.alignment : _HeaderAlignment.center,
					statusType: resp.action,
				});
			} else {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.display,
					alignment: resp.alignment ? resp.alignment : _HeaderAlignment.center,
					textColor: config["textColor"],
				});
			}
		}
	}

	private mapHeader(data: Record<string, any>): void {
		if (data == null) {
			this.cardHeaders.push({
				text: this.cardHeader[0].display,
				type: this.cardHeader[0].type ?? _HeaderTypes.display,
				alignment: this.cardHeader[0].alignment ?? _HeaderAlignment.center,
				textColor: this.cardHeader[0].textColor,
			});

			this.errorActionButton = this.cardHeader[0].errorActionButton ?? "";

			return;
		}
		for (const config of this.cardHeader) {
			if (config.type === "Parent" && this.parentDataProcess) {
				this.mapHeaderParent(data, config as unknown as Record<string, any>);
			} else {
				const field: string = config.field,
					sub: string | undefined = config.fieldSub;

				if (config.type && config.type === "boldText") {
					this.cardHeaders.push({
						text: config.display,
						type: config.type,
						alignment: config.alignment ?? _HeaderAlignment.start,
						textColor: config.textColor,
					});
				} else if (config.type && config.type === "status") {
					this.cardHeaders.push({
						text: data[field],
						type: _HeaderTypes.status,
						alignment: _HeaderAlignment.end,
						statusType: this.setStatusChip(data[config.field]),
						postText: data[config.postText as string],
						postLable: config.postLable,
						textColor: config.textColor,
					});
				} else if (!sub && !config.textPre) {
					this.cardHeaders.push({
						text: data[field],
						type: config.type ?? _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						clickAction: config.clickAction,
						textColor: config.textColor,
					});
				} else if (sub && !config.textPre) {
					this.cardHeaders.push({
						text: data[field][sub],
						type: config.type ?? _HeaderTypes.display,
						alignment: config.alignment ?? _HeaderAlignment.start,
						icon: config.icon,
						clickAction: config.clickAction,
						textColor: config.textColor,
					});
				} else if (sub && config.textPre) {
					this.cardHeaders.push({
						text: data[field][sub],
						type: config.type ?? _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						textPre: data[config.textPre],
						textColor: config.textColor,
					});
				} else if (!sub && config.textPre) {
					this.cardHeaders.push({
						text: data[field],
						type: _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						textPre: config.textPre,
						textColor: config.textColor,
					});
				}
			}
		}
	}

	private setStatusChip(description: string): _StatusChip {
		let colour = _StatusChip.Action;
		if (description === "New Lead" || description === "Assigned") {
			colour = _StatusChip.newSale;
		} else if (description === "In Progress" || description === "Sale Process Started") {
			colour = _StatusChip.Action;
		} else if (description === "Lead Expired") {
			colour = _StatusChip.Default;
		} else if (description === "Lost Sale" || description === "Completed - No Sale") {
			colour = _StatusChip.Negative;
		}

		return colour;
	}

	public getMenu(id: string): void {
		document.getElementById(id)?.classList.toggle("show");
	}

	public menuClick(action: string): void {
		this.menuClickEvent.emit(action);
	}

	public mouseOver(event: MouseEvent, details: _DisplayDetail[], top: number = 0): void {
		this.showDetailCard = true;
		if (this.displayDetails.length > 0) {
			this.top = event.y - 130 - top;
		} else {
			this.top = event.y - 70 - top;
		}

		this.left = event.x + 10;

		this.displayDetails = details;
	}

	public mouseOff(): void {
		this.showDetailCard = false;
	}
}
