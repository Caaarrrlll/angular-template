import { Service } from "@angular/core";
import { _CustTableWrapperInterface, _DataProcessResponse } from "@shared/components/card-table/cust-card-table.interface";
import { _TableTypes as _CardTableTypes } from "@shared/components/card-table/cust-table.enum";
import { _CardTableParentDataContext } from "@shared/components/card-table/card-table.component";
import { _Lead } from "@shared/models/lead";
import { _CustGridFilterItem } from "@shared/models/cust-grid-filter-item";
import { _Product } from "@shared/models/product";
import { _TableTypes } from "@shared/components/table/cust-table.enum";
import { _CustTableInterface } from "@shared/components/table/cust-table.interface";

/*
 * All data in this file is invented for the sandbox demos: product codes, names, customers, phone numbers,
 * email addresses (example.com), branches and amounts do not come from any real records.
 */

/** Product row used by the `app-table` and search/pipes demos: the generic `_Product` plus demo-only columns (one per table renderer). */
export type _SandboxProductRow = _Product & {
	category: string;
	price: number;
	status: string;
	listedDate: Date;
	/** Delivery distance in km (shows the `distance` renderer). */
	deliveryDistance: number;
	inspected: boolean;
	onPromotion: boolean;
	discount: number;
	region: string;
	suppliers: string[];
	favourite: boolean;
};

/** Lead row used by the `app-card-table` demo: the generic `_Lead` plus contact/source columns. `createdOn` is an ISO string (the list-card header reads its length). */
export type _SandboxLeadRow = _Lead & {
	createdOn: string;
	contact: { phone: string; email: string };
	product: string;
	amount: number;
	source: string;
	branch: string;
};

/** Fixed "today" so derived values (days open) stay deterministic. */
const SANDBOX_REFERENCE_DATE: Date = new Date(2026, 10, 17);
const DAY_MS = 86_400_000;

