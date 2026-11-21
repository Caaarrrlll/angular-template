export interface _Image {
	url: string;
	title?: string;
	description?: string;
	name?: string;
}

export interface _PreviewImage extends _Image {
	visible: "block" | "none";
}
