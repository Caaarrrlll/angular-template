import { Service } from "@angular/core";
import { _CustTableWrapperInterface, _DataProcessResponse } from "@shared/components/card-table/cust-card-table.interface";
import { _TableTypes as _CardTableTypes } from "@shared/components/card-table/cust-table.enum";
import { _CardTableParentDataContext } from "@shared/components/card-table/card-table.component";
import { _LinQGridFilterItem } from "@shared/models/linq-grid-filter-item";
import { _TableTypes } from "@shared/components/table/cust-table.enum";
import { _CustTableInterface } from "@shared/components/table/cust-table.interface";
import { LinQSort } from "@shared/models/lin-q-request-state";

/** Vehicle row used by the `app-table` and search/pipes demos (type alias so it is assignable to `Record<string, unknown>`). */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- type alias needed: interfaces are not assignable to Record<string, unknown> (table row APIs)
export type _SandboxVehicleRow = {
	reference: string;
	make: string;
	model: string;
	status: string;
	listedDate: Date;
	price: number;
	mileage: number;
	serviced: boolean;
	financed: boolean;
	discount: number;
	region: string;
	owners: string[];
	favourite: boolean;
};

/** Lead row used by the `app-card-table` demo. `createdDate` is an ISO string because the list-card header reads its length. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- type alias needed: interfaces are not assignable to Record<string, unknown> (list-card data APIs)
export type _SandboxLeadRow = {
	leadId: string;
	customer: string;
	status: string;
	createdDate: string;
	contact: { phone: string; email: string };
	vehicle: string;
	offer: number;
	source: string;
	branch: string;
};

/** Fixed "today" so derived values (days open) stay deterministic. */
const SANDBOX_REFERENCE_DATE: Date = new Date(2026, 10, 17);
const DAY_MS = 86_400_000;

@Service()
export class SandboxTablesDataService {
	// ---------------------------------------------------------------- app-table
	public readonly vehicles: readonly _SandboxVehicleRow[] = [
		{
			reference: `VH-1001`,
			make: `toyota`,
			model: `Corolla Cross`,
			status: `InStock`,
			listedDate: new Date(2026, 0, 15),
			price: 389900,
			mileage: 42150,
			serviced: true,
			financed: false,
			discount: 5,
			region: `GP`,
			owners: [`A. Naidoo`],
			favourite: false,
		},
		{
			reference: `VH-1002`,
			make: `volkswagen`,
			model: `Polo Vivo`,
			status: `Reserved`,
			listedDate: new Date(2026, 1, 3),
			price: 219500,
			mileage: 88400,
			serviced: false,
			financed: true,
			discount: 0,
			region: `WC`,
			owners: [`J. Smith`, `K. Dlamini`],
			favourite: true,
		},
		{
			reference: `VH-1003`,
			make: `ford`,
			model: `Ranger XLT`,
			status: `InStock`,
			listedDate: new Date(2026, 1, 21),
			price: 629000,
			mileage: 31200,
			serviced: true,
			financed: true,
			discount: 2.5,
			region: `KZN`,
			owners: [`P. van Wyk`],
			favourite: false,
		},
		{
			reference: `VH-1004`,
			make: `bmw`,
			model: `320i M Sport`,
			status: `AwaitingInspection`,
			listedDate: new Date(2026, 2, 8),
			price: 715000,
			mileage: 15800,
			serviced: true,
			financed: false,
			discount: 0,
			region: `GP`,
			owners: [],
			favourite: false,
		},
		{
			reference: `VH-1005`,
			make: `suzuki`,
			model: `Swift GL`,
			status: `Sold`,
			listedDate: new Date(2026, 2, 30),
			price: 184900,
			mileage: 120300,
			serviced: false,
			financed: false,
			discount: 10,
			region: `WC`,
			owners: [`L. Botha`, `S. Mokoena`, `T. Pillay`],
			favourite: false,
		},
		{
			reference: `VH-1006`,
			make: `hyundai`,
			model: `Tucson Elite`,
			status: `InStock`,
			listedDate: new Date(2026, 3, 12),
			price: 489000,
			mileage: 56700,
			serviced: true,
			financed: true,
			discount: 3,
			region: `KZN`,
			owners: [`R. Govender`],
			favourite: true,
		},
		{
			reference: `VH-1007`,
			make: `mercedes-benz`,
			model: `C200 AMG Line`,
			status: `Reserved`,
			listedDate: new Date(2026, 4, 2),
			price: 845000,
			mileage: 9800,
			serviced: true,
			financed: true,
			discount: 0,
			region: `GP`,
			owners: [],
			favourite: false,
		},
		{
			reference: `VH-1008`,
			make: `kia`,
			model: `Picanto Street`,
			status: `InStock`,
			listedDate: new Date(2026, 4, 27),
			price: 199900,
			mileage: 64300,
			serviced: false,
			financed: false,
			discount: 7.5,
			region: `WC`,
			owners: [`M. Jacobs`],
			favourite: false,
		},
		{
			reference: `VH-1009`,
			make: `toyota`,
			model: `Hilux Legend`,
			status: `AwaitingInspection`,
			listedDate: new Date(2026, 5, 18),
			price: 799500,
			mileage: 22400,
			serviced: true,
			financed: false,
			discount: 0,
			region: `KZN`,
			owners: [`D. Nel`, `F. Khumalo`],
			favourite: false,
		},
		{
			reference: `VH-1010`,
			make: `renault`,
			model: `Kwid Climber`,
			status: `Sold`,
			listedDate: new Date(2026, 6, 9),
			price: 159900,
			mileage: 101250,
			serviced: false,
			financed: true,
			discount: 12,
			region: `GP`,
			owners: [`H. Peters`],
			favourite: false,
		},
		{
			reference: `VH-1011`,
			make: `mazda`,
			model: `CX-5 Dynamic`,
			status: `InStock`,
			listedDate: new Date(2026, 7, 14),
			price: 512000,
			mileage: 47900,
			serviced: true,
			financed: false,
			discount: 4,
			region: `WC`,
			owners: [],
			favourite: true,
		},
		{
			reference: `VH-1012`,
			make: `nissan`,
			model: `Navara PRO-4X`,
			status: `Reserved`,
			listedDate: new Date(2026, 8, 5),
			price: 689900,
			mileage: 18650,
			serviced: true,
			financed: true,
			discount: 1.5,
			region: `KZN`,
			owners: [`G. Ferreira`],
			favourite: false,
		},
	];

