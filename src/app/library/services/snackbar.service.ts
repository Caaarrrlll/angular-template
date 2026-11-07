import { DestroyRef, Service, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";

export type SnackbarState = "info" | "success" | "warning" | "error";

@Service()
export class SnackbarService {
	private readonly snackBar: MatSnackBar = inject(MatSnackBar);
	private readonly destroyRef: DestroyRef = inject(DestroyRef);
	private previousMessage: string | null = null;

	open(message: string = "", state: SnackbarState = "error", duration: number = 5555): MatSnackBarRef<TextOnlySnackBar> | null {
		if (this.previousMessage === message) {
			return null;
		}

		this.previousMessage = message;

		const config: MatSnackBarConfig = {
			duration: duration,
			horizontalPosition: "center",
			verticalPosition: "bottom",
			panelClass: [`snackbar-${state}`],
		};

		const snackBarRef = this.snackBar.open(message, "Close", config);

		snackBarRef
			.afterDismissed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				if (this.previousMessage === message) {
					this.previousMessage = null;
				}
			});

		return snackBarRef;
	}

	dismiss(): void {
		this.snackBar.dismiss();
	}
}
