export interface LinQSort {
	field: string;
	direction: "asc" | "desc";
}

export interface LinQRequestState {
	skip?: number;
	take?: number;
	sorts: LinQSort[];
	filters?: unknown;
}
