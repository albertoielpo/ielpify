// DI Container - stores singleton instances
const container = new Map<new () => object, object>();

// Metadata key for marking classes as injectable
const INJECTABLE_METADATA = Symbol("injectable");

// Injectable decorator - marks a class as a singleton service
export function Injectable(): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
    };
}

// Check if a class is injectable
export function isInjectable(target: new () => object): boolean {
    return Reflect.getMetadata(INJECTABLE_METADATA, target) === true;
}

// Register a service in the container
export function registerService<T extends object>(
    serviceClass: new () => T
): void {
    if (!container.has(serviceClass)) {
        container.set(serviceClass, new serviceClass());
    }
}

// Resolve a service from the container (creates if not exists)
export function resolveService<T extends object>(
    serviceClass: new () => T
): T {
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

// Inject decorator - marks a constructor parameter for injection
export function Inject(
    serviceClass: new () => object
): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        const existingInjections: Map<number, new () => object> =
            Reflect.getMetadata("injections", target) || new Map();
        existingInjections.set(parameterIndex, serviceClass);
        Reflect.defineMetadata("injections", existingInjections, target);
    };
}

// Create an instance with dependencies injected
export function createWithInjection<T extends object>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
