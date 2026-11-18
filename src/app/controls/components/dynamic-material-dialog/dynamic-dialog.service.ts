import { Service } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Service()
export class DynamicDialogService {
	inputChange = new BehaviorSubject<string>("");
	responseNotification = new BehaviorSubject<string>("");
	response: string[] = [];
	selectedItem = "";

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

	/** Resets the shared autocomplete state. The service is app-wide, so the subjects stay open (AUD-10: they used to be unsubscribed, breaking every later dialog). */
	public clear(): void {
		this.response = [];
		this.selectedItem = "";
		this.inputChange.next("");
		this.responseNotification.next("");
	}
}
