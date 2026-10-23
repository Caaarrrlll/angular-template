# Service Contracts

This file documents the shared services in `src/app/library/services`. Review it before creating a new service, and update it whenever a service is added, changed, or removed.

## Service Index

| Service | File | Provided by | Summary |
| --- | --- | --- | --- |
| `LoggerService` | `logger.service.ts` | `@Service()` | Central logging service; suppresses output in production. |

## LoggerService

- **Purpose:** Provides the application-wide logging API so application code does not call `console` directly.
- **Injection:** Use `inject(LoggerService)` or constructor injection.
- **Production behaviour:** Every method is a no-op when `environment.environmentName === "production"`.
- **Public API:**

| Method | Signature | Output |
| --- | --- | --- |
| `log` | `log(message: unknown): void` | `console.log` |
| `warn` | `warn(message: unknown): void` | `console.warn` |
| `error` | `error(message: unknown): void` | `console.error` |
| `info` | `info(message: unknown): void` | `console.info` |
| `debug` | `debug(message: unknown): void` | `console.debug` |
| `table` | `table(data: unknown): void` | `console.table` |
| `time` | `time(label: string): void` | `console.time` |
| `timeEnd` | `timeEnd(label: string): void` | `console.timeEnd` |
| `dir` | `dir(object: unknown): void` | `console.dir` |

- **Example:**

  ```ts
  import { inject } from "@angular/core";
  import { LoggerService } from "@shared/services/logger.service";

  private readonly logger = inject(LoggerService);

  this.logger.error(error);
  ```
