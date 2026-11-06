import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CommsApiService } from "@apis/comms/comms-api.service";
import { _DetailedTicketMediaItem } from "@apis/we-support/models/detailed-ticket-media-item.model";
import { _DetailedTicketMessage } from "@apis/we-support/models/detailed-ticket-message.model";
import { _DetailedWRComment } from "@apis/we-support/models/detailed-wr-comment.model";
import { NotificationPopupComponent } from "@controls/notification-popup/notification-popup.component";
import { environment } from "@environments/environment";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { _CountryCode } from "@models/country-code.enum";
import { User } from "@models/user";
import { NotificationService as KendoNotificationService, NotificationRef } from "@progress/kendo-angular-notification";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { catchError, take } from "rxjs/operators";

const httpOptions = {
	headers: new HttpHeaders({
		"Content-Type": "application/json",
	}),
};

@Injectable()
export class NotificationService {
	private readonly actionRoutes = ["BUY_LEAD_CODE", "STOCK_NUMBER", "LEAD_NUMBER", "BuyLeadCode", "Message", "Ticket", "ConcernId", "Broadcast", "Comment", "leadId"];
	private _messageList: BehaviorSubject<any[]> = new BehaviorSubject([]);
	public connectedToHub = false;
	readonly events = ["general", "group_specific", "BLMS_NotificationCreated", "user_specific", "concern_reminder", "bad_buy_request", "process_escalation", "SLMS_lead_assigned"];
	readonly weSupportEvents = [
		"receiveMessage",
		"messageDelivered",
		"messageRead",
		"bulkMessageDelivered",
		"bulkMessageRead",
		"newTicketCreated",
		"assignedNewTicket",
		"broadcastMessage",
		"NewComment",
		"newRequestCreated",
	];
	public hubConnection: HubConnection;
	//Chat Service variables below
	public baseUrl: string = `${environment.weSupportApi}/conversation/`;
	public unreadTickets?: { ticketId: string }[];
	onMessageReceivedSubject$ = new Subject<_DetailedTicketMessage>();
	onMessageDeliveredSubject$ = new Subject<_DetailedTicketMessage>();
	onMessageReadSubject$ = new Subject<_DetailedTicketMessage>();
	onNewTicketCreatedSubject$ = new Subject();
	onAssignedNewTicketSubject$ = new Subject();
	onBulkMessageDeliveredSubject$ = new Subject();
	onBulkMessageReadSubject$ = new Subject();
	onUnreadAddedSubject$ = new Subject();
	onUnreadRemovedSubject$ = new Subject();
	public onNewWRComment$ = new Subject();
	public onNewRequestCreated$ = new Subject();
	currentUser = JSON.parse(localStorage.getItem("currentUser"));
	hasWeSupportClaim: boolean = false;
	public readonly messageList: Observable<any[]> = this._messageList.asObservable();

	constructor(
		private _notificationService: KendoNotificationService,
		private http: HttpClient,
		private _router: Router,
		private _http: HttpClient,
		private _commsApi: CommsApiService
	) {}

	private registerListeners() {
		this.hubConnection.onclose(async () => {
			console.log("Disconnected from SignalR Hub");
			this.connectedToHub = false;
			// this.connectToHub();
		});

		this.hubConnection.onreconnected(async () => {
			console.log("Reconnected to SignalR Hub");
			this.joinGroups();
			this.connectedToHub = true;
		});

		this.events.forEach((e) => {
			this.hubConnection.on(e, (data) => {
				this._messageList.next([...this._messageList.getValue(), data]);
				this.showNotification(data);
			});
		});

		this.weSupportEvents?.map((e) => {
			this.hubConnection.on(
				e,
				(data: {
					attributes: {
						key: string;
						value: string;
					};
					originSystem: string;
					message: string;
					type: string;
					eventName: string;
					audienceType: string;
					audienceIdentifier: string;
				}) => {
					this.handleEvent(e, data);
				}
			);
		});
	}

