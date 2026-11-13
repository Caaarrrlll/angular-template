import { Service } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, of } from "rxjs";

@Service()
export class CustomPreloadingStrategyService implements PreloadingStrategy {
	preload(route: Route, fn: () => Observable<unknown>): Observable<unknown> {
		if (route.data && route.data["preload"]) {
			return fn();
		}
		return of(null);
	}
}
