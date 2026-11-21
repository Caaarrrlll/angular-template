import { ChangeDetectionStrategy, Component, DestroyRef, inject, ViewContainerRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable, filter, switchMap } from "rxjs";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { _SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { SANDBOX_MEDIA_KEYS, SandboxDialogsDataService } from "@segments/sandbox/services/sandbox-dialogs-data.service";
import { ConfirmationDialogComponent } from "@shared/components/confirmation-dialog/confirmation-dialog.component";
import { _ConfirmationDialogData } from "@shared/components/confirmation-dialog/confirmation-dialog.interface";
import { DynamicDialogService } from "@shared/components/dynamic-material-dialog/dynamic-dialog.service";
import { _DialogOptions, openDynamicDialog } from "@shared/components/dynamic-material-dialog/dynamic-material-dialog.component";
import { _DynamicDialogSetup } from "@shared/components/dynamic-material-dialog/dynamic-material-dialog-setup.model";
import { openDynamicWindow } from "@shared/components/dynamic-window/dynamic-window.component";
import { _DialogSetup } from "@shared/components/dynamic-window/dynamic-window.models";
import { MEDIA_LOADER, MediaDialogComponent } from "@shared/components/media-dialog/media-dialog.component";
import { _MediaFile, _MediaDialogData } from "@shared/components/media-dialog/media-dialog.models";
import { CustTableDialogueComponent } from "@shared/components/table-dialogue/cust-table-dialogue.component";

/**
 * Dialogs family page. Dialogs are opened through `viewContainerRef` so they resolve the
 * page-level providers below (native `DateAdapter` for the date controls, mock `MEDIA_LOADER`).
 */
@Component({
	selector: "app-sandbox-dialogs",
	templateUrl: "./sandbox-dialogs.component.html",
	styleUrls: ["./sandbox-dialogs.component.scss"],
	imports: [MatButtonModule, SandboxPageComponent, SandboxDemoComponent],
	providers: [
		provideNativeDateAdapter(),
		{
			provide: MEDIA_LOADER,
			useFactory: (): ((mediaKey: string) => Observable<_MediaFile | null>) => {
				const dialogsData = inject(SandboxDialogsDataService);
				return (mediaKey: string): Observable<_MediaFile | null> => dialogsData.loadMedia(mediaKey);
			},
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxDialogsComponent {
	private readonly dialog = inject(MatDialog);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly destroyRef = inject(DestroyRef);
	private readonly dialogsData = inject(SandboxDialogsDataService);
	private readonly dynamicDialogService = inject(DynamicDialogService);

	public readonly mediaKeys = SANDBOX_MEDIA_KEYS;

	public readonly confirmationLog = new _SandboxEventLog();
	public readonly mediaLog = new _SandboxEventLog();
	public readonly tableLog = new _SandboxEventLog();
	public readonly dynamicButtonsLog = new _SandboxEventLog();
	public readonly dynamicMenuLog = new _SandboxEventLog();
	public readonly dynamicFormLog = new _SandboxEventLog();
	public readonly windowLog = new _SandboxEventLog();

	public constructor() {
		// Answers the dynamic dialog's autocomplete input: the dialog pushes the typed text into
		// `inputChange`, the page replies through `setResponse` + `setResponseNotification`.
		this.dynamicDialogService.inputChange
			.pipe(
				filter((term: string): boolean => term.length > 0),
				switchMap((term: string): Observable<string[]> => this.dialogsData.searchAgents(term)),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe((matches: string[]): void => {
				this.dynamicDialogService.clearResponse();
				matches.forEach((name: string): void => {
					this.dynamicDialogService.setResponse(name);
				});
				this.dynamicDialogService.setResponseNotification(`${String(matches.length)} match(es)`);
				this.dynamicFormLog.add(`autocomplete: ${String(matches.length)} suggestion(s)`);
			});
	}

	// ---- confirmation-dialog ------------------------------------------------------------------

	public openConfirmation(custom: boolean): void {
		const data: _ConfirmationDialogData | undefined = custom ? this.dialogsData.confirmationCustom : undefined;
		this.dialog
			.open<ConfirmationDialogComponent, _ConfirmationDialogData | undefined, boolean>(ConfirmationDialogComponent, this.config({ data: data, width: `420px` }))
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result: boolean | undefined): void => {
				this.confirmationLog.add(`afterClosed (${custom ? `custom` : `default`}): ${String(result)}`);
			});
	}

	// ---- media-dialog -------------------------------------------------------------------------

	public openMedia(mediaKey: string): void {
		this.dialog
			.open<MediaDialogComponent, _MediaDialogData>(MediaDialogComponent, this.config({ data: { mediaKey: mediaKey }, width: `320px` }))
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result: unknown): void => {
				this.mediaLog.add(`afterClosed (${mediaKey}): ${String(result)}`);
			});
	}

	// ---- table-dialogue -----------------------------------------------------------------------

	public openTable(empty: boolean): void {
		this.dialog
			.open(CustTableDialogueComponent, this.config({ data: this.dialogsData.tableDialogData(empty), width: `760px` }))
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result: unknown): void => {
				this.tableLog.add(`afterClosed: ${this.describe(result)}`);
			});
	}

	// ---- dynamic-material-dialog --------------------------------------------------------------

	public openDynamicButtonGroup(): void {
		this.openDynamic(this.dialogsData.dmdButtonGroupSetup(), this.dynamicButtonsLog, `button group`);
	}

	public openDynamicApproval(): void {
		this.openDynamic(this.dialogsData.dmdApprovalSetup(), this.dynamicButtonsLog, `approval`);
	}

	public openDynamicFilterMenu(): void {
		this.openDynamic(this.dialogsData.dmdFilterMenuSetup(), this.dynamicMenuLog, `filter menu`);
	}

	public openDynamicTextForm(): void {
		this.openDynamic(this.dialogsData.dmdTextFormSetup(), this.dynamicFormLog, `text form`);
	}

	public openDynamicAutoComplete(): void {
		this.dynamicDialogService.clearResponse();
		this.openDynamic(this.dialogsData.dmdAutoCompleteSetup(), this.dynamicFormLog, `autocomplete`);
	}

	public openDynamicPickerForm(): void {
		this.openDynamic(this.dialogsData.dmdPickerFormSetup(), this.dynamicFormLog, `picker form`);
	}

	public openDynamicCheckbox(): void {
		this.openDynamic(this.dialogsData.dmdCheckboxSetup(), this.dynamicFormLog, `checkbox`);
	}

	public openDynamicChoiceLists(): void {
		this.openDynamic(this.dialogsData.dmdChoiceListsSetup(), this.dynamicFormLog, `choice lists`);
	}

	/** AUD-10 regression: no options → the plain (non-draggable) title bar must render. */
	public openDynamicPlainTitle(): void {
		this.openDynamic(this.dialogsData.dmdApprovalSetup(), this.dynamicButtonsLog, `approval, no options`, {});
	}

	public openDynamicSliderUpload(): void {
		this.openDynamic(this.dialogsData.dmdSliderUploadSetup(), this.dynamicFormLog, `slider + upload`);
	}

	// ---- dynamic-window -----------------------------------------------------------------------

	public openWindowForm(): void {
		this.openWindow(this.dialogsData.windowFormSetup(), `form`);
	}

	public openWindowApproval(): void {
		this.openWindow(this.dialogsData.windowApprovalSetup(), `approval`);
	}

	// ---- helpers ------------------------------------------------------------------------------

	private openDynamic(setup: _DynamicDialogSetup, log: _SandboxEventLog, label: string, options: _DialogOptions = { draggable: true }): void {
		openDynamicDialog(this.dialog, setup, this.config({ width: `520px` }), options)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result: unknown): void => {
				log.add(`afterClosed (${label}): ${this.describe(result)}`);
			});
	}

	private openWindow(setup: _DialogSetup, label: string): void {
		openDynamicWindow(this.dialog, setup, this.config({ width: `600px` }))
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result: unknown): void => {
				this.windowLog.add(`afterClosed (${label}): ${this.describe(result)}`);
			});
	}

	private config<D>(config: MatDialogConfig<D>): MatDialogConfig<D> {
		config.viewContainerRef = this.viewContainerRef;
		config.maxHeight = `90vh`;
		return config;
	}

	private describe(result: unknown): string {
		return result === undefined ? `undefined` : JSON.stringify(result);
	}
}
