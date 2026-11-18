import { ChangeDetectionStrategy, Component, DestroyRef, WritableSignal, effect, inject, input, linkedSignal, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { Subscription, interval } from "rxjs";

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

	private timer: Subscription | null = null;

	private readonly destroyRef: DestroyRef = inject(DestroyRef);

	constructor() {
		effect(() => {
			const timeLeft: number | undefined = this.timeLeft();
			if (timeLeft && timeLeft > 0 && this.timer === null) {
				this.startTimer();
			}
		});
	}

	/**
	 * Starts again from the current `timeLeft`. Needed because a template binding never re-sends an unchanged value,
	 * so setting the same `timeLeft` again after the count reached zero did not restart it.
	 */
	public restart(): void {
		const timeLeft: number | undefined = this.timeLeft();
		if (!timeLeft || timeLeft <= 0) {
			return;
		}
		this.seconds.set(Math.floor(timeLeft));
		this.startTimer();
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
			const day: string = days > 1 ? `${String(days)} days` : days > 0 ? `${String(days)} day` : "";
			const hour: string = hours > 1 ? `${String(hours)} hours` : hours > 0 ? `${String(hours)} hour` : "";
			const minute: string = minutes > 1 ? `${String(minutes)} minutes` : minutes > 0 ? `${String(minutes)} minute` : "";
			const second = `${String(seconds)} seconds left`;

			return day !== "" ? `${day}, ${hour}` : hour !== "" ? `${hour}, ${minute}` : minute !== "" ? `${minute}, ${second}` : second;
		}

		return ("0" + String(days)).slice(-2) + ":" + ("0" + String(hours)).slice(-2) + ":" + ("0" + String(minutes)).slice(-2) + ":" + ("0" + String(seconds)).slice(-2);
	}

	private startTimer(): void {
		this.clearTimer();
		this.timer = interval(1000)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((): void => {
				this.tick();
			});
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
		this.timer?.unsubscribe();
		this.timer = null;
	}
}
