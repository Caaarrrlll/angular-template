/**
 * Environment flags — each has one job:
 * - `environmentName`: diagnostics. Anything other than "production" (e.g. a forked app's "staging")
 *   keeps logging (LoggerService) and verbose error handling (ErrorHandlingService) on.
 * - `showComponentSandbox`: shows the dev-only component sandbox (`/sandbox` routes in app.routes.ts and the nav link).
 */
export const environment = {
	environmentName: "development",
	showComponentSandbox: true,
};
