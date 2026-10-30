import { _Dictionary } from "@shared/components/expandable-grid/core/interfaces/dictionary.interface";
import { InputType } from "../types/input-type.type";

export interface _ExpandableGridOptionsInterface {
	key: string;
	type: InputType;
	title?: string;
	hint?: string;
	typeValues?: _Dictionary<unknown>;
	maxLength?: number;
}
