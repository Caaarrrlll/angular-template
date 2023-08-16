import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
		path: "",
		loadChildren: () => import("./modules/landing/landing.module").then((m) => m.LandingModule),
	},
	{
		path: "home",
		loadChildren: () => import("./modules/landing/landing.module").then((m) => m.LandingModule),
	},
	{
		path: "contact-us",
		loadChildren: () => import("./modules/contact/contact.module").then((m) => m.ContactModule),
	},
	{
		path: "**",
		loadChildren: () => import("./modules/not-found/not-found.module").then((m) => m.NotFoundModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