	private handleEvent(type, data) {
		let convertedData: any = data;
		if (type != "unreadTickets") {
			convertedData = JSON.parse(data.attributes[0].value);
		}
		var message = undefined;
		switch (type) {
			case "receiveMessage": {
				message = this.convertJsonData(convertedData);
				this.onMessageReceivedSubject$.next(message);
				if (message.author.toLowerCase() != this.currentUser.username.toLowerCase()) {
					this.updateMessageStatus(message.id, "Delivered");
					this.addUnreadTicket(message.ticketId);
					if (this.hasWeSupportClaim) {
						if (this._router.url != `/we-support/tickets/${message.ticketId}`) {
							this.showNotification(data);
							this.addMessage(data);
						}
					} else {
						this.showNotification(data);
						this.addMessage(data);
					}
				}
				break;
			}
			case "broadcastMessage": {
				this.showNotification(data);
				this.addMessage(data);
				break;
			}
			case "messageDelivered": {
				message = this.convertJsonData(convertedData);
				this.onMessageDeliveredSubject$.next(message);
				break;
			}
			case "messageRead": {
				message = this.convertJsonData(convertedData);
				this.onMessageReadSubject$.next(message);
				break;
			}
			case "bulkMessageDelivered": {
				this.onBulkMessageDeliveredSubject$.next({ intendedFor: convertedData.IntendedFor, type: convertedData.Type });
				break;
			}
			case "bulkMessageRead": {
				this.onBulkMessageReadSubject$.next({ intendedFor: convertedData.IntendedFor, type: convertedData.Type });
				break;
			}
			case "newTicketCreated": {
				this.joinGroups();
				break;
			}
			case "assignedNewTicket": {
				this.joinGroups();
				let ticket = this.convertJsonTicketData(convertedData);
				if (ticket.supportEmail.toLowerCase() == this.currentUser.username.toLowerCase()) {
					this.showNotification(data);
					this.addMessage(data);
					this.onAssignedNewTicketSubject$.next({
						ticket: ticket,
						isReassign: data.attributes[1].value == "true",
					});
				}
				break;
			}
			case "unreadTickets": {
				this.unreadTickets = convertedData;
				break;
			}
			case "NewComment": {
				let comment = this.convertJsonComment(convertedData);
				if (comment.authorEmail.toLowerCase() != this.currentUser.username.toLowerCase()) {
					this.onNewWRComment$.next(comment);
					if (this._router.url != `/we-support/requests/${comment.requestId}`) {
						this.showNotification(data);
						this.addMessage(data);
					}
				}
				break;
			}
			case "newRequestCreated": {
				this.onNewRequestCreated$.next(null);
				break;
			}
			default:
				break;
		}
	}

	private convertJsonData(data) {
		return {
			id: data.Id,
			ticketId: data.TicketId,
			messageRef: data.MessageRef,
			author: data.Author,
			body: data.Body,
			media: this.convertMediaToJson(data.Media),
			status: data.Status,
			createdOn: data.CreatedOn,
			read: data.Read,
			readByEveryone: data.ReadByEveryone,
			delivered: data.Delivered,
			deliveredToEveryone: data.DeliveredToEveryone,
		};
	}

	private convertJsonTicketData(data) {
		return {
			category: data.Category,
			categoryId: data.CategoryId,
			closedOn: data.ClosedOn,
			comments: data.Comments,
			createdOn: data.CreatedOn,
			description: data.Description,
			id: data.Id,
			isPaused: data.IsPaused,
			media: data.Media,
			overdue: data.Overdue,
			priority: data.Priority,
			status: data.Status,
			supportEmail: data.SupportEmail,
			supportName: data.SupportName,
			ticketNo: data.TicketCount,
			ticketType: data.TicketType,
			timerDuration: data.TimerDuration,
			title: data.Title,
			userEmail: data.UserEmail,
			userName: data.UserName,
		};
	}

	private convertJsonComment(data): _DetailedWRComment {
		return {
			author: data.Author,
			authorEmail: data.AuthorEmail,
			comment: data.Comment,
			createdOn: data.CreatedOn,
			id: data.Id,
			requestId: data.RequestId,
			media: this.convertMediaToJson(data.Media),
		};
	}

	private convertMediaToJson(data) {
		return data?.map((element) => {
			return {
				id: element.Id,
				blobUrl: element.BlobUrl,
				contentType: element.ContentType,
				fileExtension: element.FileExtension,
				fileName: element.FileName,
			};
		});
	}

