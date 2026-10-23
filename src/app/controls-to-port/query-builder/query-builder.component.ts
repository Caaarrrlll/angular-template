import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
	_QueryBuilderContent,
	_QueryBuilderExpressionToken,
	_QueryBuilderExpressionTokenType,
	_QueryBuilderRule,
	_QueryBuilderRuleSet,
} from "@controls/query-builder/models/query-builder.interface";
import { _BuyLeadPropertyExpressionProperty } from "@modules/blms/models/buy-lead-property.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
	selector: "app-query-builder",
	templateUrl: "./query-builder.component.html",
	styleUrls: ["./query-builder.component.scss"],
})
export class QueryBuilderComponent implements OnInit, OnDestroy {
	@Input() expressionInput: _BuyLeadPropertyExpressionProperty[] = [];
	@Input() expressionStringControl: FormControl;
	@Input() disabled: boolean = false;

	@Output() expressionChange: EventEmitter<string> = new EventEmitter();
	@Output() expressionValidityChange: EventEmitter<boolean> = new EventEmitter();

	private destroy$: Subject<void> = new Subject();
	private conditions: any = ["AND", "OR"];
	private types = ["number", "string", "boolean", "enum", "date", "array", "tuple"];
	private dataTypes: _QueryBuilderExpressionTokenType[] = [
		{ type: "number", value: ["=", "!=", ">", ">=", "<", "<="] },
		{ type: "string", value: ["=", "!=", "contains", "like"] },
		{ type: "boolean", value: ["="] },
		{ type: "date", value: ["=", "!=", ">", ">=", "<", "<="] },
	];

	expressionString: string = "";
	expressionTokens: _QueryBuilderExpressionToken[] = [];
	query: _QueryBuilderRuleSet = {
		ruleSetLogic: "AND",
		content: [],
	};

	constructor() {}

