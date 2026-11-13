import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Output, computed, inject, input, signal, viewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { take, timer } from "rxjs";
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { CustButtonMenuItem } from "@shared/models/cust-basic-controls";

@Component({
	selector: "app-button-v1",
	templateUrl: "./button-v1.component.html",
	styleUrls: ["./button-v1.component.scss"],
	imports: [MatRippleModule, MatIconModule, MatMenuModule, LoaderComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonV1Component {
	@Output() public selected: EventEmitter<CustButtonMenuItem> = new EventEmitter<CustButtonMenuItem>();

	public readonly value = input<string>("");
	public readonly color = input<string>("default");
	public readonly fontSize = input<string>("15px");
	public readonly padding = input<string>("15px 30px");
	public readonly width = input<string>("100%");
	public readonly margin = input<string>("0px");
	public readonly fontWeight = input<string>("normal");
	public readonly icon = input<string>("");
	public readonly iconStyle = input<string>("");
	public readonly iconColor = input<string>("");
	public readonly display = input<string>("initial");
	public readonly alignItems = input<string>("center");
	public readonly loading = input<boolean>(false);
	public readonly disabled = input<boolean>(false);
	public readonly askToConfirm = input<boolean>(false);
	public readonly menuItems = input<CustButtonMenuItem[]>([]);

	public readonly numberOfClicks = signal(0);

	public readonly displayValue = computed<string>(() => (this.numberOfClicks() === 1 ? "Click to Confirm" : this.value()));

	private readonly menuTrigger = viewChild(MatMenuTrigger);
	private readonly destroyRef = inject(DestroyRef);
	private readonly confirmationTimer = 3000;

	public get loaderFontSize(): number | undefined {
		const parsed = Number.parseInt(this.fontSize(), 10);
		return Number.isNaN(parsed) ? undefined : parsed;
	}

	public clicked(event: Event): void {
		if (this.disabled() || this.loading()) {
			event.stopPropagation();
		}

		if (this.askToConfirm()) {
			if (this.numberOfClicks() === 0) {
				event.stopPropagation();
				this.startConfirmation();
			} else if (this.numberOfClicks() === 1) {
				this.resetConfirmation();
			}
		}
	}

	public openMenu(event: MouseEvent): void {
		if (this.disabled() || this.loading()) {
			return;
		}
		event.preventDefault();
		this.menuTrigger()?.openMenu();
	}

	public onSelect(item: CustButtonMenuItem): void {
		this.selected.emit(item);
	}

	private startConfirmation(): void {
		this.numberOfClicks.set(1);
		timer(this.confirmationTimer)
			.pipe(take(1), takeUntilDestroyed(this.destroyRef))
			.subscribe(() => this.resetConfirmation());
	}

	private resetConfirmation(): void {
		this.numberOfClicks.set(0);
	}
}
