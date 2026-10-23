import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CUSTLoaderComponent } from "@controls/cust-loader/loader/cust-loader.component";

@NgModule({
	imports: [CommonModule],
	declarations: [CUSTLoaderComponent],
	exports: [CUSTLoaderComponent,],
})
export class CustLoaderModule {}
