import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, Output, SimpleChanges, ViewChild, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export interface _AddressResult {
	long_name: string;
	type: string;
}

@Component({
	selector: "app-search-address",
	templateUrl: "./search-address.component.html",
	styleUrls: ["./search-address.component.scss"],
	imports: [CommonModule, MatFormFieldModule, MatInputModule],
})
export class SearchAddressComponent implements AfterViewInit, OnChanges {
	@ViewChild("mapSearchField") public searchField: ElementRef | undefined;

	@Output() public updateAddress: EventEmitter<_AddressResult[]> = new EventEmitter<_AddressResult[]>();
	@Output() public manualUpdateAddress: EventEmitter<string> = new EventEmitter<string>();

	@Input() public disabled: boolean = false;
	@Input() public width: string = "100%";
	@Input() public types: string = "address";
	@Input() public labelText: string = "Search Address";
	@Input() public value: string = "";
	@Input() public allowManualInput: boolean = false;

	public neededTypes: string[] = ["postal_code", "administrative_area_level_1", "locality", "sublocality_level_1", "sublocality_level_2", "route", "street_number"];

	private readonly ngZone = inject(NgZone);

	public ngAfterViewInit(): void {
		this.loadMaps();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes["types"] && changes["types"].currentValue !== changes["types"].previousValue) {
			this.loadMaps();
		}
	}

	public loadMaps(): void {
		if (!this.searchField) {
			return;
		}
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

	public formatAddress(googleAddress: google.maps.places.AutocompletePlaceResult): void {
		const address_components = googleAddress.address_components;
		const results: _AddressResult[] = [];
		if (!address_components) {
			if (this.allowManualInput) {
				this.manualUpdateAddress.emit(googleAddress.name ?? "");
			}
			return;
		}
		for (const component of address_components) {
			if (this.neededTypes.some((e) => component.types.includes(e))) {
				results.push({
					long_name: component.long_name,
					type: this.returnNeededType(component.types),
				});
			}
		}
		results.push({ long_name: String(googleAddress.geometry.location.lat()), type: "latitude" });
		results.push({ long_name: String(googleAddress.geometry.location.lng()), type: "longitude" });
		results.push({ long_name: googleAddress.formatted_address ?? "", type: "fullAddress" });
		this.updateAddress.emit(results);
	}

	public returnNeededType(types: string[]): string {
		const intersection = this.neededTypes.filter((element) => types.includes(element));
		return intersection.toString();
	}
}
