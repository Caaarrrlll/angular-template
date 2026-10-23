import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";

@Component({
	selector: "app-search-address",
	templateUrl: "./search-address.component.html",
	styleUrls: ["./search-address.component.scss"],
})
export class SearchAddressComponent implements AfterViewInit, OnChanges {
	@ViewChild("mapSearchField") searchField: ElementRef;

	@Output() updateAddress: EventEmitter<any> = new EventEmitter<any>();
	@Output() manualUpdateAddress: EventEmitter<any> = new EventEmitter<any>();

	@Input() disabled = false;
	@Input() width = "100%";
	@Input() types = "address";
	@Input() labelText = "Search Address";
	@Input() value = "";
	@Input() allowManualInput = false;
	@Input() material: boolean = false;

	neededTypes = ["postal_code", "administrative_area_level_1", "locality", "sublocality_level_1", "sublocality_level_2", "route", "street_number"];

	constructor(private ngZone: NgZone) {}

	ngAfterViewInit() {
		this.loadMaps();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["types"] && changes["types"].currentValue !== changes["types"].previousValue) {
			this.loadMaps();
		}
	}

	loadMaps(): void {
		const searchBox = new google.maps.places.Autocomplete(this.searchField.nativeElement, {
			types: [this.types],
			componentRestrictions: { country: "za" },
		});

		this.ngZone.run(() => {
			searchBox.addListener("place_changed", () => {
				const place = searchBox.getPlace();
				if (place === undefined || place === null) {
					return;
				}

				this.formatAddress(place);
			});
		});
	}

	formatAddress(googleAddress) {
		const address_components = googleAddress.address_components;
		const results = [];
		if (!address_components && this.allowManualInput) {
			this.manualUpdateAddress.emit(googleAddress.name ?? "");
			return;
		}
		address_components.map((component) => {
			if (this.neededTypes.some((e) => component.types.includes(e))) {
				results.push({
					long_name: component.long_name,
					type: this.returnNeededType(component.types),
				});
			}
		});
		results.push({ long_name: googleAddress.geometry.location.lat(), type: "latitude" });
		results.push({ long_name: googleAddress.geometry.location.lng(), type: "longitude" });
		results.push({ long_name: googleAddress.formatted_address, type: "fullAddress" });
		this.updateAddress.emit(results);
	}

	returnNeededType(types: string[]) {
		const intersection = this.neededTypes.filter((element) => types.includes(element));
		return intersection.toString();
	}
}
