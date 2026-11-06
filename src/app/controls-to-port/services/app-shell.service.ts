import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class AppShellService {
	private readonly _menuBehaviour = new BehaviorSubject<any>("over");

	readonly menuBehaviour$ = this._menuBehaviour.asObservable();

	switchMenuBehaviour() {
		if (this._menuBehaviour.value == "over") {
			this._menuBehaviour.next("side");
		} else {
			this._menuBehaviour.next("over");
		}
	}

	getMenuBehaviour() {
		return this._menuBehaviour.value;
	}
}
