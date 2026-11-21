/**
 * Chip type (display name passed to `app-chip-status [type]`) → CSS class in chip-status.component.scss.
 * Generic workflow + commerce statuses only; a fork adds its own entries here (with a matching style).
 */
export const ChipStatus: Record<string, string> = {
	Action: "action",
	Informative: "informative",
	Negative: "negative",
	Inactive: "inactive",
	Progress: "progress",
	New: "new",
	Default: "default",
	Approved: "Approved",
	Assigned: "Assigned",
	"Awaiting Customer Action": "awaitingCustomerAction",
	Escalated: "Escalated",
	"Feedback Required": "feedbackRequired",
	Rejected: "rejected",
	Resolved: "resolved",
	// Commerce statuses (buy/sale leads, products)
	Sold: "sold",
	Bought: "bought",
	Reserved: "reserved",
	"For Sale": "forSale",
	"In transit": "inTransit",
	Online: "online",
};
