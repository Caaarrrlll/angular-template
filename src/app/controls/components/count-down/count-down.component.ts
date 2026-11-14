import { ChangeDetectionStrategy, Component, DestroyRef, WritableSignal, effect, inject, input, linkedSignal, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-count-down",
	templateUrl: "./count-down.component.html",
	styleUrls: ["./count-down.component.scss"],
	imports: [MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountDownComponent {
	public readonly textFormat = input<boolean>(false);
	public readonly timeLeft = input<number>();
	public readonly timeRemaining = output<number>();

	public readonly seconds: WritableSignal<number | null> = linkedSignal<number | undefined, number | null>({
		source: this.timeLeft,
		computation: (source, previous): number | null => {
			if (!source || source <= 0) {
				// mirrors the old setter guard: ignore non-positive values, keep the previous count
				return previous?.value ?? null;
			}
			return Math.floor(source);
		},
	});

	private timer: ReturnType<typeof setInterval> | null = null;

	private readonly destroyRef: DestroyRef = inject(DestroyRef);

	constructor() {
		this.destroyRef.onDestroy((): void => this.clearTimer());

		effect(() => {
			const timeLeft: number | undefined = this.timeLeft();
			if (timeLeft && timeLeft > 0 && this.timer === null) {
				this.timer = setInterval((): void => this.tick(), 1000);
			}
		});
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

		if (this.textFormat()) {
			const day: string = days > 1 ? `${days} days` : days > 0 ? `${days} day` : "";
			const hour: string = hours > 1 ? `${hours} hours` : hours > 0 ? `${hours} hour` : "";
			const minute: string = minutes > 1 ? `${minutes} minutes` : minutes > 0 ? `${minutes} minute` : "";
			const second = `${seconds} seconds left`;

			return `${day !== "" ? `${day}, ${hour}` : hour !== "" ? `${hour}, ${minute}` : minute !== "" ? `${minute}, ${second}` : second}`;
		}

		return ("0" + days).slice(-2) + ":" + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
	}

	private tick(): void {
		const current: number | null = this.seconds();
		if (current === null) {
			this.clearTimer();
			return;
		}
		const next: number = current - 1;
		this.seconds.set(next);
		this.timeRemaining.emit(next);
		if (next <= 0) {
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
