import { CommonModule } from "@angular/common";
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	NgZone,
	OnChanges,
	Output,
	SimpleChange,
	SimpleChanges,
	ViewChild,
	inject,
} from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { LoggerService } from "@shared/services/logger.service";

export interface _AddressResult {
	long_name: string;
	type: string;
}

@Component({
	selector: "app-search-address",
	templateUrl: "./search-address.component.html",
	imports: [CommonModule, MatFormFieldModule, MatInputModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAddressComponent implements AfterViewInit, OnChanges {
	@ViewChild("mapSearchField") public searchField: ElementRef<HTMLElement> | undefined;

	@Output() public updateAddress: EventEmitter<_AddressResult[]> = new EventEmitter<_AddressResult[]>();
	@Output() public manualUpdateAddress: EventEmitter<string> = new EventEmitter<string>();

	@Input() public disabled = false;
	@Input() public width = "100%";
	@Input() public types = "address";
	@Input() public labelText = "Search Address";
	@Input() public value = "";
	@Input() public allowManualInput = false;
	/** ISO 3166-1 alpha-2 code(s) the suggestions are restricted to (Google allows up to 5). */
	@Input() public country: string | string[] = "za";

	public neededTypes: string[] = ["postal_code", "administrative_area_level_1", "locality", "sublocality_level_1", "sublocality_level_2", "route", "street_number"];

	private readonly ngZone = inject(NgZone);
	private readonly logger = inject(LoggerService);

	public ngAfterViewInit(): void {
		this.loadMaps();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		const typesChange = changes["types"] as SimpleChange | undefined;
		const countryChange = changes["country"] as SimpleChange | undefined;
		if ((typesChange && !typesChange.firstChange) || (countryChange && !countryChange.firstChange)) {
			this.loadMaps();
		}
	}

	public loadMaps(): void {
		if (!this.searchField) {
			return;
		}
		// The host app loads the Maps script (with its own key); without it the field stays a plain input instead of throwing.
		if (!isPlacesLoaded()) {
			this.logger.warn(`app-search-address: Google Maps Places script not loaded; address suggestions are disabled.`);
			return;
		}
		const searchBox = new google.maps.places.Autocomplete(this.searchField.nativeElement, {
			types: [this.types],
			componentRestrictions: { country: this.country },
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

/** True when the host app has loaded the Maps JavaScript API with the Places library. */
function isPlacesLoaded(): boolean {
	const maps: { places?: unknown } | undefined = (globalThis as { google?: { maps?: { places?: unknown } } }).google?.maps;
	return maps?.places !== undefined;
}
