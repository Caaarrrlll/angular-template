import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { _HeaderAlignment, _HeaderTypes, _StatusChip } from "@controls/cust-basic-controls/cust-list-card/cust-list-card.enum";
import { _CardCol, _CardListButtons, _CardRow } from "@controls/cust-basic-controls/cust-list-card/cust-list-card.interface";
import { _TableTypes } from "@controls/cust-card-table/enums/cust-table.enum";
import {
	_CustCardButtonTableInterface,
	_CustCardHeaderDataInterface,
	_CustCardHeaderTableInterface,
	_CustCardTableInterface,
	_CustTablePropertiesConfig,
} from "@controls/cust-card-table/interfaces/cust-card-table.interface";
import { LoginService } from "@services/login.service";
import { UserSettingsModel } from "src/app/modules/settings/models/settings.model";

@Component({
	selector: "cust-list-card",
	templateUrl: "./cust-list-card.component.html",
	styleUrls: ["./cust-list-card.component.scss"],
})
export class CustListCardComponent implements AfterContentInit, OnChanges {
	@Input() data: Array<unknown>;
	@Input() cardHeader: _CustCardHeaderTableInterface[];
	@Input() tableButtonConfig: _CustCardButtonTableInterface[];
	@Input() tableConfig: _CustCardTableInterface[];
	@Input() tablePropertiesConfig: _CustTablePropertiesConfig[];
	@Input() parentDataProcess: Function;
	@Input() parentButtonProcess: Function;
	@Input() spinner?: number;

	@Output() buttonClick: EventEmitter<any> = new EventEmitter<any>();
	@Output() buttonActionOut: EventEmitter<any> = new EventEmitter<any>();

	pulseColour: string = "";
	taskName = undefined;
	cardRows: _CardRow[] = [];
	cardCols: _CardCol[] = [];
	carHeaders: _CustCardHeaderDataInterface[] = [];
	claimsMain: string[] = [];
	maxLines: number = 0;

	constructor(public userSettingsModel: UserSettingsModel, private loginService: LoginService) {}

