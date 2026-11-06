import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()

// Global incase ever needed across other grids
export class SearchRetainService {
	private searchData = new BehaviorSubject<any>("");
	getSearchData = this.searchData.asObservable();

	constructor() {}

	changeValue(searchValue) {
		this.searchData.next(searchValue);
	}

	clearValue() {
		this.searchData.next("");
	}
}