	private toBase64(value: string): string {
		const bytes = new TextEncoder().encode(value);
		return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
	}

	startHubConnection(userObject: User, hasWeSupportClaim: boolean) {
		if (environment.countryCode != _CountryCode.ZA) {
			return;
		}
		this.hasWeSupportClaim = hasWeSupportClaim;
		if (!this.hubConnection?.state || this.hubConnection?.state == HubConnectionState.Disconnected) {
			const access_token = this.toBase64(userObject.username);
			const secret = this.toBase64(environment.signalRHubSecret);
			this.hubConnection = new HubConnectionBuilder()
				.withUrl(`${environment.signalRHubApi}?user=${access_token}&secret=${secret}`) //, { accessTokenFactory: () => this._user.currentUserValue?.token }
				.withAutomaticReconnect()
				.build();
			this.hubConnection
				.start()
				.then(() => {
					this.connectedToHub = true;
					this.registerListeners();
					console.log("Connected to SignalR Hub");
					this.joinGroups();
				})
				.catch(() => {
					this.connectedToHub = false;
					console.log("Error while establishing connection with SignalR Hub");
					setTimeout(() => this.startHubConnection(userObject, hasWeSupportClaim), 5000);
				});
		}
	}

	getUnreadNotifications() {
		this._commsApi
			.getUnreadNotifications()
			.pipe(
				take(1),
				catchError((err) => {
					if (err instanceof HttpErrorResponse && err.status == 404) {
						return of([]);
					}
					return of(err);
				})
			)
			.subscribe((notifications) => {
				const toRemove = notifications?.filter((item) => {
					const payload: any = item;
					const type = payload.attributes[0]?.key;
					if (type == "Message" && payload.eventName == "receiveMessage") {
						const message = this.convertJsonData(JSON.parse(payload.attributes[0].value));
						if (message.author.toLowerCase() == this.currentUser.username.toLowerCase()) {
							return true;
						}
					}
					return false;
				});
				this._commsApi.markNotificationAsRead(toRemove == null ? [] : toRemove.map((item) => item.id)).subscribe();
				const toAdd =
					notifications != null
						? notifications.filter((item) => {
								const payload: any = item;
								const type = payload.attributes[0]?.key;
								if (type == "Message" && payload.eventName == "receiveMessage") {
									const message = this.convertJsonData(JSON.parse(payload.attributes[0].value));
									if (message.author.toLowerCase() == this.currentUser.username.toLowerCase()) {
										return false;
									}
								}
								return true;
						  })
						: [];
				this._messageList.next([...this._messageList.getValue(), ...toAdd]);
			});
	}

	closeHubConnection() {
		this.connectedToHub = false;
		if (this.hubConnection) {
			this.hubConnection.stop();
		}
	}

	showNotification(message) {
		this.playAudio();
		let notificationRef: NotificationRef = this._notificationService.show({
			content: NotificationPopupComponent,
			cssClass: "message-toast " + message.type,
			position: { horizontal: "right", vertical: "top" },
			animation: { type: "slide", duration: 400 },
			type: { style: "none", icon: false },
			hideAfter: 5000,
		});

		notificationRef.content.instance.payload = message;

		notificationRef.content.instance.navigate.subscribe((res) => {
			this.navigateTo(res);
			notificationRef.hide();
		});
	}

	addMessage(message) {
		this._messageList.next([...this._messageList.getValue(), message]);
	}

	removeMessage(id) {
		this._commsApi.markNotificationAsRead([id]).subscribe();
		this._messageList.next([...this._messageList.getValue().filter((m) => m.id != id)]);
	}

	removeAllMessage(notificationIds: string[]): void {
		this._commsApi.markNotificationAsRead(notificationIds).subscribe();
		this._messageList.next([]);
	}

