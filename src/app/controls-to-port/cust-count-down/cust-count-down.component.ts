import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
	selector: "cust-countdown",
	templateUrl: "./cust-count-down.component.html",
	styleUrls: ["./cust-count-down.component.scss"],
})
export class CustCountdownComponent implements OnChanges {
	@Input() timeLeft: number;
	@Input() textFormat: boolean = false;
	@Output() timeRemaining = new EventEmitter<number>();

	seconds = null;
	private timer = null;

	// eslint-disable-next-line
	ngOnChanges(changes: SimpleChanges) {
		if (this.seconds === null && changes.timeLeft.currentValue > 0) {
			this.startTimer();
		}

		if (this.seconds !== null) {
			this.stopTimer();
		}
	}

	startTimer() {
		this.seconds = this.timeLeft;
		this.timer = setInterval(() => {
			if (this.seconds > 0) {
				this.seconds--;
				this.timeLeft--;
				this.timeRemaining.emit(this.timeLeft);
			} else {
				this.stopTimer();
			}
		}, 1000);
	}

	stopTimer() {
		if (this.timer) {
			clearInterval(this.timer);
			this.seconds = null;

			if (this.timeLeft > 0) {
				this.startTimer();
			}
		}
	}

	getTimeRemaining(secondsInput) {
		const seconds = Math.floor(secondsInput % 60);
		const minutes = Math.floor((secondsInput / 60) % 60);
		const hours = Math.floor((secondsInput / (60 * 60)) % 24);
		const days = Math.floor(secondsInput / (60 * 60 * 24));

		if (this.textFormat) {
			const day = days > 1 ? `${days} days` : days > 0 ? `${days} day` : "";
			const hour = hours > 1 ? `${hours} hours` : hours > 0 ? `${hours} hour` : "";
			const minute = minutes > 1 ? `${minutes} minutes` : minutes > 0 ? `${minutes} minute` : "";
			const second = `${seconds} seconds left`;

			return `${day !== "" ? `${day}, ${hour}` : hour !== "" ? `${hour}, ${minute}` : minute !== "" ? `${minute}, ${second}` : second}`;
		}

		return ("0" + days).slice(-2) + ":" + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
	}
}
