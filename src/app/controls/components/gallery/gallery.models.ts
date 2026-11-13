export interface Image {
	url: string;
	title?: string;
	description?: string;
	name?: string;
}

export interface PreviewImage extends Image {
	visible: "block" | "none";
}

export interface _DeconstructedFlatView {
	[key: string]: unknown;
}