@Service()
export class SandboxTablesDataService {
	// ---------------------------------------------------------------- app-table
	public readonly products: readonly _SandboxProductRow[] = [
		{
			productCode: `PR-1001`,
			category: `furniture`,
			name: `Ergonomic Desk Chair`,
			status: `InStock`,
			listedDate: new Date(2026, 0, 15),
			price: 3899,
			quantity: 42,
			deliveryDistance: 42,
			inspected: true,
			onPromotion: false,
			discount: 5,
			region: `GP`,
			suppliers: [`A. Naidoo`],
			favourite: false,
		},
		{
			productCode: `PR-1002`,
			category: `electronics`,
			name: `27-inch Monitor`,
			status: `Reserved`,
			listedDate: new Date(2026, 1, 3),
			price: 4195,
			quantity: 8,
			deliveryDistance: 884,
			inspected: false,
			onPromotion: true,
			discount: 0,
			region: `WC`,
			suppliers: [`J. Smith`, `K. Dlamini`],
			favourite: true,
		},
		{
			productCode: `PR-1003`,
			category: `appliances`,
			name: `Espresso Machine`,
			status: `InStock`,
			listedDate: new Date(2026, 1, 21),
			price: 6290,
			quantity: 15,
			deliveryDistance: 312,
			inspected: true,
			onPromotion: true,
			discount: 2.5,
			region: `KZN`,
			suppliers: [`P. van Wyk`],
			favourite: false,
		},
		{
			productCode: `PR-1004`,
			category: `electronics`,
			name: `Laptop Docking Station`,
			status: `AwaitingInspection`,
			listedDate: new Date(2026, 2, 8),
			price: 2150,
			quantity: 30,
			deliveryDistance: 158,
			inspected: true,
			onPromotion: false,
			discount: 0,
			region: `GP`,
			suppliers: [],
			favourite: false,
		},
		{
			productCode: `PR-1005`,
			category: `stationery`,
			name: `A4 Paper (box of 5)`,
			status: `Sold`,
			listedDate: new Date(2026, 2, 30),
			price: 489,
			quantity: 0,
			deliveryDistance: 1203,
			inspected: false,
			onPromotion: false,
			discount: 10,
			region: `WC`,
			suppliers: [`L. Botha`, `S. Mokoena`, `T. Pillay`],
			favourite: false,
		},
		{
			productCode: `PR-1006`,
			category: `furniture`,
			name: `Standing Desk`,
			status: `InStock`,
			listedDate: new Date(2026, 3, 12),
			price: 7890,
			quantity: 6,
			deliveryDistance: 567,
			inspected: true,
			onPromotion: true,
			discount: 3,
			region: `KZN`,
			suppliers: [`R. Govender`],
			favourite: true,
		},
		{
			productCode: `PR-1007`,
			category: `tools`,
			name: `Cordless Drill Set`,
			status: `Reserved`,
			listedDate: new Date(2026, 4, 2),
			price: 2450,
			quantity: 12,
			deliveryDistance: 98,
			inspected: true,
			onPromotion: true,
			discount: 0,
			region: `GP`,
			suppliers: [],
			favourite: false,
		},
		{
			productCode: `PR-1008`,
			category: `stationery`,
			name: `Whiteboard 1200 x 900`,
			status: `InStock`,
			listedDate: new Date(2026, 4, 27),
			price: 1299,
			quantity: 20,
			deliveryDistance: 643,
			inspected: false,
			onPromotion: false,
			discount: 7.5,
			region: `WC`,
			suppliers: [`M. Jacobs`],
			favourite: false,
		},
		{
			productCode: `PR-1009`,
			category: `appliances`,
			name: `Bar Fridge`,
			status: `AwaitingInspection`,
			listedDate: new Date(2026, 5, 18),
			price: 3995,
			quantity: 4,
			deliveryDistance: 224,
			inspected: true,
			onPromotion: false,
			discount: 0,
			region: `KZN`,
			suppliers: [`D. Nel`, `F. Khumalo`],
			favourite: false,
		},
		{
			productCode: `PR-1010`,
			category: `electronics`,
			name: `Wireless Headset`,
			status: `Sold`,
			listedDate: new Date(2026, 6, 9),
			price: 1599,
			quantity: 0,
			deliveryDistance: 1012,
			inspected: false,
			onPromotion: true,
			discount: 12,
			region: `GP`,
			suppliers: [`H. Peters`],
			favourite: false,
		},
		{
			productCode: `PR-1011`,
			category: `furniture`,
			name: `Filing Cabinet`,
			status: `InStock`,
			listedDate: new Date(2026, 7, 14),
			price: 2290,
			quantity: 18,
			deliveryDistance: 479,
			inspected: true,
			onPromotion: false,
			discount: 4,
			region: `WC`,
			suppliers: [],
			favourite: true,
		},
		{
			productCode: `PR-1012`,
			category: `tools`,
			name: `Laser Measure`,
			status: `Reserved`,
			listedDate: new Date(2026, 8, 5),
			price: 899,
			quantity: 25,
			deliveryDistance: 186,
			inspected: true,
			onPromotion: true,
			discount: 1.5,
			region: `KZN`,
			suppliers: [`G. Ferreira`],
			favourite: false,
		},
	];

	/** Column config for `app-table`: one column per renderer type worth showing. */
	public readonly productColumns: _CustTableInterface[] = [
		{ display: `Product code`, colName: `productCode`, type: _TableTypes.TextLink, width: `120px`, sticky: true },
		{ display: `Category`, colName: `category`, type: _TableTypes.TitleText, width: `130px` },
		{ display: `Name`, colName: `name`, type: _TableTypes.Text, width: `180px` },
		{ display: `Status`, colName: `status`, type: _TableTypes.SpaceUpperCase, width: `160px` },
		{ display: `Listed`, colName: `listedDate`, type: _TableTypes.Date, width: `110px` },
		{ display: `Price`, colName: `price`, type: _TableTypes.Currency, width: `130px` },
		{ display: `Delivery`, colName: `deliveryDistance`, type: _TableTypes.Distance, width: `110px` },
		{ display: `Inspected`, colName: `inspected`, type: _TableTypes.Boolean, width: `90px` },
		{ display: `On promotion`, colName: `onPromotion`, type: _TableTypes.YesNo, width: `110px` },
		{ display: `Discount`, colName: `discount`, type: _TableTypes.Percentage, width: `90px` },
		{ display: `Region`, colName: `region`, type: _TableTypes.Dictionary, width: `130px`, dictionary: { GP: `Gauteng`, WC: `Western Cape`, KZN: `KwaZulu-Natal` } },
		{ display: `Suppliers`, colName: `suppliers`, type: _TableTypes.ListPopupHover, width: `140px`, disableSort: true },
		{ display: `Favourite`, colName: `favourite`, type: _TableTypes.FavouriteButton, width: `60px`, disableSort: true, disableDisplay: true, tooltip: `Toggle favourite` },
		{ display: `View`, colName: `view`, type: _TableTypes.ButtonPrimary, width: `100px`, disableSort: true, icon: `visibility` },
	];

