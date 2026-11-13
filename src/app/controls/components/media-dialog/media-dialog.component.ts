import { CommonModule } from "@angular/common";
import { Component, InjectionToken, OnDestroy, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Observable, Subject, map, takeUntil } from "rxjs";
import { ApiResponsePipe, ApiResponseState } from "@shared/pipes/api-response/api-response.pipe";
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { MediaFile, _MediaDialogData } from "./media-dialog.models";

/**
 * Clean seam for the upload API integration: provide a loader that resolves
 * a base64 `MediaFile` for the given media key (for example a fork-specific
 * media API service). Without a provider the dialog reports no data.
 */
export const MEDIA_LOADER = new InjectionToken<(mediaKey: string) => Observable<MediaFile | null>>("MEDIA_LOADER");

@Component({
	selector: "app-media-dialog",
	templateUrl: "./media-dialog.component.html",
	styleUrls: ["./media-dialog.component.scss"],
	imports: [CommonModule, LoaderComponent, MatIconModule, ApiResponsePipe],
})
export class MediaDialogComponent implements OnInit, OnDestroy {
	public imageData$ = new Observable<MediaFile | null>((subscriber) => subscriber.next(null));

	private readonly mediaLoader = inject(MEDIA_LOADER, { optional: true });
	private readonly dialogRef: MatDialogRef<MediaDialogComponent> = inject(MatDialogRef);
	private readonly dialogData: _MediaDialogData = inject(MAT_DIALOG_DATA);
	private readonly destroy$ = new Subject<void>();

	public ngOnInit(): void {
		this.imageData$ = (this.mediaLoader?.(this.dialogData.mediaKey) ?? new Observable<MediaFile | null>((subscriber) => subscriber.next(null))).pipe(
			takeUntil(this.destroy$),
			map((media: MediaFile | null) => {
				// strip `type` so the `apiResponse` pipe passes the raw file through as payload
				return { ...media, type: undefined } as MediaFile;
			})
		);
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public mediaSrc(state: ApiResponseState): string {
		const data = (state.payload as MediaFile | undefined)?.file?.data;
		return data ? `data:image/jpeg;base64,${data}` : "";
	}

	public close(): void {
		this.dialogRef.close();
	}
}
