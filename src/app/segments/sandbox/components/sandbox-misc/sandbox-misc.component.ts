import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";
import { _SandboxAccordionItem, SandboxAccordionDataService } from "@segments/sandbox/services/sandbox-accordion-data.service";
import { AccordionComponent } from "@shared/components/accordion/accordion.component";
import { AccordionContentDirective } from "@shared/components/accordion/directives/accordion-content.directive";
import { AccordionHeaderDirective } from "@shared/components/accordion/directives/accordion-header.directive";
import { AccordionItemDirective } from "@shared/components/accordion/directives/accordion-item.directive";
import { _AddressResult, SearchAddressComponent } from "@shared/components/search-address/search-address.component";
import { ClickElseWhereDirective } from "@shared/directives/click-else-where.directive";
import { CopyTextDirective } from "@shared/directives/copy-text.directive";
import { SafePipe } from "@shared/pipes/safe/safe.pipe";

/** Fixed, developer-authored document used to demonstrate the `safe` pipe (never pass user input through it). */
const TRUSTED_FRAME_HTML = `<body style="font-family:sans-serif;margin:8px"><strong>Trusted static content</strong><p>Rendered from a hard-coded data: URL marked safe via the safe pipe.</p></body>`;

@Component({
	selector: "app-sandbox-misc",
	templateUrl: "./sandbox-misc.component.html",
	styleUrls: ["./sandbox-misc.component.scss"],
	imports: [
		MatIconModule,
		SandboxPageComponent,
		SandboxDemoComponent,
		AccordionComponent,
		AccordionContentDirective,
		AccordionHeaderDirective,
		AccordionItemDirective,
		SearchAddressComponent,
		CopyTextDirective,
		ClickElseWhereDirective,
		SafePipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxMiscComponent {
	private readonly accordionData = inject(SandboxAccordionDataService);

	public readonly accordionItems: _SandboxAccordionItem[] = this.accordionData.items;
	public readonly accordionLog = new SandboxEventLog();

	/** Whether the Maps script is loaded; without it search-address stays a plain input, and the page shows how to enable suggestions. */
	public readonly mapsAvailable: boolean = `google` in globalThis;
	public readonly searchAddressLog = new SandboxEventLog();

	public readonly copyAccountNumber: WritableSignal<string> = signal<string>(`62 0000 1234 5678`);

	public readonly clickElsewhereLog = new SandboxEventLog();
	public readonly insideClicks: WritableSignal<number> = signal<number>(0);

	public readonly trustedFrameUrl: string = `data:text/html;charset=utf-8,${encodeURIComponent(TRUSTED_FRAME_HTML)}`;

	public onAccordionExpanded(expanded: boolean): void {
		this.accordionLog.add(`expandedItem: ${String(expanded)}`);
	}

	public onAddressUpdated(results: _AddressResult[]): void {
		const summary: string = results.map((result: _AddressResult): string => `${result.type}=${result.long_name}`).join(`, `);
		this.searchAddressLog.add(`updateAddress: ${summary}`);
	}

	public onManualAddress(value: string): void {
		this.searchAddressLog.add(`manualUpdateAddress: ${value}`);
	}

	public onInsideClick(): void {
		this.insideClicks.update((count: number): number => count + 1);
		this.clickElsewhereLog.add(`inside click #${String(this.insideClicks())} (no output)`);
	}

	public onClickElsewhere(event: MouseEvent): void {
		const target: string = event.target instanceof HTMLElement ? event.target.tagName.toLowerCase() : `unknown`;
		this.clickElsewhereLog.add(`clickElsewhere: target <${target}>`);
	}
}
