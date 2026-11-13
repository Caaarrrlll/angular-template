import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-count-down",
	templateUrl: "./count-down.component.html",
	styleUrls: ["./count-down.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountDownComponent {
	@Input() public textFormat: boolean = false;
	@Output() public timeRemaining: EventEmitter<number> = new EventEmitter<number>();

	@Input() public set timeLeft(value: number) {
		if (!value || value <= 0) {
			return;
		}
		this.seconds = Math.floor(value);
		if (this.timer === null) {
			this.timer = setInterval((): void => this.tick(), 1000);
		}
	}

	public seconds: number | null = null;

	private timer: ReturnType<typeof setInterval> | null = null;

	private readonly destroyRef: DestroyRef = inject(DestroyRef);

	constructor() {
		this.destroyRef.onDestroy((): void => this.clearTimer());
	}

	/** Formats the remaining seconds, either as text or as `DD:HH:MM:SS`. */
	public getTimeRemaining(secondsInput: number | null): string {
		if (secondsInput === null || secondsInput <= 0) {
			return "";
		}
		const seconds: number = Math.floor(secondsInput % 60);
		const minutes: number = Math.floor((secondsInput / 60) % 60);
		const hours: number = Math.floor((secondsInput / (60 * 60)) % 24);
		const days: number = Math.floor(secondsInput / (60 * 60 * 24));

		if (this.textFormat) {
			const day: string = days > 1 ? `${days} days` : days > 0 ? `${days} day` : "";
			const hour: string = hours > 1 ? `${hours} hours` : hours > 0 ? `${hours} hour` : "";
			const minute: string = minutes > 1 ? `${minutes} minutes` : minutes > 0 ? `${minutes} minute` : "";
			const second: string = `${seconds} seconds left`;

			return `${day !== "" ? `${day}, ${hour}` : hour !== "" ? `${hour}, ${minute}` : minute !== "" ? `${minute}, ${second}` : second}`;
		}

		return ("0" + days).slice(-2) + ":" + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
	}

	private tick(): void {
		if (this.seconds === null) {
			this.clearTimer();
			return;
		}
		this.seconds--;
		this.timeRemaining.emit(this.seconds);
		if (this.seconds <= 0) {
			this.clearTimer();
		}
	}

	private clearTimer(): void {
		if (this.timer !== null) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}
