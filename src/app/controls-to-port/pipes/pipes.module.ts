import { CommonModule, CurrencyPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { AbsolutePipe } from "@pipes/absolute.pipe";
import { FormatAnalyticsPipe } from "@pipes/analytics-format/analytics-format.pipe";
import { FormatAnalyticsModule } from "@pipes/analytics-format/format-analytics.module";
import { ApiResponsePipe } from "@shared/pipes/api-response/api-response.pipe";
import { CamelToTitlePipe } from "@pipes/camel-to-title.pipe";
import { CharacterSpacingPipe } from "@pipes/character-spacing.pipe";
import { ContainsPipe } from "@pipes/contains.pipe";
import { CurrencyInStringModule } from "@pipes/currency-in-string-pipe/currency-in-string.module";
import { CurrencyInStringPipe } from "@pipes/currency-in-string-pipe/currency-in-string.pipe";
import { DayAndHoursModule } from "@pipes/day-and-hour-pipe/day-and-hours.module";
import { EmailToInitialsPipe } from "@pipes/email-to-initials.pipe";
import { FilterPipe } from "@pipes/filter.pipe";
import { FormatNullTextPipe } from "@pipes/format-null-pipe/format-null-text.pipe";
import { FormatNullModule } from "@pipes/format-null-pipe/format-null.module";
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
import { RoundToNthModule } from "@pipes/round-to-nth-pipe/round-to-nth.module";
import { RoundToNthPipe } from "@pipes/round-to-nth-pipe/round-to-nth.pipe";
import { SafePipe } from "@pipes/safe.pipe";
import { ArraySortPipe } from "@pipes/sort.pipe";
import { SpaceBetweenUppercaseModule } from "@pipes/space-between-uppercase-pipe/space-between-uppercase.module";
import { SpaceBetweenUppercase } from "@pipes/space-between-uppercase-pipe/space-between-uppercase.pipe";
import { ThousandSeparatorModule } from "@pipes/thousand-separator-pipe/thousand-separator.module";
import { ThousandSeparatorPipe } from "@pipes/thousand-separator-pipe/thousand-separator.pipe";
import { TimeElapsedFormatPipe } from "@pipes/time-elapsed.pipe";
import { TimeFormatPipe } from "@pipes/time-format.pipe";
import { TimeInStringModule } from "@pipes/time-in-string-pipe/time-in-string.module";
import { TimeInStringPipe } from "@pipes/time-in-string-pipe/time-in-string.pipe";
import { TimeMaskPipe } from "@pipes/time-mask.pipe";
import { ToNumberPipe } from "@pipes/to-number.pipe";
import { TrimCharactersPipe } from "@pipes/trim-characters.pipe";
import { RemoveUnderscorePipe } from "@pipes/underscore-to-title.pipe";
import { DayAndHoursPipe } from "./day-and-hour-pipe/day-and-hours.pipe";

@NgModule({
	imports: [
		CommonModule,
		ApiResponsePipe,
		ThousandSeparatorModule,
		FormatNullModule,
		DayAndHoursModule,
		RoundToNthModule,
		HideTradeRetailModule,
		SpaceBetweenUppercaseModule,
		FormatAnalyticsModule,
		CurrencyInStringModule,
		TimeInStringModule,
	],
	declarations: [
		CamelToTitlePipe,
		KebabToTitlePipe,
		SafePipe,
		RemoveEmailDomainPipe,
		CharacterSpacingPipe,
		HighlightSearchMatchPipe,
		TrimCharactersPipe,
		GroupByDatePipe,
		ContainsPipe,
		FilterPipe,
		TimeElapsedFormatPipe,
		PercentagePipe,
		RemoveUnderscorePipe,
		OrderByPipe,
		ArraySortPipe,
		NameToInitialsPipe,
		EmailToInitialsPipe,
		AbsolutePipe,
		TimeMaskPipe,
		TimeFormatPipe,
		OrdinalPipe,
		ToNumberPipe,
		NearestPipe,
	],
	exports: [
		CamelToTitlePipe,
		KebabToTitlePipe,
		SafePipe,
		FormatNullTextPipe,
		RemoveEmailDomainPipe,
		CharacterSpacingPipe,
		HighlightSearchMatchPipe,
		ApiResponsePipe,
		ThousandSeparatorPipe,
		TrimCharactersPipe,
		GroupByDatePipe,
		ContainsPipe,
		FilterPipe,
		TimeElapsedFormatPipe,
		PercentagePipe,
		RemoveUnderscorePipe,
		OrderByPipe,
		ArraySortPipe,
		NameToInitialsPipe,
		EmailToInitialsPipe,
		SpaceBetweenUppercase,
		AbsolutePipe,
		RoundToNthPipe,
		TimeMaskPipe,
		TimeFormatPipe,
		CurrencyPipe,
		OrdinalPipe,
		DayAndHoursPipe,
		ToNumberPipe,
		NearestPipe,
		HideTradeRetailPipe,
		FormatAnalyticsPipe,
		CurrencyInStringPipe,
		TimeInStringPipe,
	],
})
export class PipesModule {}
