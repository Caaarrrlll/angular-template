import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PostfixPipe } from "@pipes/postfix/postfix.pipe";

@NgModule({
	declarations: [PostfixPipe],
	exports: [PostfixPipe],
	imports: [CommonModule],
})
export class PostfixModule {}
