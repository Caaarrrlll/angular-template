export interface GalleryImage {
	url: string;
	title?: string;
	description?: string;
	name?: string;
}

export interface GalleryPreviewImage extends GalleryImage {
	visible?: "block" | "none";
}
