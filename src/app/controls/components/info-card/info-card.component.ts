import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
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
import { DEFAULT_STATUS_CHIPS, _HeaderAlignment, _HeaderTypes, _StatusChip } from "@shared/components/list-card/list-card.enum";
import { _CardCol, _CardRow } from "@shared/components/list-card/list-card.interface";
import { _CustButtonInput } from "@shared/models/cust-basic-controls";
import { ButtonComponent } from "@shared/components/button/button/button.component";
import { ChipStatusComponent } from "@shared/components/chip-status/chip-status.component";
import { CurrencyComponent } from "@shared/components/currency/currency.component";
import { _DisplayDetail, _InfoCardButtonClick } from "./info-card.models";

export interface _InfoCardParentDataContext {
	data: Record<string, unknown>;
	config: unknown;
	claims: string[];
}

@Component({
	selector: "app-info-card",
	templateUrl: "./info-card.component.html",
	styleUrls: ["./info-card.component.scss"],
	imports: [CommonModule, MatCardModule, MatDividerModule, MatIconModule, ButtonComponent, ChipStatusComponent, CurrencyComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent implements OnChanges {
	@Input() public data?: Record<string, unknown>;
	@Input({ required: true }) public cardHeader!: _CustCardHeaderTableInterface[];
	@Input() public tableHeaderMenu?: _CustCardHeaderMenuInterface;
	@Input() public tableButtonConfig?: _CustCardButtonTableInterface[];
	@Input({ required: true }) public tableConfig!: _CustCardTableInterface[];
	@Input({ required: true }) public tableProperties!: _CustTablePropertiesExtConfig;
	@Input() public parentDataProcess: ((context: _InfoCardParentDataContext) => _DataProcessResponse | undefined) | undefined;
	@Input() public claims: string[] = [];
	@Input() public dateFormat = "yyyy/MM/dd";
	@Input() public footerChips?: _CustFooterChips;
	/** Status text → chip type for the `status` header; unknown statuses get `Default`. */
	@Input() public statusChips: Readonly<Record<string, _StatusChip>> = DEFAULT_STATUS_CHIPS;

	@Output() public buttonClick: EventEmitter<_InfoCardButtonClick> = new EventEmitter<_InfoCardButtonClick>();
	@Output() public menuClickEvent: EventEmitter<string> = new EventEmitter<string>();

	public cardRows: _CardRow[] = [];
	public cardCols: _CardCol[] = [];
	public cardHeaders: _CustCardHeaderDataInterface[] = [];
	public maxLines = 0;
	public showDetailCard = false;
	public top = 0;
	public left = 0;
	public displayDetails: _DisplayDetail[] = [];
	public errorActionButton = "";
	/** Card body height: `tableProperties.height`, or derived from the row count when `heightAuto` is set (the input is never written to). */
	public cardHeight = "";
	public menuOpen = false;

	/** Rebuilds the card whenever an input gets a new reference (it used to be mapped once, so later changes were ignored). */
	public ngOnChanges(): void {
		this.cardRows = [];
		this.cardCols = [];
		this.cardHeaders = [];
		this.maxLines = 0;
		this.errorActionButton = ``;
		this.mapData();

		this.cardHeight = this.tableProperties.heightAuto ? `${String(this.tableConfig.length * 22)}px` : this.tableProperties.height;
	}

	public buttonAction(action: string): void {
		const retObj: _InfoCardButtonClick = {
			action: action,
			data: this.data ?? {},
		};

		this.buttonClick.emit(retObj);
	}

	public displayList(detail: _CardCol): _DisplayDetail[] {
		return (detail.list ?? []) as _DisplayDetail[];
	}

	public tableButton(detail: _CardCol, width: string): _CustButtonInput {
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

	public headerButton(menu: _CustCardHeaderMenuInterface): _CustButtonInput {
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

	private mapDataParent(data: Record<string, unknown>, config: _CustCardTableInterface): void {
		const resp = this.parentDataProcess?.({
			data: data,
			config: config,
			claims: this.claims,
		});

		if (resp) {
			switch (resp.type) {
				case _TableTypes.DisplayList: {
					this.cardCols.push({
						label: config.display,
						value: resp.response,
						type: resp.type,
						valueColor: resp.action,
						buttonClick: resp.buttonAction,
						list: resp.displayList,
					});
					break;
				}
				case "button": {
					this.cardCols.push({
						label: config.display,
						value: resp.response,
						type: resp.type,
						valueColor: resp.action,
						buttonClick: resp.buttonAction,
					});
					break;
				}
				case "chipsStatus": {
					this.cardCols.push({
						label: config.display,
						value: resp.response,
						type: resp.type,
						valueColor: resp.action,
					});
					break;
				}
				case "textLink": {
					this.cardCols.push({
						label: config.display,
						value: resp.response,
						type: resp.type,
						valueColor: resp.action,
						url: resp.url,
					});
					break;
				}
				case "textWithEdit": {
					this.cardCols.push({
						label: config.display,
						value: resp.response,
						type: resp.type,
						buttonClick: resp.editAction,
					});
					break;
				}
				case "textCombined": {
					this.cardCols.push({
						label: config.display,
						value: resp.response,
						type: resp.type,
						buttonClick: resp.buttonAction,
					});
					break;
				}
				default: {
					this.cardCols.push({
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: empty string must fall back
						label: resp.label ? resp.label : config.display,
						value: resp.response,
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: empty string must fall back
						type: resp.type ? resp.type : _TableTypes.Text,
					});
					break;
				}
			}
		}
	}

	private mapField(data: Record<string, unknown> | undefined): void {
		let currentCol = 1;

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

			if (config.type === _TableTypes.Parent && this.parentDataProcess) {
				this.mapDataParent(data, config);
			} else {
				const field: string = config.field,
					sub: string | undefined = config.fieldSub;

				// `false` and `0` are real values: only missing/empty ones are skipped.
				if (!sub && hasValue(data[field])) {
					this.cardCols.push({
						label: config.display,
						value: data[field] as string,
						type: config.type,
						buttonClick: config.editAction,
					});
				} else if (sub) {
					const fieldValue: unknown = data[field];
					const subValue: unknown = fieldValue ? (fieldValue as Record<string, unknown>)[sub] : undefined;

					if (fieldValue) {
						this.cardCols.push({
							label: config.display,
							value: this.subFieldValue(subValue, config.type),
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

	/**
	 * Display value for a `fieldSub` cell. The template's boolean case tests truthiness (check vs cross), so false must
	 * be a falsy string: the old `"No"` was truthy and showed a check mark. Missing text falls back to "N/A".
	 */
	private subFieldValue(subValue: unknown, type: string | undefined): string {
		if (type === _TableTypes.Boolean) {
			return subValue ? `Yes` : ``;
		}
		if (!hasValue(subValue) && type === _TableTypes.Text) {
			return `N/A`;
		}
		return subValue as string;
	}

	private mapHeaderParent(data: Record<string, unknown>, config: _CustCardHeaderTableInterface): void {
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
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: empty string must fall back
					alignment: resp.alignment ? resp.alignment : _HeaderAlignment.center,
					statusType: resp.action,
				});
			} else {
				this.cardHeaders.push({
					text: resp.response,
					type: _HeaderTypes.display,
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- intentional truthiness check: empty string must fall back
					alignment: resp.alignment ? resp.alignment : _HeaderAlignment.center,
					textColor: config.textColor,
				});
			}
		}
	}

	private mapHeader(data: Record<string, unknown> | undefined): void {
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
				this.mapHeaderParent(data, config);
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
						text: data[field] as string,
						type: _HeaderTypes.status,
						alignment: _HeaderAlignment.end,
						statusType: this.setStatusChip(data[config.field] as string),
						postText: config.postText !== undefined ? (data[config.postText] as string) : undefined,
						postLabel: config.postLabel,
						textColor: config.textColor,
					});
				} else if (!sub && !config.textPre) {
					this.cardHeaders.push({
						text: data[field] as string,
						type: config.type ?? _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						clickAction: config.clickAction,
						textColor: config.textColor,
					});
				} else if (sub && !config.textPre) {
					this.cardHeaders.push({
						text: (data[field] as Record<string, unknown>)[sub] as string,
						type: config.type ?? _HeaderTypes.display,
						alignment: config.alignment ?? _HeaderAlignment.start,
						icon: config.icon,
						clickAction: config.clickAction,
						textColor: config.textColor,
					});
				} else if (sub && config.textPre) {
					this.cardHeaders.push({
						text: (data[field] as Record<string, unknown>)[sub] as string,
						type: config.type ?? _HeaderTypes.display,
						alignment: _HeaderAlignment.start,
						textPre: data[config.textPre] as string,
						textColor: config.textColor,
					});
				} else if (!sub && config.textPre) {
					this.cardHeaders.push({
						text: data[field] as string,
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
		return this.statusChips[description] ?? _StatusChip.Default;
	}

	/** Per-instance menu state, so cards that share a menu `id` no longer toggle each other's menus. */
	public toggleMenu(): void {
		this.menuOpen = !this.menuOpen;
	}

	public menuClick(action: string): void {
		this.menuClickEvent.emit(action);
	}

	public mouseOver(event: MouseEvent | FocusEvent, details: _DisplayDetail[], top = 0): void {
		this.showDetailCard = true;
		// Keyboard focus has no pointer coordinates: anchor the popup to the focused element instead.
		const point: { x: number; y: number } = event instanceof MouseEvent ? { x: event.x, y: event.y } : this.elementAnchor(event.target);
		if (this.displayDetails.length > 0) {
			this.top = point.y - 130 - top;
		} else {
			this.top = point.y - 70 - top;
		}

		this.left = point.x + 10;

		this.displayDetails = details;
	}

	public mouseOff(): void {
		this.showDetailCard = false;
	}

	private elementAnchor(target: EventTarget | null): { x: number; y: number } {
		const rect: DOMRect | undefined = target instanceof Element ? target.getBoundingClientRect() : undefined;
		return rect ? { x: rect.right, y: rect.top + rect.height / 2 } : { x: 0, y: 0 };
	}
}

/** A cell value worth rendering: anything except `null`, `undefined` and the empty string (so `false` and `0` count). */
function hasValue(value: unknown): boolean {
	return value !== null && value !== undefined && value !== ``;
}
