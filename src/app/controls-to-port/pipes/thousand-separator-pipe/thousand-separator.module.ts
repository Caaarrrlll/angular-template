import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ThousandSeparatorPipe } from "@pipes/thousand-separator-pipe/thousand-separator.pipe";

@NgModule({
	declarations: [ThousandSeparatorPipe],
	exports: [ThousandSeparatorPipe],
	imports: [CommonModule],
})
export class ThousandSeparatorModule {}