	/** Column config for `app-table`: one column per renderer type worth showing. */
	public readonly vehicleColumns: _CustTableInterface[] = [
		{ display: `Reference`, colName: `reference`, type: _TableTypes.TextLink, width: `110px`, sticky: true },
		{ display: `Make`, colName: `make`, type: _TableTypes.TitleText, width: `130px` },
		{ display: `Model`, colName: `model`, type: _TableTypes.Text, width: `160px` },
		{ display: `Status`, colName: `status`, type: _TableTypes.SpaceUpperCase, width: `160px` },
		{ display: `Listed`, colName: `listedDate`, type: _TableTypes.Date, width: `110px` },
		{ display: `Price`, colName: `price`, type: _TableTypes.Currency, width: `130px` },
		{ display: `Mileage`, colName: `mileage`, type: _TableTypes.Odometer, width: `120px` },
		{ display: `Serviced`, colName: `serviced`, type: _TableTypes.Boolean, width: `90px` },
		{ display: `Financed`, colName: `financed`, type: _TableTypes.YesNo, width: `90px` },
		{ display: `Discount`, colName: `discount`, type: _TableTypes.Percentage, width: `90px` },
		{ display: `Region`, colName: `region`, type: _TableTypes.Dictionary, width: `130px`, dictionary: { GP: `Gauteng`, WC: `Western Cape`, KZN: `KwaZulu-Natal` } },
		{ display: `Owners`, colName: `owners`, type: _TableTypes.ListPopupHover, width: `140px`, disableSort: true },
		{ display: `Favourite`, colName: `favourite`, type: _TableTypes.FavouriteButton, width: `60px`, disableSort: true, disableDisplay: true, tooltip: `Toggle favourite` },
		{ display: `View`, colName: `view`, type: _TableTypes.ButtonPrimary, width: `100px`, disableSort: true, icon: `visibility` },
	];

	/** Fresh filter item per call: `app-linq-grid-filters` mutates the items it is given. */
	public createVehicleFilter(): _LinQGridFilterItem {
		return { name: `make`, display: `Search make / model`, config: { type: `text`, options: {} }, filter: { filters: [], logic: `and` } };
	}

	public filterVehicles(rows: readonly _SandboxVehicleRow[], text: string): _SandboxVehicleRow[] {
		const term = text.trim().toLowerCase();
		return term ? rows.filter((row) => `${row.make} ${row.model} ${row.reference}`.toLowerCase().includes(term)) : [...rows];
	}

	public sortVehicles(rows: _SandboxVehicleRow[], sort: LinQSort): _SandboxVehicleRow[] {
		const field = sort.field as keyof _SandboxVehicleRow;
		const factor = sort.direction === `asc` ? 1 : -1;
		return [...rows].sort((a, b) => this.compare(a[field], b[field]) * factor);
	}

