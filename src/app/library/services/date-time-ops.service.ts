import { formatDate } from "@angular/common";
import { LOCALE_ID, Service, inject } from "@angular/core";

export type DateTimePeriod = "year" | "month" | "week" | "day" | "hour" | "minute" | "second";

@Service()
export class DateTimeOpsService {
	private readonly localeId: string = inject(LOCALE_ID);

	// Produces a relative time string from the datetime parameter to the current datetime
	getRelativeTime(date: Date): string {
		date = new Date(date);
		const currentTime: Date = new Date();
		const timeDifference: number = Math.abs(currentTime.getTime() - date.getTime()) / 1000;
		const secondsInHour: number = 3600;
		const secondsInDay: number = secondsInHour * 24;

		if (timeDifference < secondsInHour) {
			const minutes = Math.round(timeDifference / 60);
			return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
		}

		if (timeDifference < secondsInDay) {
			const hours = Math.round(timeDifference / secondsInHour);
			return `${hours} hour${hours === 1 ? "" : "s"} ago`;
		}

		const days = Math.round(timeDifference / secondsInDay);
		if (days < 29) {
			return `${days} day${days === 1 ? "" : "s"} ago`;
		}

		const months = currentTime.getTime() >= date.getTime() ? this.getMonthDifference(date, currentTime) : this.getMonthDifference(currentTime, date);
		if (months.months < 12) {
			if (months.days > 0) {
				return `${months.months} month${months.months === 1 ? "" : "s"} ${months.days}d ago`;
			}
			return `${months.months} month${months.months === 1 ? "" : "s"} ago`;
		}

		const years = Math.floor(months.months / 12);
		const remainderMonths = months.months % 12;
		if (remainderMonths > 0) {
			return `${years} yr${years === 1 ? "" : "s "} ${remainderMonths} mo ago`;
		}
		return `${years} year${years === 1 ? "" : "s"} ago`;
	}

	// Produces a string that calculates a time period until now in a format of 'in 2 years' or '2 years' given a boolean
	// Value for a prefix
	timeTillNow(prefix: boolean, date: Date): string {
		date = new Date(date);
		const currentTime: Date = new Date();
		const timeDifference: number = Math.abs(currentTime.getTime() - date.getTime()) / 1000;
		const secondsInHour: number = 3600;
		const secondsInDay: number = secondsInHour * 24;

		if (timeDifference < secondsInHour) {
			const minutes = Math.round(timeDifference / 60);
			return `${prefix ? "in " : ""}${minutes} minute${minutes === 1 ? "" : "s"}`;
		}

		if (timeDifference < secondsInDay) {
			const hours = Math.round(timeDifference / secondsInHour);
			return `${prefix ? "in " : ""}${hours} hour${hours === 1 ? "" : "s"}`;
		}

		const days = Math.round(timeDifference / secondsInDay);
		if (days < 29) {
			return `${prefix ? "in " : ""}${days} day${days === 1 ? "" : "s"}`;
		}

		const months = currentTime.getTime() >= date.getTime() ? this.getMonthDifference(date, currentTime) : this.getMonthDifference(currentTime, date);
		if (months.months < 12) {
			if (months.days > 0) {
				return `${prefix ? "in " : ""}${months.months} month${months.months === 1 ? "" : "s"} ${months.days}d`;
			}
			return `${prefix ? "in " : ""}${months.months} month${months.months === 1 ? "" : "s"}`;
		}

		const years = Math.floor(months.months / 12);
		const remainderMonths = months.months % 12;
		if (remainderMonths > 0) {
			return `${prefix ? "in " : ""} ${years} yr${years === 1 ? "" : "s "} ${remainderMonths} mo`;
		}
		return `${prefix ? "in " : ""}${years} year${years === 1 ? "" : "s"}`;
	}

	getMonthDifference(startDate: Date, endDate: Date): { months: number; days: number } {
		let months = endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
		let days = endDate.getDate() - startDate.getDate();
		if (days < 0) {
			months--;
			days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
		}
		return { months, days };
	}

	// Sets the date object to the beginning of the time period passed in
	startOf(timePeriod: DateTimePeriod, date: Date = new Date()): Date {
		let modDate = new Date(date);
		switch (timePeriod) {
			case "year": {
				modDate.setDate(1);
				modDate.setMonth(0);
				modDate.setHours(0, 0, 0, 0);
				break;
			}
			case "month": {
				modDate.setDate(1);
				modDate.setHours(0, 0, 0, 0);
				break;
			}
			case "week": {
				modDate = new Date(modDate.setDate(modDate.getDate() - modDate.getDay()));
				modDate.setHours(0, 0, 0, 0);
				break;
			}
			case "day": {
				modDate.setHours(0, 0, 0, 0);
				break;
			}
			case "hour": {
				modDate.setMinutes(0, 0, 0);
				break;
			}
			case "minute": {
				modDate.setSeconds(0, 0);
				break;
			}
			case "second": {
				modDate.setMilliseconds(0);
				break;
			}
		}

		return modDate;
	}