	ngAfterContentInit(): void {
		this.claimsMain = this.loginService.getClaims();
		this.mapData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!changes?.spinner?.firstChange) {
			for (const row of this.cardRows) {
				for (const col of row.item) {
					if (col.type === "button" && col.loading) {
						col.loading = false;
					}
				}
			}
		}
	}

	buttonAction(action: string): void {
		const retObj = {
			action: action,
			data: this.data,
		};

		this.cardRows.map((row) => {
			row.item.map((col) => {
				if (col.value === action["value"]) {
					if ("loading" in col) {
						col["loading"] = true;
					}
				}
			});
		});

		this.buttonClick.emit(retObj);
	}

	setPulseColour(timeRemaining: number): void {
		this.pulseColour = timeRemaining >= 60 ? "pulse" : timeRemaining > 0 ? "urgent" : "";
	}

	mapData(): void {
		this.mapField(this.data);
		this.mapHeader(this.data);

		if (this.parentButtonProcess) {
			const res: _CardListButtons = this.parentButtonProcess({
				data: this.data,
				claims: this.claimsMain,
			});

			this.taskName = res.taskName;
			res.buttons.map((buttonToAdd) => {
				this.cardCols.push(buttonToAdd);
			});
			if (this.tableButtonConfig) {
				this.mapButton();
			}

			this.cardRows.push({
				item: [...this.cardCols],
				colSCSS: "col-no-border",
				pulse: this.taskName !== undefined && !this.data["taskAccepted"],
				width: "13%",
			});
			this.cardCols.splice(0, this.cardCols.length);
		} else {
			this.mapButton();
			this.cardRows.push({
				item: [...this.cardCols],
				colSCSS: "col-no-border",
				pulse: this.taskName !== undefined && !this.data["taskAccepted"],
				width: "13%",
			});
			this.cardCols.splice(0, this.cardCols.length);
		}
	}

	mapButton(): void {
		this.tableButtonConfig.map((config) => {
			this.cardCols.push({
				value: config.value,
				type: "button",
				buttonClick: config.buttonClick,
				buttonType: config.buttonType,
			});
		});
	}

	mapDataParent(data: unknown, config: unknown): void {
		const resp = this.parentDataProcess({
			data: data,
			config: config,
			claims: this.claimsMain,
		});

		if (resp) {
			if (resp.type == "chipsStatus") {
				this.cardCols.push({
					label: config["display"],
					value: resp.response,
					type: resp.type ? resp.type : _TableTypes.Text,
					valueColor: resp.action,
				});
			} else {
				this.cardCols.push({
					label: resp.label ? resp.label : config["display"],
					value: resp.response,
					type: resp.type ? resp.type : _TableTypes.Text,
					whatsappMessage: resp.whatsAppMessage ? resp.whatsAppMessage : "",
					iconName: resp.iconName,
					iconColour: resp.iconColour,
					imageIcons: resp.imageIcons,
				});
			}
		}
	}

	mapField(data: unknown): void {
		let currentCol: number = 1;

		let lines: number = 0;
		this.tableConfig.map((config) => {
			if (currentCol != config.column) {
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
					});
				} else if (sub) {
					this.cardCols.push({
						label: config.display,
						value: !data[field]
							? "N/A"
							: data[field][sub]
							? data[field][sub]
							: config.type == _TableTypes.Text
							? "N/A"
							: config.type == "boolean"
							? data[field][sub]
								? "Yes"
								: "No"
							: data[field][sub],
						type: config.type,
					});
				}
			}
			lines++;
		});
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

	mapHeaderParent(data: unknown, config: unknown) {
		const resp = this.parentDataProcess({
			data: data,
			config: config,
			claims: this.claimsMain,
		});

		if (resp) {
			if (resp.type == "chipsStatus" && !resp.postText) {
				this.carHeaders.push({
					text: resp.response,
					type: _HeaderTypes.chipsStatus,
					alignment: resp.alignment ? resp.alignment : _HeaderAlignment.center,
					statusType: resp.action,
				});
			} else if (resp.textPre) {
				this.carHeaders.push({
					text: resp.response,
					type: _HeaderTypes.display,
					alignment: resp.alignment ? resp.alignment : _HeaderAlignment.center,
					textColor: config["textColor"],
					textPre: resp.textPre,
					length: resp.length ? resp.length : 40,
				});
			} else if (resp.postText) {
				this.carHeaders.push({
					text: resp.response,
					type: _HeaderTypes.status,
					alignment: resp.alignment ? resp.alignment : _HeaderAlignment.center,
					textColor: config["textColor"],
					postText: resp.postText,
					postLable: resp.postLable,
					statusType: resp.action,
				});
			} else {
				this.carHeaders.push({
					text: resp.response,
					type: _HeaderTypes.display,
					alignment: resp.alignment ? resp.alignment : _HeaderAlignment.center,
					textColor: config["textColor"],
				});
			}
		}
	}

	mapHeader(data: unknown): void {
		this.cardHeader.map((config) => {
			if (config.type == "Parent" && this.parentDataProcess) {
				this.mapHeaderParent(data, config);
			} else {
				const field = config.field,
					sub = config.fieldSub;

				if (config.type && config.type == "status") {
					this.carHeaders.push({
						text: data[field],
						type: _HeaderTypes.status,
						alignment: _HeaderAlignment.end,
						statusType: this.setStatusChip(data[config.field]),
						postText: data[config.postText],
						postLable: config.postLable,
					});
				} else if (!sub && !config.textPre) {
					this.carHeaders.push({
						text: data[field],
						type: config.type,
						alignment: _HeaderAlignment.start,
					});
				} else if (sub && !config.textPre) {
					this.carHeaders.push({
						text: data[field],
						type: config.type,
						alignment: _HeaderAlignment.start,
					});
				} else if (config.textPre) {
					this.carHeaders.push({
						text: data[field][sub],
						type: _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						textPre: data[config.textPre],
					});
				}
			}
		});
	}

	setStatusChip(description: string): _StatusChip {
		if (["Ready for invoicing"].includes(description)) return _StatusChip.Informative;
		if (["Error", "Lost Sale", "Completed - No Sale"].includes(description)) return _StatusChip.Negative;
		if (["New Lead", "Assigned"].includes(description)) return _StatusChip.newSale;
		if (["In Progress", "Sale Process Started", "Sale Initiated", "Not yet submitted"].includes(description)) return _StatusChip.Action;
		if (["Lead Expired"].includes(description)) return _StatusChip.Default;

		return _StatusChip.Default;
	}
}