	// ----------------------------------------------------------- app-card-table
	public readonly leads: readonly _SandboxLeadRow[] = [
		{
			leadId: `LD-2041`,
			customer: `Thandi Mokoena`,
			status: `New Lead`,
			createdDate: `2026-11-10`,
			contact: { phone: `082 555 0141`, email: `thandi@example.com` },
			vehicle: `2021 Toyota Corolla Cross`,
			offer: 352000,
			source: `Website`,
			branch: `Pretoria`,
		},
		{
			leadId: `LD-2042`,
			customer: `Johan Botha`,
			status: `In Progress`,
			createdDate: `2026-11-02`,
			contact: { phone: `083 555 0172`, email: `johan@example.com` },
			vehicle: `2019 Ford Ranger XLT`,
			offer: 498500,
			source: `Walk-in`,
			branch: `Cape Town`,
		},
		{
			leadId: `LD-2043`,
			customer: `Ayesha Patel`,
			status: `Ready for invoicing`,
			createdDate: `2026-10-28`,
			contact: { phone: `084 555 0190`, email: `ayesha@example.com` },
			vehicle: `2022 Hyundai Tucson Elite`,
			offer: 455000,
			source: `Referral`,
			branch: `Durban`,
		},
		{
			leadId: `LD-2044`,
			customer: `Sipho Dlamini`,
			status: `Completed - No Sale`,
			createdDate: `2026-10-15`,
			contact: { phone: `071 555 0113`, email: `sipho@example.com` },
			vehicle: `2018 VW Polo Vivo`,
			offer: 0,
			source: `Website`,
			branch: `Pretoria`,
		},
		{
			leadId: `LD-2045`,
			customer: `Mia van der Merwe`,
			status: `Assigned`,
			createdDate: `2026-11-14`,
			contact: { phone: `072 555 0168`, email: `mia@example.com` },
			vehicle: `2020 Mazda CX-5 Dynamic`,
			offer: 389000,
			source: `Call centre`,
			branch: `Cape Town`,
		},
		{
			leadId: `LD-2046`,
			customer: `Kabelo Nkosi`,
			status: `Lead Expired`,
			createdDate: `2026-09-30`,
			contact: { phone: `073 555 0155`, email: `kabelo@example.com` },
			vehicle: `2017 Kia Picanto Street`,
			offer: 98000,
			source: `Website`,
			branch: `Pretoria`,
		},
		{
			leadId: `LD-2047`,
			customer: `Lerato Khumalo`,
			status: `In Progress`,
			createdDate: `2026-11-06`,
			contact: { phone: `074 555 0127`, email: `lerato@example.com` },
			vehicle: `2023 Toyota Hilux Legend`,
			offer: 742000,
			source: `Referral`,
			branch: `Durban`,
		},
	];

	/** Card layout: headers, three field columns, a button column. Column widths are indexed by `column - 1`. */
	public readonly leadCardWrapper: _CustTableWrapperInterface = {
		cardHeaders: [
			{ display: `Customer`, field: `customer`, type: `Display`, textColor: `` },
			{ display: `Status`, field: `status`, type: `status`, textColor: ``, postText: `createdDate`, postLabel: `Created` },
		],
		cardTable: [
			{ display: `Lead`, field: `leadId`, type: _CardTableTypes.Text, column: 1 },
			{ display: `Source`, field: `source`, type: _CardTableTypes.Text, column: 1 },
			{ display: `Branch`, field: `branch`, type: _CardTableTypes.Text, column: 1 },
			{ display: `Phone`, field: `contact`, fieldSub: `phone`, type: _CardTableTypes.Text, column: 2 },
			{ display: `Email`, field: `contact`, fieldSub: `email`, type: _CardTableTypes.Text, column: 2 },
			{ display: `Vehicle`, field: `vehicle`, type: _CardTableTypes.Text, column: 3 },
			{ display: `Offer`, field: `offer`, type: _CardTableTypes.money, column: 3 },
			{ display: `Days open`, field: `createdDate`, type: _CardTableTypes.Parent, column: 3 },
		],
		cardTableProperties: [{ width: `27%` }, { width: `30%` }, { width: `30%` }],
		cardButtonTable: [
			{ value: `Open`, type: `button`, buttonClick: `openLead`, buttonType: `Primary` },
			{ value: `Archive`, type: `button`, buttonClick: `archiveLead`, buttonType: `Tertiary` },
		],
	};

	/** Fresh filter items per call: `app-linq-grid-filters` mutates the items it is given. */
	public createLeadFilters(): _LinQGridFilterItem[] {
		return [
			{ name: `customer`, display: `Customer`, config: { type: `text`, options: {} }, filter: { filters: [], logic: `and` } },
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
		const created = context.data[`createdDate`];
		if (typeof created !== `string`) {
			return undefined;
		}
		const days = Math.round((SANDBOX_REFERENCE_DATE.getTime() - new Date(created).getTime()) / DAY_MS);
		return { response: `${String(days)} days`, type: `text` };
	};

	// ------------------------------------------------------ app-linq-grid-filters
	/** One filter item of every supported `config.type`; `region` starts pre-selected. */
	public createFilterShowcase(): _LinQGridFilterItem[] {
		return [
			{ name: `make`, display: `Make`, config: { type: `text`, options: {} }, filter: { filters: [], logic: `and` } },
			{ name: `year`, display: `Year`, config: { type: `number`, options: {} }, filter: { filters: [], logic: `and` } },
			{ name: `serviced`, display: `Serviced only`, config: { type: `boolean`, options: {} }, filter: { filters: [], logic: `and` } },
			{ name: `listedDate`, display: `Listed on`, config: { type: `date`, options: {} }, filter: { filters: [], logic: `and` } },
			{ name: `createdDate`, display: `Created`, config: { type: `dateRange`, options: {} }, filter: { filters: [], logic: `and` } },
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