	// Sets the date object to the end of the time period passed in
	endOf(timePeriod: DateTimePeriod, date: Date = new Date()): Date {
		let modDate = new Date(date);
		switch (timePeriod) {
			case "year": {
				modDate.setDate(31);
				modDate.setMonth(11);
				modDate.setHours(23, 59, 59, 999);
				break;
			}
			case "month": {
				modDate = new Date(modDate.getFullYear(), modDate.getMonth() + 1, 0);
				modDate.setHours(23, 59, 59, 999);
				break;
			}
			case "week": {
				modDate = new Date(modDate.setDate(modDate.getDate() - modDate.getDay() + 6));
				modDate.setHours(23, 59, 59, 999);
				break;
			}
			case "day": {
				modDate.setHours(23, 59, 59, 999);
				break;
			}
			case "hour": {
				modDate.setMinutes(59, 59, 999);
				break;
			}
			case "minute": {
				modDate.setSeconds(59, 999);
				break;
			}
			case "second": {
				modDate.setMilliseconds(999);
				break;
			}
		}

		return modDate;
	}

	// String format, defaults to full ISO string with the local timezone offset applied
	formatISO(date: Date, format: "YYYY-MM-ddTHH:mm:ss" | "YYYY-MM-ddTHH:mm:ss[Z]" | "YYYY-MM-ddTHH:mm:ssZ[Z]"): string {
		let isoString: string;
		const modDate = new Date(date);
		switch (format) {
			case "YYYY-MM-ddTHH:mm:ss": {
				isoString = new Date(modDate.getTime() - modDate.getTimezoneOffset() * 60000).toISOString();
				isoString = isoString.split(".")[0];
				break;
			}
			case "YYYY-MM-ddTHH:mm:ss[Z]": {
				isoString = new Date(modDate.getTime() - modDate.getTimezoneOffset() * 60000).toISOString();
				isoString = isoString.split(".")[0] + "Z";
				break;
			}
			case "YYYY-MM-ddTHH:mm:ssZ[Z]": {
				isoString = new Date(modDate.getTime() - modDate.getTimezoneOffset() * 60000).toISOString();
				isoString = isoString.split(".")[0] + formatDate(new Date(), "ZZZZZ", this.localeId) + "Z";
				break;
			}
		}
		return isoString;
	}

	// Subtract amount from the time period specified
	subtract(date: Date, amount: number, timePeriod: DateTimePeriod): Date {
		let modDate = new Date(date);
		switch (timePeriod) {
			case "year": {
				modDate.setFullYear(modDate.getFullYear() - amount);
				break;
			}
			case "month": {
				modDate.setMonth(modDate.getMonth() - amount);
				break;
			}
			case "week": {
				modDate.setDate(modDate.getDate() - 7 * amount);
				break;
			}
			case "day": {
				modDate.setDate(modDate.getDate() - amount);
				break;
			}
			case "hour": {
				modDate.setHours(modDate.getHours() - amount);
				break;
			}
			case "minute": {
				modDate.setMinutes(modDate.getMinutes() - amount);
				break;
			}
			case "second": {
				modDate.setSeconds(modDate.getSeconds() - amount);
				break;
			}
		}
		return modDate;
	}

	// Add amount to the time period specified
	add(date: Date, amount: number, timePeriod: DateTimePeriod): Date {
		let modDate = new Date(date);
		switch (timePeriod) {
			case "year": {
				modDate.setFullYear(modDate.getFullYear() + amount);
				break;
			}
			case "month": {
				modDate.setMonth(modDate.getMonth() + amount);
				break;
			}
			case "week": {
				modDate.setDate(modDate.getDate() + 7 * amount);
				break;
			}
			case "day": {
				modDate.setDate(modDate.getDate() + amount);
				break;
			}
			case "hour": {
				modDate.setHours(modDate.getHours() + amount);
				break;
			}
			case "minute": {
				modDate.setMinutes(modDate.getMinutes() + amount);
				break;
			}
			case "second": {
				modDate.setSeconds(modDate.getSeconds() + amount);
				break;
			}
		}
		return modDate;
	}

	dateFormat(date: Date): string {
		return new Intl.DateTimeFormat("en-ZA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
	}

	timeFormat(date: Date): string {
		return new Intl.DateTimeFormat("en-ZA", {
			hour: "numeric",
			minute: "numeric",
		}).format(date);
	}

	dateTimeFormat(date: Date): string {
		return new Intl.DateTimeFormat("en-ZA", { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric" }).format(date);
	}
}
