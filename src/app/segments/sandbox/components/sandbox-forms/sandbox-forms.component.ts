import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal, WritableSignal } from "@angular/core";
import { email, FieldTree, form, FormField, FormRoot, max, min, minLength, pattern, required, SchemaPathTree, validate, ValidationError } from "@angular/forms/signals";
import { SandboxDemoComponent } from "@segments/sandbox/components/sandbox-demo/sandbox-demo.component";
import { SandboxPageComponent } from "@segments/sandbox/components/sandbox-page/sandbox-page.component";
import { _SandboxEventLog } from "@segments/sandbox/models/sandbox-event-log";

/** Model behind the Signal Forms reference demo. */
export interface _SandboxContactModel {
	name: string;
	email: string;
	age: number | null;
	/** `email` or `phone`; drives the cross-field rule on `phone`. */
	contactMethod: string;
	phone: string;
	acceptTerms: boolean;
}

const INITIAL_CONTACT: _SandboxContactModel = {
	name: ``,
	email: ``,
	age: null,
	contactMethod: `email`,
	phone: ``,
	acceptTerms: false,
};

/** Validation rules for the contact form (schema function passed to `form()`). */
function contactSchema(path: SchemaPathTree<_SandboxContactModel>): void {
	required(path.name, { message: `Name is required.` });
	minLength(path.name, 2, { message: `Name must be at least 2 characters.` });
	required(path.email, { message: `Email is required.` });
	email(path.email, { message: `Enter a valid email address.` });
	required(path.age, { message: `Age is required.` });
	min(path.age, 18, { message: `You must be 18 or older.` });
	max(path.age, 120, { message: `Age must be 120 or less.` });
	// Cross-field rule: phone is only required when the selected contact method is phone.
	required(path.phone, {
		message: `Phone is required when the contact method is phone.`,
		when: (ctx): boolean => ctx.valueOf(path.contactMethod) === `phone`,
	});
	pattern(path.phone, /^\+?[0-9 ]{7,15}$/, { message: `Phone must be 7-15 digits (spaces and a leading + allowed).` });
	validate(path.acceptTerms, ({ value }): ValidationError.WithoutFieldTree | undefined => (value() ? undefined : { kind: `terms`, message: `You must accept the terms.` }));
}

@Component({
	selector: "app-sandbox-forms",
	templateUrl: "./sandbox-forms.component.html",
	styleUrls: ["./sandbox-forms.component.scss"],
	imports: [JsonPipe, FormField, FormRoot, SandboxPageComponent, SandboxDemoComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxFormsComponent {
	public readonly submitLog = new _SandboxEventLog();

	/** Source of truth: the form reads and writes this signal directly. */
	public readonly contactModel: WritableSignal<_SandboxContactModel> = signal<_SandboxContactModel>({ ...INITIAL_CONTACT });

	public readonly contactForm: FieldTree<_SandboxContactModel> = form(this.contactModel, contactSchema, {
		submission: {
			action: (field: FieldTree<_SandboxContactModel>): Promise<undefined> => {
				this.submitLog.add(`submit (valid): ${JSON.stringify(field().value())}`);
				return Promise.resolve(undefined);
			},
			onInvalid: (field: FieldTree<_SandboxContactModel>): void => {
				this.submitLog.add(`submit blocked: ${String(field().errorSummary().length)} error(s)`);
			},
		},
	});

	/** Restores the initial model and clears touched/dirty state. */
	public onReset(): void {
		this.contactForm().reset({ ...INITIAL_CONTACT });
		this.submitLog.add(`reset`);
	}
}
