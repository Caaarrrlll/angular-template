import { _Dictionary } from "@controls/index";
import { InputType } from "../types/input-type.type";

export interface _ExpandableGridOptionsInterface {
	key: string;
	type: InputType;
	title?: string;
	hint?: string;
	typeValues?: _Dictionary<any>;
    maxLength?: number;
}
