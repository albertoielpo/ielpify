import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createWithInjection } from "./injectable.decorator";

// Metadata keys
const ROUTES_METADATA = Symbol("routes");
const CONTROLLER_PREFIX = Symbol("controller_prefix");

// Route handler type
type RouteHandler = (req: FastifyRequest, res: FastifyReply) => unknown;

// Normalize path to ensure it starts with "/"
function normalizePath(path: string): string {
    if (!path) return "";
    return path.startsWith("/") ? path : `/${path}`;
}

// Route definition
type RouteDefinition = {
    method: "get" | "post" | "put" | "delete" | "patch";
    path: string;
    handlerName: string;
};

/**
 * Marks a class as a controller with an optional route prefix.
 * @param prefix - The base path prefix for all routes in this controller
 * @returns A class decorator
 */
export function Controller(prefix: string = ""): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(
            CONTROLLER_PREFIX,
            normalizePath(prefix),
            target
        );
        if (!Reflect.hasMetadata(ROUTES_METADATA, target)) {
            Reflect.defineMetadata(ROUTES_METADATA, [], target);
        }
    };
}

// Factory for HTTP method decorators
function createMethodDecorator(method: RouteDefinition["method"]) {
    return (path: string = ""): MethodDecorator => {
        return (target, propertyKey) => {
            const constructor = target.constructor;
            const routes: RouteDefinition[] = Reflect.hasMetadata(
                ROUTES_METADATA,
                constructor
            )
                ? Reflect.getMetadata(ROUTES_METADATA, constructor)
                : [];

            routes.push({
                method,
                path: normalizePath(path),
                handlerName: String(propertyKey)
            });

            Reflect.defineMetadata(ROUTES_METADATA, routes, constructor);
        };
    };
}

/**
 * Marks a method as a GET route handler.
 * @param path - The route path (optional)
 * @returns A method decorator
 */
export const Get = createMethodDecorator("get");

/**
 * Marks a method as a POST route handler.
 * @param path - The route path (optional)
 * @returns A method decorator
 */
export const Post = createMethodDecorator("post");

/**
 * Marks a method as a PUT route handler.
 * @param path - The route path (optional)
 * @returns A method decorator
 */
export const Put = createMethodDecorator("put");

/**
 * Marks a method as a DELETE route handler.
 * @param path - The route path (optional)
 * @returns A method decorator
 */
export const Delete = createMethodDecorator("delete");

/**
 * Marks a method as a PATCH route handler.
 * @param path - The route path (optional)
 * @returns A method decorator
 */
export const Patch = createMethodDecorator("patch");

// Controller class type
type ControllerClass = new (...args: any[]) => object;

// Store registered controller instances
const controllerInstances: object[] = [];

/**
 * Registers a controller with a Fastify instance.
 * Creates the controller with dependency injection and sets up all routes.
 * @param fastify - The Fastify instance
 * @param controllerClass - The controller class to register
 */
export function registerController(
    fastify: FastifyInstance,
    controllerClass: ControllerClass
): void {
    const controller = createWithInjection(controllerClass);
    controllerInstances.push(controller);
    const prefix: string =
        Reflect.getMetadata(CONTROLLER_PREFIX, controllerClass) || "";
    const routes: RouteDefinition[] =
        Reflect.getMetadata(ROUTES_METADATA, controllerClass) || [];

    for (const route of routes) {
        const fullPath = `${prefix}${route.path}` || "/";
        const handler = (controller as Record<string, RouteHandler>)[
            route.handlerName
        ].bind(controller);

        fastify[route.method](fullPath, handler);
    }
}

/**
 * Returns all registered controller instances.
 * Useful for applying lifecycle operations to all controllers.
 * @returns An array of all registered controller instances
 */
export function getControllerInstances(): object[] {
    return controllerInstances;
}
