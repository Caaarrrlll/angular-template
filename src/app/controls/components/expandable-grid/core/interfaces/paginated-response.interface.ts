export interface _ExpandableGridPaginatedDataInterface<T> {
	data: T[];
	pageNumber: number;
	pageSize: number;
	totalCount: number;
}
