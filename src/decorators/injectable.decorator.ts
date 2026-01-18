// DI Container - stores singleton instances
const container = new Map<new () => object, object>();

// Metadata key for marking classes as injectable
const INJECTABLE_METADATA = Symbol("injectable");

/**
 * Marks a class as a singleton service for dependency injection.
 * Classes decorated with @Injectable() will have a single instance
 * shared across all consumers.
 * @returns A class decorator
 */
export function Injectable(): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
    };
}

/**
 * Checks if a class is decorated with @Injectable().
 * @param target - The class to check
 * @returns True if the class is injectable, false otherwise
 */
export function isInjectable(target: new () => object): boolean {
    return Reflect.getMetadata(INJECTABLE_METADATA, target) === true;
}

/**
 * Registers a service in the DI container.
 * If the service is not already registered, it will be instantiated.
 * @param serviceClass - The service class to register
 */
export function registerService<T extends object>(
    serviceClass: new () => T
): void {
    resolveService(serviceClass);
}

/**
 * Resolves a service from the DI container.
 * Creates a new instance if the service is not already registered.
 * @param serviceClass - The service class to resolve
 * @returns The singleton instance of the service
 * @throws Error if the class is not decorated with @Injectable()
 */
export function resolveService<T extends object>(serviceClass: new () => T): T {
    if (!isInjectable(serviceClass)) {
        throw new Error(
            `${serviceClass.name} is not injectable. Add @Injectable() decorator.`
        );
    }
    if (!container.has(serviceClass)) {
        container.set(serviceClass, new serviceClass());
    }
    return container.get(serviceClass) as T;
}

/**
 * Marks a constructor parameter for dependency injection.
 * @param serviceClass - The service class to inject
 * @returns A parameter decorator
 */
export function Inject(serviceClass: new () => object): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        const existingInjections: Map<number, new () => object> =
            Reflect.getMetadata("injections", target) || new Map();
        existingInjections.set(parameterIndex, serviceClass);
        Reflect.defineMetadata("injections", existingInjections, target);
    };
}

/**
 * Creates an instance of a class with its dependencies automatically injected.
 * @param targetClass - The class to instantiate
 * @returns A new instance with all @Inject() dependencies resolved
 */
export function createWithInjection<T extends object>(
    targetClass: new (...args: any[]) => T
): T {
    const injections: Map<number, new () => object> =
        Reflect.getMetadata("injections", targetClass) || new Map();

    // Build constructor arguments from injections
    const args: object[] = [];
    injections.forEach((serviceClass, index) => {
        args[index] = resolveService(serviceClass);
    });

    return new targetClass(...args);
}

/**
 * Returns all instances currently stored in the DI container.
 * Useful for applying lifecycle operations to all services.
 * @returns An array of all registered service instances
 */
export function getContainerInstances(): object[] {
    return Array.from(container.values());
}
