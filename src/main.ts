import { DEFAULT_CURRENCY_CODE, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection(),
		provideRouter(routes),
		// The app's one currency setting: CurrencyPipe and every currency control/directive/pipe default to it.
		// Change it here for a client in another currency (ISO 4217 code); a single control can still override it.
		{ provide: DEFAULT_CURRENCY_CODE, useValue: "ZAR" },
		// Locale: Angular's default LOCALE_ID ("en-US") drives date/number/currency formatting and DateTimeOpsService.
		// For another locale, call registerLocaleData(...) from "@angular/common/locales/<id>" and provide LOCALE_ID here.
	],
}).catch((err: unknown) => {
	console.error(err);
});
