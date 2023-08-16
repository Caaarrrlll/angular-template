import { LayoutModule } from "@angular/cdk/layout";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavigationComponent } from "./components/navigation/navigation.component";

const materialModules = [
	MatButtonModule,
	MatToolbarModule,
	MatIconModule,
	MatSidenavModule,
	MatListModule,
	MatMenuModule,
	MatCardModule,
	MatFormFieldModule,
	MatInputModule,
	MatSnackBarModule,
];

@NgModule({
	declarations: [AppComponent, NavigationComponent],
	imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, ...materialModules, LayoutModule],
	providers: [],
	bootstrap: [AppComponent],
	exports: [...materialModules],
})
export class AppModule {}
