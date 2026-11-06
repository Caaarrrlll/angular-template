import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IntlService, CldrIntlService, setData } from "@progress/kendo-angular-intl";

@Injectable()
export class LocaleService {
	private url = "https://unpkg.com/@progress/kendo-angular-intl/locales/json/{0}/all.json";
	private loaded: any = {};

	constructor(private http: HttpClient, private intl: IntlService, @Inject(LOCALE_ID) public localeId: string) {
		this.loaded[localeId] = true;
	}

	public set(localeId: string): void {
		if (this.loaded[localeId]) {
			this.setLocale(localeId);

			return;
		}

		this.http.get(this.intl.format(this.url, localeId)).subscribe((result) => {
			// set the recieved locale data
			setData(result);

			this.loaded[localeId] = true;

			// set the local as current
			this.setLocale(localeId);
		});
	}

	private setLocale(localeId: string): void {
		(this.intl as CldrIntlService).localeId = localeId;
		this.localeId = localeId;
	}
}
