import { CommonModule } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { _FileUploadResponse } from "@apis/concerns/models/file-response.interface";
import { MediaApiService } from "@apis/media/media-api.service";
import { CustLoaderModule } from "@controls/cust-loader/cust-loader.module";
import { PipesModule } from "@pipes/pipes.module";
import { Observable, Subject, map, takeUntil } from "rxjs";

@Component({
	selector: "app-cust-media-dialog",
	templateUrl: "./cust-media-dialog.component.html",
	styleUrls: ["./cust-media-dialog.component.scss"],
	standalone: true,
	providers: [MediaApiService],
	imports: [PipesModule, CommonModule, CustLoaderModule, MatIconModule],
})
export class CustMediaDialogComponent implements OnInit, OnDestroy {
	constructor(private _mediaApiService: MediaApiService, @Inject(MAT_DIALOG_DATA) private _dialogData, private _dialogRef: MatDialogRef<CustMediaDialogComponent>) {}
	imageData$: Observable<_FileUploadResponse>;
	destroy$ = new Subject();

	ngOnInit(): void {
		this.imageData$ = this._mediaApiService.getMediaFromId(this._dialogData.mediaKey).pipe(
			takeUntil(this.destroy$),
			map((res) => {
				delete res.type;
				return res;
			})
		);
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	close(): void {
		this._dialogRef.close();
	}
}
