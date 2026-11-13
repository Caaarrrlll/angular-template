import { Service } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// Global in case ever needed across other grids
@Service()
export class SearchRetainService {
	private readonly searchData = new BehaviorSubject<string>("");

	readonly getSearchData = this.searchData.asObservable();

	changeValue(searchValue: string): void {
		this.searchData.next(searchValue);
	}

	clearValue(): void {
		this.searchData.next("");
	}
}
