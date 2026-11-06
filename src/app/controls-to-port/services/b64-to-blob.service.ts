import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class B64ToBlobService {
	public b64ToBlob(b64Data: string, contentType = "application/pdf", sliceSize = 512): Blob {
		const byteCharacters = atob(b64Data);
		const byteArrays: BlobPart[] = [];
		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);
			const byteNumbers = new Uint8Array(new ArrayBuffer(slice.length));
			for (let index = 0; index < slice.length; index++) {
				byteNumbers[index] = slice.charCodeAt(index);
			}
			byteArrays.push(byteNumbers);
		}
		return new Blob(byteArrays, { type: contentType });
	}
}