	ngOnInit(): void {
		this.expressionStringControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
			next: (expression) => {
				this.convertStringToExpression(expression);
			},
		});

		this.expressionTokens = this.expressionInput.map((expression: _BuyLeadPropertyExpressionProperty) => {
			return {
				name: expression.name,
				type: this.dataTypes[this.types.indexOf(expression.type)],
			};
		});

		this.convertStringToExpression(this.expressionStringControl.value);
	}

	ruleSetLogicChange(ruleSet: _QueryBuilderRuleSet, logic: "AND" | "OR"): void {
		if (this.disabled) return;
		ruleSet.ruleSetLogic = logic;
		this.emitChanges();
	}

	addRule(ruleSet: _QueryBuilderRuleSet): void {
		ruleSet.content.push({
			rule: {
				token: this.expressionTokens[this.types.indexOf("number")],
				operator: this.expressionTokens[this.types.indexOf("number")].type.value[0],
				value: undefined,
			},
			ruleSet: ruleSet,
			type: "rule",
		});

		this.emitChanges();
	}

	removeRule(rule: _QueryBuilderContent, content: _QueryBuilderContent[]): void {
		const ruleIndex = content.indexOf(rule);
		content.splice(ruleIndex, 1);

		this.emitChanges();
	}

	addRuleSet(ruleSet: _QueryBuilderRuleSet): void {
		ruleSet.content.push({
			ruleSet: {
				ruleSetLogic: "AND",
				content: [],
			},
			parentRuleSet: ruleSet,
			type: "ruleSet",
		});
	}

	removeRuleSet(ruleSet: _QueryBuilderRuleSet, parentRuleSet: _QueryBuilderRuleSet): void {
		if (parentRuleSet == undefined) return;

		const index = parentRuleSet.content.findIndex((x) => {
			return x.ruleSet === ruleSet;
		});

		if (index >= 0) {
			parentRuleSet.content.splice(index, 1);
			this.emitChanges();
		} else {
			this.expressionValidityChange.emit(false);
		}
	}

	selectedTokenChange(ruleSet: _QueryBuilderRuleSet, rule: _QueryBuilderRule, token: _QueryBuilderExpressionToken): void {
		this.updateQueryContent(this.query, ruleSet, rule, token, "token");
		this.emitChanges();
	}

	selectedOperatorChange(ruleSet: _QueryBuilderRuleSet, rule: _QueryBuilderRule, operator: string): void {
		this.updateQueryContent(this.query, ruleSet, rule, operator, "operator");
		this.emitChanges();
	}

	selectedValueChange(ruleSet: _QueryBuilderRuleSet, rule: _QueryBuilderRule, val: string): void {
		this.updateQueryContent(this.query, ruleSet, rule, val, "value");
		this.emitChanges();
	}

	updateQueryContent(
		mainRuleSet: _QueryBuilderRuleSet,
		targetRuleSet: _QueryBuilderRuleSet,
		targetRule: _QueryBuilderRule,
		newVal: any, // has to be of type any as _QueryBuilderExpressionToken | string causes problems
		type: "token" | "operator" | "value"
	): void {
		const updateContent = (expressions: _QueryBuilderContent[]): void => {
			expressions.map((expression: _QueryBuilderContent) => {
				if (expression.type === "rule" && expression.rule === targetRule) {
					switch (type) {
						case "token":
							expression.rule.token = newVal;
							break;
						case "operator":
							expression.rule.operator = newVal;
							break;
						case "value":
							expression.rule.value = newVal;
							break;
					}
					return;
				} else if (expression.type === "ruleSet") {
					if (expression.ruleSet === targetRuleSet) {
						expression.ruleSet.content = expression.ruleSet.content.map((ruleOrSet) => {
							if (ruleOrSet.type === "rule" && ruleOrSet.rule === targetRule) {
								switch (type) {
									case "token":
										ruleOrSet.rule.token = newVal;
										break;
									case "operator":
										ruleOrSet.rule.operator = newVal;
										break;
									case "value":
										ruleOrSet.rule.value = newVal;
										break;
								}
							}
							return ruleOrSet;
						});
						return;
					}
					updateContent(expression.ruleSet.content);
				}
			});
		};

		updateContent(mainRuleSet.content);
	}

	emitChanges(): void {
		try {
			const expressionString = this.queryToString(this.query);
			this.expressionChange.emit(expressionString);
			this.expressionValidityChange.emit(true);
		} catch (e) {
			this.expressionValidityChange.emit(false);
		}
	}

	private convertStringToExpression(query: string): void {
		try {
			const obj = this.parseConditionString(query);
			this.expressionString = query;
			this.query = obj;
			this.expressionValidityChange.emit(true);
		} catch (e) {
			this.expressionValidityChange.emit(false);
		}
	}

	private queryToString(query?: _QueryBuilderRuleSet): string {
		if (!query || query.content.length === 0) return "";

		const buildContentString = (content: _QueryBuilderContent[]): string => {
			return content
				.map((item) => {
					switch (item.type) {
						case "rule":
							return `${item.rule?.token.name} ${item.rule?.operator} ${item.rule?.value} ${item.ruleSet?.ruleSetLogic}`;
						case "ruleSet": {
							let ruleSetString = `(${this.queryToString(item.ruleSet)})`;
							return `${ruleSetString} ${item.parentRuleSet ? item.parentRuleSet?.ruleSetLogic : item.ruleSet?.ruleSetLogic}`;
						}
						default:
							return "";
					}
				})
				.join(" ");
		};

		return buildContentString(query.content).replace(new RegExp(" AND$"), "").replace(new RegExp(" OR$"), "");
	}

	private parseConditionString(expression: string): _QueryBuilderRuleSet {
		const ruleSet: _QueryBuilderRuleSet = {
			ruleSetLogic: "AND",
			content: [],
		};

		const expressionElements = expression.split(new RegExp(/( AND )|( OR )/g));

		let field: string = null;
		let operator: string = null;
		let value: string = null;

		let isRuleSet = false;
		let subRuleSet: _QueryBuilderRuleSet;
		let validIndex = 0;

		expressionElements.map((exp, index) => {
			if (exp !== undefined && exp !== "" && index >= validIndex) {
				const trimmedExpression = exp.trim();

				if (exp.startsWith("(")) {
					isRuleSet = true;
					if (exp[0] === "(" && exp[1] === "(") {
						const lastBracketIndex = expressionElements.findIndex((x, j) => {
							if (x !== undefined && j >= index) {
								return x[x.length - 1] === ")" && x[x.length - 2] === ")";
							}
							return false;
						});

						const subExpression = expressionElements
							.slice(index, lastBracketIndex + 1)
							.join("")
							.replace("((", "(")
							.replace("))", ")")
							.replace("   ", " ")
							.replace("  ", " ");

						// Should return a ruleSet object with multiple ruleSets in it
						subRuleSet = this.parseConditionString(subExpression);

						validIndex = lastBracketIndex + 1;
					} else {
						const lastBracketIndex = expressionElements.findIndex((char, bracketIndex) => {
							if (char !== undefined && bracketIndex >= index) {
								return char[char.length - 1] === ")";
							}
							return false;
						});

						const subExpression = expressionElements
							.slice(index, lastBracketIndex + 1)
							.join(" ")
							.replace("(", "")
							.replace(")", "")
							.replace("   ", " ")
							.replace("  ", " ");

						// Should return a ruleSet object with multiple ruleSets in it
						subRuleSet = this.parseConditionString(subExpression);

						validIndex = lastBracketIndex + 1;
					}
				} else if (this.conditions.includes(trimmedExpression)) {
					ruleSet.ruleSetLogic = trimmedExpression;
				} else if (!this.conditions.includes(trimmedExpression)) {
					let expressionArray = trimmedExpression.split(" ");
					field = expressionArray[0];
					operator = expressionArray[1];
					expressionArray.splice(0, 2);
					const expressionValue = expressionArray.join(" ");
					const formattedValue = expressionValue.replace("'", "");
					value = value ? `${value} ${formattedValue}` : formattedValue;
				}

				if (field !== null && operator !== null && value !== null && !isRuleSet) {
					const index = this.expressionTokens.findIndex((x: _QueryBuilderExpressionToken) => x.name === field);
					if (index === -1 || this.expressionTokens[index] === undefined || this.expressionTokens[index].type.value.indexOf(operator) === -1) {
						throw new Error("invalid expression");
					}
					ruleSet.content.push({
						rule: {
							token: this.expressionTokens[index],
							operator: operator,
							value: value,
						},
						ruleSet: ruleSet,
						type: "rule",
					});

					field = null;
					operator = null;
					value = null;
				} else if (isRuleSet) {
					ruleSet.content.push({
						ruleSet: subRuleSet,
						parentRuleSet: ruleSet,
						type: "ruleSet",
					});
					isRuleSet = false;
					subRuleSet = null;
				}
			}
		});
		return ruleSet;
	}

	ngOnDestroy(): void {
		this.destroy$.next(null);
		this.destroy$.complete();
	}
}