	navigateTo(message) {
		this.removeMessage(message.id);
		if (message.type != "action") {
			return;
		}

		let action = message.attributes.find((e) => this.actionRoutes.includes(e?.key));
		if (action) {
			switch (message.originSystem) {
				case "WeSupport":
					switch (action?.key) {
						case "Message":
							const object = JSON.parse(message.attributes[0].value);
							if (object.IsFromSupport) {
								this._router.navigate(["", { outlets: { "we-support": `support/chat/${object.TicketId}` } }]);
							} else {
								this._router.navigate([`/we-support/tickets/${object.TicketId}`]);
							}
							break;
						case "Ticket":
							const id = JSON.parse(message.attributes[0].value).Id;
							this._router.navigate([`/we-support/tickets/${id}`]);
							break;
						case "Broadcast":
							this._router.navigate(["", { outlets: { "we-support": `support/broadcasts` } }]);
							break;
						case "Comment":
							const requestId = JSON.parse(message.attributes[0].value).RequestId;
							this._router.navigate([`we-support/requests/${requestId}`]);
							break;
					}
					break;
				default:
					switch (action?.key) {
						case "BUY_LEAD_CODE":
						case "BuyLeadCode":
							this._router.navigate([`/blms/lead/${action.value}`]);
							break;
						case "STOCK_NUMBER":
							this._router.navigate([`/stock/${action.value}`]);
							break;
						case "LEAD_NUMBER":
							this._router.navigate([`/slms/lead-details?leadId=${action.value}`]);
							break;
						case "ConcernId":
							this._router.navigate(["/concerns/inbox/details"], { queryParams: { complaintId: action.value } });
							break;
						case "leadId":
							this._router.navigate(["slms/lead-details"], { queryParams: { leadId: action.value } });
							break;
					}
					break;
			}
		}
	}

	public joinGroups() {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
			}),
		};
		if (this.hubConnection != undefined) {
			this._http
				.post<{ ticketId: string }[]>(
					this.baseUrl + "AutoJoinGroups",
					{
						connectionId: this.hubConnection.connectionId,
					},
					httpOptions
				)
				.subscribe({
					next: (data) => {
						this.handleEvent("unreadTickets", data);
					},
					error: () => {
						this._http
							.post<{ ticketId: string }[]>(
								this.baseUrl + "AutoJoinGroups",
								{
									connectionId: this.hubConnection.connectionId,
								},
								httpOptions
							)
							.subscribe({
								next: (data) => {
									this.handleEvent("unreadTickets", data);
								},
							});
					},
				});
		}
	}

	sendGroupMessageAsUser(message: { ticketId: string; ticketNo: number; messageRef: string; body: string; media?: _DetailedTicketMediaItem[] }) {
		if (this.hubConnection != undefined) {
			const body = {
				...message,
				connectionId: this.hubConnection.connectionId,
			};
			return this.http.post(this.baseUrl + "SendUserGroupMessage", body, httpOptions);
		}
	}

	sendGroupMessageAsSupport(message: { ticketId: string; ticketNo: number; messageRef: string; body: string; media?: _DetailedTicketMediaItem[] }) {
		if (this.hubConnection != undefined) {
			const body = {
				...message,
				connectionId: this.hubConnection.connectionId,
			};
			return this.http.post(this.baseUrl + "SendSupportGroupMessage", body, httpOptions);
		}
	}

	public updateMessageStatus(messageId: string, type: "Delivered" | "Read") {
		if (this.hubConnection != undefined) {
			const body = { messageId: messageId, type: type };
			this.http.post(this.baseUrl + "UpdateMessageReceipt", body, httpOptions).subscribe();
		}
	}

	public addUnreadTicket(id: string) {
		if (this.unreadTickets) {
			if (this.unreadTickets.includes({ ticketId: id })) {
				return;
			}
			this.unreadTickets.push({ ticketId: id });
			this.onUnreadAddedSubject$.next(id);
		}
	}

	public removeUnreadTicket(id: string) {
		if (this.unreadTickets) {
			this.unreadTickets = this.unreadTickets.filter((ticket) => ticket.ticketId != id);
			this.onUnreadRemovedSubject$.next(id);
		}
	}

	playAudio(): void {
		const play: string = localStorage.getItem("notification_sound_play");

		if (play == null || play == "false") {
			return;
		}

		let audio = new Audio();
		audio.src = "../../../assets/audio/mixkit-bell-notification-933.wav";
		audio.load();
		audio.play();
	}
}
