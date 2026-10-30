import { provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
	providers: [provideZoneChangeDetection(), provideRouter(routes)],
}).catch((err) => console.error(err));
