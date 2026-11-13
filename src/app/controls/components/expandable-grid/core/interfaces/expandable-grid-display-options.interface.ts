export interface _ExpandableGridDisplayOptionsInterface<T = Record<string, unknown>> {
	columnDef: string;
	header?: string;
	cell?: (element: T) => unknown;
}