	/** Fresh filter item per call, so each demo owns its config object. */
	public createProductFilter(): _CustGridFilterItem {
		return { name: `name`, display: `Search name / category`, config: { type: `text`, options: {} }, filter: { filters: [], logic: `and` } };
	}

	public filterProducts(rows: readonly _SandboxProductRow[], text: string): _SandboxProductRow[] {
		const term = text.trim().toLowerCase();
		return term ? rows.filter((row) => `${row.category} ${row.name} ${row.productCode}`.toLowerCase().includes(term)) : [...rows];
	}

	public sortProducts(rows: _SandboxProductRow[], sort: _SandboxSort): _SandboxProductRow[] {
		const field = sort.field as keyof _SandboxProductRow;
		const factor = sort.direction === `asc` ? 1 : -1;
		return [...rows].sort((a, b) => this.compare(a[field], b[field]) * factor);
	}

	// ----------------------------------------------------------- app-card-table
	public readonly leads: readonly _SandboxLeadRow[] = [
		{
			leadCode: `LD-2041`,
			type: `buy`,
			customerName: `Thandi Mokoena`,
			status: `New`,
			createdOn: `2026-11-10`,
			contact: { phone: `082 555 0141`, email: `thandi@example.com` },
			productCode: `PR-1003`,
			product: `Espresso Machine`,
			amount: 6290,
			source: `Website`,
			branch: `Pretoria`,
		},
		{
			leadCode: `LD-2042`,
			type: `sale`,
			customerName: `Johan Botha`,
			status: `In Progress`,
			createdOn: `2026-11-02`,
			contact: { phone: `083 555 0172`, email: `johan@example.com` },
			productCode: `PR-1006`,
			product: `Standing Desk`,
			amount: 5400,
			source: `Walk-in`,
			branch: `Cape Town`,
		},
		{
			leadCode: `LD-2043`,
			type: `buy`,
			customerName: `Ayesha Patel`,
			status: `Completed`,
			createdOn: `2026-10-28`,
			contact: { phone: `084 555 0190`, email: `ayesha@example.com` },
			productCode: `PR-1002`,
			product: `27-inch Monitor`,
			amount: 4195,
			source: `Referral`,
			branch: `Durban`,
		},
		{
			leadCode: `LD-2044`,
			type: `sale`,
			customerName: `Sipho Dlamini`,
			status: `Lost`,
			createdOn: `2026-10-15`,
			contact: { phone: `071 555 0113`, email: `sipho@example.com` },
			productCode: `PR-1008`,
			product: `Whiteboard 1200 x 900`,
			amount: 0,
			source: `Website`,
			branch: `Pretoria`,
		},
		{
			leadCode: `LD-2045`,
			type: `buy`,
			customerName: `Mia van der Merwe`,
			status: `Assigned`,
			createdOn: `2026-11-14`,
			contact: { phone: `072 555 0168`, email: `mia@example.com` },
			productCode: `PR-1011`,
			product: `Filing Cabinet`,
			amount: 2290,
			source: `Call centre`,
			branch: `Cape Town`,
		},
		{
			leadCode: `LD-2046`,
			type: `sale`,
			customerName: `Kabelo Nkosi`,
			status: `Expired`,
			createdOn: `2026-09-30`,
			contact: { phone: `073 555 0155`, email: `kabelo@example.com` },
			productCode: `PR-1007`,
			product: `Cordless Drill Set`,
			amount: 1800,
			source: `Website`,
			branch: `Pretoria`,
		},
		{
			leadCode: `LD-2047`,
			type: `buy`,
			customerName: `Lerato Khumalo`,
			status: `In Progress`,
			createdOn: `2026-11-06`,
			contact: { phone: `074 555 0127`, email: `lerato@example.com` },
			productCode: `PR-1009`,
			product: `Bar Fridge`,
			amount: 3995,
			source: `Referral`,
			branch: `Durban`,
		},
	];

