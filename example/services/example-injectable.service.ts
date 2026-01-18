import { Injectable, Timeout } from "@albertoielpo/ielpify";

/**
 * This service is decorated with @Injectable(), making it a singleton.
 * The same instance will be shared across all controllers that inject it.
 * Notice: the constructor log will only appear ONCE, even if multiple
 * controllers inject this service.
 */
@Injectable()
export class ExampleInjectableService {
    private readonly createdAt: number;

    constructor() {
        this.createdAt = Date.now();
        console.log(
            `[Singleton] ExampleInjectableService created at ${this.createdAt}`
        );
    }

    /**
     * Returns the timestamp when this singleton instance was created.
     * This value will be the same across all controllers, proving
     * that they share the same instance.
     */
    getInstanceId(): number {
        return this.createdAt;
    }

    /**
     * Example of the @Timeout decorator.
     * Executes 3 times, with a 5-second delay between each execution.
     */
    @Timeout({ ms: 5000, times: 3 })
    timeoutExample(): void {
        console.log(`Execute timeout at ${Date.now()}`);
    }
}
