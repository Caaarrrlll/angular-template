import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { _HeaderAlignment, _HeaderTypes, _StatusChip } from "@controls/cust-basic-controls/cust-list-card/cust-list-card.enum";
import { _CardCol, _CardRow } from "@controls/cust-basic-controls/cust-list-card/cust-list-card.interface";
import { _TableTypes } from "@controls/cust-card-table/enums/cust-table.enum";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderDataInterface,
	_CustCardHeaderMenuInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustFooterChips,
	_CustTablePropertiesExtConfig,
} from "@controls/cust-card-table/interfaces/cust-card-table.interface";
import { LoginService } from "@services/login.service";
import { UserSettingsModel } from "src/app/modules/settings/models/settings.model";

@Component({
	selector: "cust-info-card",
	templateUrl: "./cust-info-card.component.html",
	styleUrls: ["./cust-info-card.component.scss"],
})
export class CustInfoCardComponent implements AfterContentInit {
	@Input() data: Array<unknown>;
	@Input() cardHeader: _CustCardHeaderTableInterface[];
	@Input() tableHeaderMenu: _CustCardHeaderMenuInterface;
	@Input() tableButtonConfig: _CustCardButtonTableInterface[];
	@Input() tableConfig: _CustCardTableInterface[];
	@Input() tableProperties: _CustTablePropertiesExtConfig;
	@Input() parentDataProcess: Function;
	@Input() parentButtonProcess: Function;
	@Input() footerChips?: _CustFooterChips;

	@Output() buttonClick: EventEmitter<any> = new EventEmitter<any>();
	@Output() buttonActionOut: EventEmitter<any> = new EventEmitter<any>();
	@Output() menuClickEvent = new EventEmitter<any>();

	pulseColour: string = "";
	taskName = undefined;
	cardRows: _CardRow[] = [];
	cardCols: _CardCol[] = [];
	cardHeaders: _CustCardHeaderDataInterface[] = [];
	claimsMain: string[] = [];
	maxLines: number = 0;
	showDetailCard: boolean = false;
	top: number = 0;
	left: number = 0;
	displayDetails: unknown[];
	errorActionButton: string = "";

	constructor(public userSettingsModel: UserSettingsModel, private loginService: LoginService) {}

	ngAfterContentInit(): void {
		this.claimsMain = this.loginService.getClaims();
		this.mapData();

		if (this.tableProperties.heightAuto) {
			this.tableProperties.height = this.tableConfig.length * 22 + "px";
		}
	}

	buttonAction(action: string): void {
		const retObj = {
			action: action,
			data: this.data,
		};

		this.buttonClick.emit(retObj);
	}

	setPulseColour(timeRemaining: number): void {
		this.pulseColour = timeRemaining >= 60 ? "pulse" : timeRemaining > 0 ? "urgent" : "";
	}

	mapData(): void {
		this.mapHeader(this.data);
		this.mapField(this.data);
	}

	mapDataParent(data: unknown, config: unknown): void {
		const resp = this.parentDataProcess({
			data: data,
			config: config,
			claims: this.claimsMain,
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
				case "dekra": {
					this.cardCols.push({
						label: config["display"],
						value: resp.response,
						type: resp.type ? resp.type : _TableTypes.Text,
						valueColor: resp.action,
						width: resp.width,
						vin: resp.vin,
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
						whatsappMessage: resp.whatsAppMessage ? resp.whatsAppMessage : "",
					});
					break;
				}
			}
		}
	}

	mapField(data: unknown): void {
		let currentCol: number = 1;

		if (!data) {
			return;
		}

		this.tableConfig.map((config) => {
			if (currentCol != config.column) {
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

			if (config.type == "Parent" && this.parentDataProcess) {
				this.mapDataParent(data, config);
			} else {
				const field = config.field,
					sub = config.fieldSub;

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
								: config.type == _TableTypes.Text
								? "N/A"
								: config.type == "boolean"
								? data[field][sub]
									? "Yes"
									: "No"
								: data[field][sub],
							type: config.type,
							buttonClick: config.editAction,
						});
					} else if (config.type == _TableTypes.TextWithEdit) {
						this.cardCols.push({
							label: config.display,
							value: "Not selected",
							type: config.type,
							buttonClick: config.editAction,
						});
					}
				}
			}
		});

		this.cardRows.push({
			item: [...this.cardCols],
			colSCSS: "col-with-no-border",
			pulse: false,
			width: this.tableProperties.width[currentCol - 1],
		});
		this.cardCols.splice(0, this.cardCols.length);
	}

	mapHeaderParent(data: unknown, config: unknown): void {
		const resp = this.parentDataProcess({
			data: data,
			config: config,
			claims: this.claimsMain,
		});

		if (resp) {
			if (resp.type == "chipsStatus") {
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

	mapHeader(data: unknown): void {
		if (data == null) {
			this.cardHeaders.push({
				text: this.cardHeader[0].display,
				type: this.cardHeader[0].type,
				alignment: this.cardHeader[0].alignment,
				textColor: this.cardHeader[0].textColor,
			});

			this.errorActionButton = this.cardHeader[0].errorActionButton;

			return;
		}
		this.cardHeader.map((config) => {
			if (config.type == "Parent" && this.parentDataProcess) {
				this.mapHeaderParent(data, config);
			} else {
				const field = config.field,
					sub = config.fieldSub;

				if (config.type && config.type == "boldText") {
					this.cardHeaders.push({
						text: config.display,
						type: config.type,
						alignment: config.alignment,
						textColor: config.textColor,
					});
				} else if (config.type && config.type == "status") {
					this.cardHeaders.push({
						text: data[field],
						type: _HeaderTypes.status,
						alignment: _HeaderAlignment.end,
						statusType: this.setStatusChip(data[config.field]),
						postText: data[config.postText],
						postLable: config.postLable,
						textColor: config.textColor,
					});
				} else if (!sub && !config.textPre) {
					this.cardHeaders.push({
						text: data[field],
						type: config.type,
						alignment: _HeaderAlignment.start,
						clickAction: config.clickAction,
						textColor: config.textColor,
					});
				} else if (sub && !config.textPre) {
					this.cardHeaders.push({
						text: data[field][sub],
						type: config.type,
						alignment: config.alignment,
						icon: config.icon,
						clickAction: config.clickAction,
						textColor: config.textColor,
					});
				} else if (sub && config.textPre) {
					this.cardHeaders.push({
						text: data[field][sub],
						type: config.type,
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
		});
	}

	setStatusChip(description: string): _StatusChip {
		let colour = _StatusChip.Action;
		if (description == "New Lead" || description == "Assigned") {
			colour = _StatusChip.newSale;
		} else if (description == "In Progress" || description == "Sale Process Started") {
			colour = _StatusChip.Action;
		} else if (description == "Lead Expired") {
			colour = _StatusChip.Default;
		} else if (description == "Lost Sale" || description == "Completed - No Sale") {
			colour = _StatusChip.Negative;
		}

		return colour;
	}

	getMenu(id: string): void {
		document.getElementById(id).classList.toggle("show");
	}

	menuClick(action: string): void {
		this.menuClickEvent.emit(action);
	}

	mouseOver(event: any, details: any, top: number = 0): void {
		this.showDetailCard = true;
		if (this.displayDetails?.length > 0) {
			this.top = event.y - 130 - top;
		} else {
			this.top = event.y - 70 - top;
		}

		this.left = event.x + 10;

		this.displayDetails = details;
	}

	mouseOff(): void {
		this.showDetailCard = false;
	}
}
