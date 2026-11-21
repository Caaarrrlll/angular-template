/** Chip types (keys of `ChipStatus`) a card status can map to. */
export enum _StatusChip {
	Informative = "Informative",
	Action = "Action",
	Negative = "Negative",
	New = "New",
	Default = "Default",
}

/**
 * Default status text → chip type map for the `status` header of list-card and info-card (generic lead/product statuses).
 * Pass `statusChips` to a card to use your own; statuses that are not in the map get `_StatusChip.Default`.
 */
export const DEFAULT_STATUS_CHIPS: Readonly<Record<string, _StatusChip>> = {
	New: _StatusChip.New,
	Assigned: _StatusChip.New,
	"In Progress": _StatusChip.Action,
	Pending: _StatusChip.Action,
	Completed: _StatusChip.Informative,
	Sold: _StatusChip.Informative,
	Bought: _StatusChip.Informative,
	Expired: _StatusChip.Default,
	Cancelled: _StatusChip.Negative,
	Lost: _StatusChip.Negative,
	Error: _StatusChip.Negative,
};

export enum _HeaderAlignment {
	end = "end",
	start = "start",
	center = "center",
}

export enum _ButtonTypes {
	primary = "Primary",
	secondary = "Secondary",
	tertiary = "Tertiary",
}

export enum _HeaderTypes {
	display = "Display",
	status = "status",
	chipsStatus = "chipsStatus",
}
