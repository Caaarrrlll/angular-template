import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormatNullTextPipe } from "@pipes/format-null-pipe/format-null-text.pipe";

@NgModule({
	declarations: [FormatNullTextPipe],
	exports: [FormatNullTextPipe],
	imports: [CommonModule],
})
export class FormatNullModule {}
