import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: "home",
	},
	{
		path: "home",
		loadComponent: () => import("./segments/landing/components/landing/landing.component").then((m) => m.LandingComponent),
	},
	{
		path: "contact-us",
		loadComponent: () => import("./segments/contact/components/contact/contact.component").then((m) => m.ContactComponent),
	},
	{
		path: "**",
		loadComponent: () => import("./segments/not-found/components/not-found/not-found.component").then((m) => m.NotFoundComponent),
	},
];
