import { _Dictionary } from "@shared/components/expandable-grid/core/interfaces/dictionary.interface";
import { _InputType } from "../types/input-type.type";

export interface _ExpandableGridOptionsInterface {
	key: string;
	type: _InputType;
	title?: string;
	hint?: string;
	typeValues?: _Dictionary<unknown>;
	maxLength?: number;
}
