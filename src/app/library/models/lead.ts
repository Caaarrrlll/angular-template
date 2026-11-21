/** Direction of a lead: the customer wants to buy from you, or to sell to you. */
export type _LeadType = "buy" | "sale";

/**
 * Generic sales lead. `leadCode` is the business identifier; `productCode` links it to a `_Product` when it concerns one.
 * Extend it in a fork (`type _MyLead = _Lead & { … }`) rather than adding domain fields here.
 * A type alias, not an interface, so rows stay assignable to the `Record<string, unknown>` row APIs of the table and card controls.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- see above: interfaces are not assignable to Record<string, unknown>
export type _Lead = {
	leadCode: string;
	type: _LeadType;
	status: string;
	customerName: string;
	productCode?: string;
	/** Amount in `currencyCode` (falls back to the app's `DEFAULT_CURRENCY_CODE` when omitted). */
	amount?: number;
	currencyCode?: string;
	assignedTo?: string;
	createdOn?: string;
};
