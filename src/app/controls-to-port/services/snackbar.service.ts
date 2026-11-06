import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { NotificationRef, NotificationService } from "@progress/kendo-angular-notification";
import { LoginService } from "@services/login.service";

@Injectable({
	providedIn: "root",
})
export class SnackbarService {
	private previousMessage = null;
	private messages: NotificationRef[] = [];
	private id = 0;
	private closeAllThreshold = 3;
	private closeAllVisible = false;

	private renderer: Renderer2;
	private button: any;
	private buttonText: any;
	private notifGroup: any;
	private firstChild: any;
	errorList: string[];

	private isDev: boolean = false;

	constructor(private notificationService: NotificationService, public rendererFactory: RendererFactory2, private _loginService: LoginService) {
		this.renderer = rendererFactory.createRenderer(null, null);
		this.errorList = new Array(this.getUTCDate() + ": " + "start");

		this.isDev = this._loginService.userHasClaim("dev_show_error");
	}

	getUTCDate() {
		let date = new Date();
		let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

		return new Date(now_utc);
	}

	async open(message: string = "", state: "info" | "success" | "warning" | "error" = "error", duration: number = 5555) {
		if (state == "error" && !this.isDev) {
			this.errorList.push(this.getUTCDate() + ": " + message);
		} else if (this.previousMessage !== message) {
			const notif = this.notificationService.show({
				content: message,
				cssClass: "kendo-notification-" + state,
				animation: { type: "slide", duration: 400 },
				position: { horizontal: "center", vertical: "bottom" },
				type: { style: state, icon: true },
				closable: true,
			});

			notif["id"] = this.id;
			this.messages.push(notif);
			this.id = this.id + 1;
			this.checkIfCloseAllIsNeeded();

			this.previousMessage = message;

			notif.notification.onDestroy((e) => {
				this.previousMessage = null;
				this.removeMessageFromArray(notif);
				this.checkIfCloseAllIsNeeded();
			});

			await this.delay(duration);
			this.close(notif);
		}
	}

	private checkIfCloseAllIsNeeded() {
		if (!this.closeAllVisible) {
			if (this.messages.length > this.closeAllThreshold) {
				this.addCloseAllElement();
				this.closeAllVisible = true;
			}
		} else {
			if (this.messages.length < this.closeAllThreshold) {
				this.deleteCloseAllElement();
				this.closeAllVisible = false;
			}
		}
	}

	private addCloseAllElement() {
		this.button = this.renderer.createElement("button");
		this.buttonText = this.renderer.createText("Close All");
		this.notifGroup = document.querySelector("div.k-notification-group");
		this.firstChild = this.notifGroup.firstChild;

		this.renderer.addClass(this.button, "closeAllNotifsButton");
		this.renderer.appendChild(this.button, this.buttonText);
		this.renderer.insertBefore(this.notifGroup, this.button, this.firstChild);

		this.renderer.listen(this.button, "click", () => {
			this.closeAll();
			this.renderer.removeChild(this.notifGroup, this.button);
		});
	}

	private deleteCloseAllElement() {
		this.renderer.removeChild(this.notifGroup, this.button);
	}

	private removeMessageFromArray(notif: NotificationRef) {
		const index = this.messages.findIndex((e) => e["id"] === notif["id"]);
		this.messages.splice(index, 1);
	}

	private closeAll() {
		this.messages.forEach((e) => {
			e.hide();
		});
		this.messages = [];
	}

	private close(notif: NotificationRef) {
		notif.hide();
	}

	private delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	errorListGet() {
		return this.errorList;
	}
	errorListCntGet() {
		return this.errorList.length;
	}
}
