import { CommonModule, CurrencyPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormatAnalyticsPipe } from "@pipes/analytics-format/analytics-format.pipe";
import { FormatAnalyticsModule } from "@pipes/analytics-format/format-analytics.module";
import { ApiResponsePipe } from "@shared/pipes/api-response/api-response.pipe";
import { CharacterSpacingPipe } from "@pipes/character-spacing.pipe";
import { ContainsPipe } from "@pipes/contains.pipe";
import { EmailToInitialsPipe } from "@pipes/email-to-initials.pipe";
import { FilterPipe } from "@pipes/filter.pipe";
import { GroupByDatePipe } from "@pipes/group-by-date.pipe";
import { HideTradeRetailModule } from "@pipes/hide-trade-retail-pipe/hide-trade-retail.module";
import { HideTradeRetailPipe } from "@pipes/hide-trade-retail-pipe/hide-trade-retail.pipe";
import { HighlightSearchMatchPipe } from "@pipes/highlight-search-match.pipe";
import { KebabToTitlePipe } from "@pipes/kebab-to-title.pipe";
import { NameToInitialsPipe } from "@pipes/name-to-initials.pipe";
import { NearestPipe } from "@pipes/nearest.pipe";
import { OrderByPipe } from "@pipes/order-by.pipe";
import { OrdinalPipe } from "@pipes/ordinal.pipe";
import { PercentagePipe } from "@pipes/percentage.pipe";
import { RemoveEmailDomainPipe } from "@pipes/remove-email-domain.pipe";
import { ArraySortPipe } from "@pipes/sort.pipe";
import { TimeElapsedFormatPipe } from "@pipes/time-elapsed.pipe";
import { TimeFormatPipe } from "@pipes/time-format.pipe";
import { TimeInStringModule } from "@pipes/time-in-string-pipe/time-in-string.module";
import { TimeInStringPipe } from "@pipes/time-in-string-pipe/time-in-string.pipe";
import { TimeMaskPipe } from "@pipes/time-mask.pipe";
import { ToNumberPipe } from "@pipes/to-number.pipe";
import { TrimCharactersPipe } from "@pipes/trim-characters.pipe";

@NgModule({
	imports: [CommonModule, ApiResponsePipe, HideTradeRetailModule, FormatAnalyticsModule, TimeInStringModule],
	declarations: [
		KebabToTitlePipe,
		RemoveEmailDomainPipe,
		CharacterSpacingPipe,
		HighlightSearchMatchPipe,
		TrimCharactersPipe,
		GroupByDatePipe,
		ContainsPipe,
		FilterPipe,
		TimeElapsedFormatPipe,
		PercentagePipe,
		OrderByPipe,
		ArraySortPipe,
		NameToInitialsPipe,
		EmailToInitialsPipe,
		TimeMaskPipe,
		TimeFormatPipe,
		OrdinalPipe,
		ToNumberPipe,
		NearestPipe,
	],
	exports: [
		KebabToTitlePipe,
		RemoveEmailDomainPipe,
		CharacterSpacingPipe,
		HighlightSearchMatchPipe,
		ApiResponsePipe,
		TrimCharactersPipe,
		GroupByDatePipe,
		ContainsPipe,
		FilterPipe,
		TimeElapsedFormatPipe,
		PercentagePipe,
		OrderByPipe,
		ArraySortPipe,
		NameToInitialsPipe,
		EmailToInitialsPipe,
		TimeMaskPipe,
		TimeFormatPipe,
		CurrencyPipe,
		OrdinalPipe,
		ToNumberPipe,
		NearestPipe,
		HideTradeRetailPipe,
		FormatAnalyticsPipe,
		TimeInStringPipe,
	],
})
export class PipesModule {}
