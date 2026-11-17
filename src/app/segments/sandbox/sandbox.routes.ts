import { Routes } from "@angular/router";

/** Lazy sandbox routes: index page + one lazily loaded page per control family. */
export const SANDBOX_ROUTES: Routes = [
	{
		path: ``,
		loadComponent: () => import("@segments/sandbox/components/sandbox/sandbox.component").then((m) => m.SandboxComponent),
	},
	{
		path: `buttons`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-buttons/sandbox-buttons.component").then((m) => m.SandboxButtonsComponent),
	},
	{
		path: `inputs`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-inputs/sandbox-inputs.component").then((m) => m.SandboxInputsComponent),
	},
	{
		path: `data-display`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-data-display/sandbox-data-display.component").then((m) => m.SandboxDataDisplayComponent),
	},
	{
		path: `cards`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-cards/sandbox-cards.component").then((m) => m.SandboxCardsComponent),
	},
	{
		path: `small-controls`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-small-controls/sandbox-small-controls.component").then((m) => m.SandboxSmallControlsComponent),
	},
	{
		path: `media`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-media/sandbox-media.component").then((m) => m.SandboxMediaComponent),
	},
	{
		path: `tabs`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-tabs/sandbox-tabs.component").then((m) => m.SandboxTabsComponent),
	},
	{
		path: `selection`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-selection/sandbox-selection.component").then((m) => m.SandboxSelectionComponent),
	},
	{
		path: `dialogs`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-dialogs/sandbox-dialogs.component").then((m) => m.SandboxDialogsComponent),
	},
	{
		path: `upload`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-upload/sandbox-upload.component").then((m) => m.SandboxUploadComponent),
	},
	{
		path: `tables`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-tables/sandbox-tables.component").then((m) => m.SandboxTablesComponent),
	},
	{
		path: `misc`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-misc/sandbox-misc.component").then((m) => m.SandboxMiscComponent),
	},
	{
		path: `forms`,
		loadComponent: () => import("@segments/sandbox/components/sandbox-forms/sandbox-forms.component").then((m) => m.SandboxFormsComponent),
	},
];
