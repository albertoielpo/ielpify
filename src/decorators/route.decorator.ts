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

// Controller decorator
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

// HTTP method decorators
export const Get = createMethodDecorator("get");
export const Post = createMethodDecorator("post");
export const Put = createMethodDecorator("put");
export const Delete = createMethodDecorator("delete");
export const Patch = createMethodDecorator("patch");

// Controller class type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ControllerClass = new (...args: any[]) => object;

// Register controller routes with Fastify
export function registerController(
    fastify: FastifyInstance,
    controllerClass: ControllerClass
): void {
    const controller = createWithInjection(controllerClass);
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
