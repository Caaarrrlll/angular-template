import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class DynamicDialogService {
	inputChange = new BehaviorSubject<string>("");
	responseNotification = new BehaviorSubject<string>("");
	response: string[] = [];
	selectedItem: string = "";

	constructor() {}

	public setDialogInputSearch(input: string): void {
		this.inputChange.next(input);
	}

	public setResponse(value: string): void {
		this.response.push(value);
	}

	public clearResponse(): void {
		this.response = [];
	}

	public getResponse(): string[] {
		return this.response;
	}

	public setResponseNotification(value: string): void {
		this.responseNotification.next(value);
	}

	public setSelected(value: string): void {
		this.selectedItem = value;
	}

	public getSelected(): string {
		return this.selectedItem;
	}

	public clear(): void {
		this.response = [];
		this.selectedItem = "";
		this.inputChange.unsubscribe();
		this.responseNotification.unsubscribe();
	}
}
