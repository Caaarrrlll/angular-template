// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
	{
		files: ["**/*.ts"],
		extends: [
			eslint.configs.recommended,
			tseslint.configs.strictTypeChecked,
			tseslint.configs.stylisticTypeChecked,
			angular.configs.tsRecommended,
			eslintPluginPrettierRecommended,
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
		},
		processor: angular.processInlineTemplates,
		rules: {
			// AGENTS.md coding standards that can be enforced mechanically (keep the two files in sync).
			"no-console": "error",
			"no-restricted-globals": ["error", { name: "setTimeout", message: "AGENTS.md: use effect(), computed() or afterNextRender instead of setTimeout." }],
			"no-restricted-syntax": [
				"error",
				{
					selector: "CallExpression[callee.property.name='detectChanges']",
					message: "AGENTS.md: do not call detectChanges(); use signals, effect(), computed() or afterNextRender.",
				},
				{
					selector: "CallExpression[callee.property.name='then'][callee.object.callee.object.name='Promise'][callee.object.callee.property.name='resolve']",
					message: "AGENTS.md: do not defer work with Promise.resolve().then(...); use effect(), computed() or afterNextRender.",
				},
				{
					selector: "Decorator[expression.callee.name='Injectable'] Property[key.name='providedIn']",
					message: "AGENTS.md: root services use @Service() from @angular/core instead of @Injectable({ providedIn }).",
				},
			],
			// New in typescript-eslint 8.7x strict preset. Off: Angular Material's documented API passes config classes
			// (MatDialogConfig, MatSnackBarConfig, …) as object literals; every hit in this codebase was that idiom or a data-only cast.
			"@typescript-eslint/no-unsafe-class-instance-assignment": "off",
			// Angular components/directives are decorated classes and may legitimately have no members (e.g. a root shell).
			"@typescript-eslint/no-extraneous-class": ["error", { allowWithDecorator: true }],
			"@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true }],
			"@angular-eslint/directive-selector": [
				"error",
				{
					type: "attribute",
					prefix: "app",
					style: "camelCase",
				},
			],
			"@angular-eslint/component-selector": [
				"error",
				{
					type: "element",
					prefix: "app",
					style: "kebab-case",
				},
			],
		},
	},
	{
		// The logger is the one sanctioned console wrapper; main.ts reports bootstrap failures before DI (and the logger) exists.
		files: ["src/app/library/services/logger.service.ts", "src/main.ts"],
		rules: {
			"no-console": "off",
		},
	},
	{
		files: ["**/*.html"],
		extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility, eslintPluginPrettierRecommended],
		rules: {
			"prettier/prettier": ["error", { parser: "angular" }],
			"@angular-eslint/template/prefer-control-flow": "error",
			// `x == null` / `x != null` is the idiomatic null-or-undefined check; every other loose comparison is still an error.
			"@angular-eslint/template/eqeqeq": ["error", { allowNullOrUndefined: true }],
		},
	},
]);
