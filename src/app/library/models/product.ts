/**
 * Generic product / stock item. `productCode` is the business identifier (SKU, stock number, …);
 * extend it in a fork (`type _MyProduct = _Product & { … }`) rather than adding domain fields here.
 * A type alias, not an interface, so rows stay assignable to the `Record<string, unknown>` row APIs of the table and card controls.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- see above: interfaces are not assignable to Record<string, unknown>
export type _Product = {
	productCode: string;
	name: string;
	description?: string;
	category?: string;
	/** Unit price in `currencyCode` (falls back to the app's `DEFAULT_CURRENCY_CODE` when omitted). */
	price?: number;
	currencyCode?: string;
	/** Units on hand. */
	quantity?: number;
	status?: string;
	imageUrl?: string;
	createdOn?: string;
};
