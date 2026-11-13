import { Component, DestroyRef, Input, OnDestroy, OnInit, inject } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { _DeconstructedFlatView } from "../gallery.models";

@Component({
	selector: "app-evaluation-comparison",
	template: `
		@for (view of views; track $index) {
			<div class="evaluationComparisonColumn">
				@for (entry of entries(view); track entry.key) {
					<div class="evaluationComparisonRow">
						<span class="evaluationComparisonLabel">{{ entry.key }}</span>
						<span class="evaluationComparisonValue">{{ entry.value }}</span>
					</div>
				}
			</div>
		}
	`,
	styles: [
		`
			.evaluationComparisonColumn {
				display: flex;
				flex-direction: column;
				gap: 4px;
				margin: auto;
			}

			.evaluationComparisonRow {
				display: flex;
				gap: 12px;
				justify-content: space-between;
			}

			.evaluationComparisonLabel {
				font-weight: bold;
			}
		`,
	],
})
export class EvaluationComparisonComponent implements OnInit, OnDestroy {
	@Input() public buyleadCode: string = "";
	@Input() public flatViewCompare: Array<Observable<_DeconstructedFlatView>> = [];

	public views: _DeconstructedFlatView[] = [];

	private readonly destroyRef = inject(DestroyRef);

	public ngOnInit(): void {
		if (this.flatViewCompare.length > 0) {
			combineLatest(this.flatViewCompare)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((views: _DeconstructedFlatView[]): void => {
					this.views = views;
				});
		}
	}

	public ngOnDestroy(): void {
		this.views = [];
	}

	public entries(view: _DeconstructedFlatView): { key: string; value: unknown }[] {
		return Object.entries(view).map(([key, value]: [string, unknown]): { key: string; value: unknown } => ({ key, value }));
	}
}
