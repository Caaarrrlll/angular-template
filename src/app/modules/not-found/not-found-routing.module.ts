import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "src/app/modules/not-found/components/not-found/not-found.component";

const routes: Routes = [
	{
		path: "",
		component: NotFoundComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class NotFoundRoutingModule {}
