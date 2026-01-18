/**
 * Options for the @Timeout decorator.
 */
export type TimeoutOptions = {
    /** Delay in milliseconds between each execution. */
    ms: number;
    /**
     * Number of times to execute the method.
     * Use -1 for infinite executions.
     * @default 1
     */
    times?: number;
};

const TIMEOUT_METADATA = Symbol("timeout");

type TimeoutMetadata = {
    propertyKey: string | symbol;
    options: TimeoutOptions;
};

/**
 * Schedules a method to run repeatedly with a delay.
 * The method will be executed after the initial delay, then repeat based on the times option.
 * @param options - Configuration options for the timeout
 * @returns A method decorator
 */
export function Timeout(options: TimeoutOptions): MethodDecorator {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
        const existingTimeouts: TimeoutMetadata[] =
            Reflect.getMetadata(TIMEOUT_METADATA, target.constructor) || [];
        existingTimeouts.push({ propertyKey, options });
        Reflect.defineMetadata(TIMEOUT_METADATA, existingTimeouts, target.constructor);
        return descriptor;
    };
}

/**
 * Starts all @Timeout decorated methods on an instance.
 * Call this after instantiating a class to begin scheduled executions.
 * @param instance - The object instance containing @Timeout decorated methods
 */
export function startTimeouts(instance: object): void {
    const timeouts: TimeoutMetadata[] =
        Reflect.getMetadata(TIMEOUT_METADATA, instance.constructor) || [];

    for (const { propertyKey, options } of timeouts) {
        const method = (instance as Record<string | symbol, unknown>)[propertyKey];
        if (typeof method === "function") {
            const times = options.times ?? 1;
            let executionCount = 0;

            const execute = () => {
                if (times === -1 || executionCount < times) {
                    executionCount++;
                    method.call(instance);

                    if (times === -1 || executionCount < times) {
                        setTimeout(execute, options.ms);
                    }
                }
            };

            setTimeout(execute, options.ms);
        }
    }
}
