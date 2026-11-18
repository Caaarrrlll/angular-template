import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, InjectionToken, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Observable, map } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaDialogComponent implements OnInit {
	public imageData$ = new Observable<MediaFile | null>((subscriber) => {
		subscriber.next(null);
	});

	private readonly mediaLoader = inject(MEDIA_LOADER, { optional: true });
	private readonly dialogRef = inject<MatDialogRef<MediaDialogComponent>>(MatDialogRef);
	private readonly dialogData = inject<_MediaDialogData>(MAT_DIALOG_DATA);
	private readonly destroyRef = inject(DestroyRef);

	public ngOnInit(): void {
		this.imageData$ = (
			this.mediaLoader?.(this.dialogData.mediaKey) ??
			new Observable<MediaFile | null>((subscriber) => {
				subscriber.next(null);
			})
		).pipe(
			takeUntilDestroyed(this.destroyRef),
			// strip `type` so the `apiResponse` pipe passes the raw file through as payload; keep `null` as null
			// (spreading it would give `{}`, a truthy payload that rendered an empty, broken <img>)
			map((media: MediaFile | null): MediaFile | null => (media === null ? null : { ...media, type: undefined })),
		);
	}

	public mediaSrc(state: ApiResponseState): string {
		const data = (state.payload as MediaFile | undefined)?.file?.data;
		return data ? `data:image/jpeg;base64,${data}` : "";
	}

	public close(): void {
		this.dialogRef.close();
	}
}
