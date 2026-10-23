import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ObscureTextPipe } from "./obscure-text.pipe";

@NgModule({
	declarations: [ObscureTextPipe],
	imports: [CommonModule],
	exports: [ObscureTextPipe],
})
export class ObscureTextModule {}
