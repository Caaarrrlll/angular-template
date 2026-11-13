// Ambient typings for the Google Maps JavaScript Places API subset used by
// this project (the API script itself is loaded at runtime by the host app).
declare namespace google.maps.places {
	interface AutocompleteOptions {
		types?: string[];
		componentRestrictions?: {
			country?: string | string[];
		};
	}

	interface AutocompletePlaceComponent {
		long_name: string;
		short_name: string;
		types: string[];
	}

	interface AutocompletePlaceResult {
		name?: string;
		address_components?: AutocompletePlaceComponent[];
		formatted_address?: string;
		geometry: {
			location: {
				lat: () => number;
				lng: () => number;
			};
		};
	}

	class Autocomplete {
		constructor(input: HTMLElement, options?: AutocompleteOptions);
		addListener(eventName: string, handler: (...args: unknown[]) => void): void;
		getPlace(): AutocompletePlaceResult | null | undefined;
	}
}
