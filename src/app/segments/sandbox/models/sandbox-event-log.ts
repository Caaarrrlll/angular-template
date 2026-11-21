import { Signal, signal, WritableSignal } from "@angular/core";

/** Small in-memory output log used by sandbox demos to make control outputs visible. */
export class _SandboxEventLog {
	private readonly _entries: WritableSignal<string[]> = signal<string[]>([]);

	public readonly entries: Signal<string[]> = this._entries.asReadonly();

	public constructor(private readonly maxEntries = 8) {}

	public add(message: string): void {
		const time = new Date().toLocaleTimeString();
		this._entries.update((entries) => [`${time}  ${message}`, ...entries].slice(0, this.maxEntries));
	}

	public clear(): void {
		this._entries.set([]);
	}
}
