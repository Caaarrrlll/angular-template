export interface _QueryBuilderRuleSet {
	ruleSetLogic: string | "AND" | "OR";
	content: _QueryBuilderContent[];
}

export interface _QueryBuilderContent {
	rule?: _QueryBuilderRule;
	ruleSet: _QueryBuilderRuleSet;
	parentRuleSet?: _QueryBuilderRuleSet;
	type: "rule" | "ruleSet";
}

export interface _QueryBuilderRule {
	token: _QueryBuilderExpressionToken;
	operator: string;
	value?: string;
}

export interface _QueryBuilderExpressionToken {
	name: string;
	type: _QueryBuilderExpressionTokenType;
}

export interface _QueryBuilderExpressionTokenType {
	type: "number" | "string" | "boolean" | "enum" | "date" | "array" | "tuple";
	value: string[];
}
