import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "cust-loader",
	templateUrl: "./cust-loader.component.html",
	styleUrls: ["./cust-loader.component.scss"],
})
export class CUSTLoaderComponent implements OnInit {
	@Input() fontSize: number;

	constructor() {}


	public ngOnInit(): void {
        
}
}