	/** Card layout: headers, three field columns, a button column. Column widths are indexed by `column - 1`. */
	public readonly leadCardWrapper: _CustTableWrapperInterface = {
		cardHeaders: [
			{ display: `Customer`, field: `customerName`, type: `Display`, textColor: `` },
			{ display: `Status`, field: `status`, type: `status`, textColor: ``, postText: `createdOn`, postLabel: `Created` },
		],
		cardTable: [
			{ display: `Lead code`, field: `leadCode`, type: _CardTableTypes.Text, column: 1 },
			{ display: `Type`, field: `type`, type: _CardTableTypes.Text, column: 1 },
			{ display: `Source`, field: `source`, type: _CardTableTypes.Text, column: 1 },
			{ display: `Branch`, field: `branch`, type: _CardTableTypes.Text, column: 1 },
			{ display: `Phone`, field: `contact`, fieldSub: `phone`, type: _CardTableTypes.Text, column: 2 },
			{ display: `Email`, field: `contact`, fieldSub: `email`, type: _CardTableTypes.Text, column: 2 },
			{ display: `Product`, field: `product`, type: _CardTableTypes.Text, column: 3 },
			{ display: `Amount`, field: `amount`, type: _CardTableTypes.money, column: 3 },
			{ display: `Days open`, field: `createdOn`, type: _CardTableTypes.Parent, column: 3 },
		],
		cardTableProperties: [{ width: `27%` }, { width: `30%` }, { width: `30%` }],
		cardButtonTable: [
			{ value: `Open`, type: `button`, buttonClick: `openLead`, buttonType: `Primary` },
			{ value: `Archive`, type: `button`, buttonClick: `archiveLead`, buttonType: `Tertiary` },
		],
	};

	/** Fresh filter items per call, so each demo owns its config objects. */
	public createLeadFilters(): _CustGridFilterItem[] {
		return [
			{ name: `customerName`, display: `Customer`, config: { type: `text`, options: {} }, filter: { filters: [], logic: `and` } },
			{
				name: `status`,
				display: `Status`,
				config: { type: `select`, options: { optionsList: [{ display: `Any`, value: `` }, ...this.leadStatuses().map((status) => ({ display: status, value: status }))] } },
				filter: { filters: [], logic: `and` },
			},
		];
	}

	/**
	 * `parentDataProcess` handler for `type: Parent` card fields: computes the value instead of reading it.
	 * Arrow property so it keeps `this` when the card calls it.
	 */
	public readonly leadDataProcess = (context: _CardTableParentDataContext): _DataProcessResponse | undefined => {
		const created = context.data[`createdOn`];
		if (typeof created !== `string`) {
			return undefined;
		}
		const days = Math.round((SANDBOX_REFERENCE_DATE.getTime() - new Date(created).getTime()) / DAY_MS);
		return { response: `${String(days)} days`, type: `text` };
	};

	// ------------------------------------------------------ app-grid-filters
	/** One filter item of every supported `config.type`; `region` starts pre-selected. */
	public createFilterShowcase(): _CustGridFilterItem[] {
		return [
			{ name: `category`, display: `Category`, config: { type: `text`, options: {} }, filter: { filters: [], logic: `and` } },
			{ name: `quantity`, display: `Quantity`, config: { type: `number`, options: {} }, filter: { filters: [], logic: `and` } },
			{ name: `inspected`, display: `Inspected only`, config: { type: `boolean`, options: {} }, filter: { filters: [], logic: `and` } },
			{ name: `listedDate`, display: `Listed on`, config: { type: `date`, options: {} }, filter: { filters: [], logic: `and` } },
			{ name: `createdOn`, display: `Created`, config: { type: `dateRange`, options: {} }, filter: { filters: [], logic: `and` } },
			{
				name: `region`,
				display: `Region`,
				active: true,
				config: {
					type: `select`,
					options: {
						optionsList: [
							{ display: `Gauteng`, value: `GP` },
							{ display: `Western Cape`, value: `WC` },
							{ display: `KwaZulu-Natal`, value: `KZN` },
						],
					},
				},
				filter: { filters: [{ field: `region`, operator: `eq`, value: `GP` }], logic: `and` },
			},
		];
	}

	private leadStatuses(): string[] {
		return [...new Set(this.leads.map((lead) => lead.status))];
	}

	private compare(a: unknown, b: unknown): number {
		const left = a instanceof Date ? a.getTime() : a;
		const right = b instanceof Date ? b.getTime() : b;
		if (typeof left === `string` && typeof right === `string`) {
			return left.localeCompare(right);
		}
		return Number(left) - Number(right);
	}
}

/** Sort state the sandbox applies client-side (from the table's `announceSortChange` action). */
export interface _SandboxSort {
	field: string;
	direction: `asc` | `desc`;
}
