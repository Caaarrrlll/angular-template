export interface _GalleryImage {
	url: string;
	title?: string;
	description?: string;
	name?: string;
}

export interface _GalleryPreviewImage extends _GalleryImage {
	visible?: "block" | "none";
}
