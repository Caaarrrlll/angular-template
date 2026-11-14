export interface Image {
	url: string;
	title?: string;
	description?: string;
	name?: string;
}

export interface PreviewImage extends Image {
	visible: "block" | "none";
}
