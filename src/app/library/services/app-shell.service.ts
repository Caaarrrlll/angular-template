import { Service } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type MenuBehaviour = "over" | "side";

@Service()
export class AppShellService {
	private readonly _menuBehaviour = new BehaviorSubject<MenuBehaviour>("over");

	readonly menuBehaviour$ = this._menuBehaviour.asObservable();

	switchMenuBehaviour(): void {
		this._menuBehaviour.next(this._menuBehaviour.value === "over" ? "side" : "over");
	}

	getMenuBehaviour(): MenuBehaviour {
		return this._menuBehaviour.value;
	}
}
