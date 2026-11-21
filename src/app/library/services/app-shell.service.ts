import { Service } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type _MenuBehaviour = "over" | "side";

@Service()
export class AppShellService {
	private readonly _menuBehaviour = new BehaviorSubject<_MenuBehaviour>("over");

	readonly menuBehaviour$ = this._menuBehaviour.asObservable();

	switchMenuBehaviour(): void {
		this._menuBehaviour.next(this._menuBehaviour.value === "over" ? "side" : "over");
	}

	getMenuBehaviour(): _MenuBehaviour {
		return this._menuBehaviour.value;
	}
}
