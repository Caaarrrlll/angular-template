import { Service } from "@angular/core";
import { environment } from "../../../environments/environment";

@Service()
export class LoggerService {
    private readonly isProduction: boolean = environment.environmentName === "production";

    /*
        Log informational messages
        @param message - The message to log
    */
    log(message: unknown): void {
        if (!this.isProduction) {
            console.log(`[LOG] ${message}`);
        }
    }

    warn(message: unknown): void {
        if (!this.isProduction) {
            console.warn(`[WARN] ${message}`);
        }
    }

    error(message: unknown): void {
        if (!this.isProduction) {
            console.error(`[ERROR] ${message}`);
        }
    }

    info(message: unknown): void {
        if (!this.isProduction) {
            console.info(`[INFO] ${message}`);
        }
    }

    debug(message: unknown): void {
        if (!this.isProduction) {
            console.debug(`[DEBUG] ${message}`);
        }
    }

    table(data: unknown): void {
        if (!this.isProduction) {
            console.table(data);
        }
    }

    time(label: string): void {
        if (!this.isProduction) {
            console.time(label);
        }
    }

    timeEnd(label: string): void {
        if (!this.isProduction) {
            console.timeEnd(label);
        }
    }

    dir(object: unknown): void {
        if (!this.isProduction) {
            console.dir(object);
        }
    }
}
