declare namespace google.maps.places {
	interface AutocompleteOptions {
		types?: string[];
		componentRestrictions?: {
			country?: string | string[];
		};
	}

	interface AutocompletePlaceResult {
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
		addListener(eventName: string, handler: () => void): void;
		getPlace(): AutocompletePlaceResult | null | undefined;
	}
}
