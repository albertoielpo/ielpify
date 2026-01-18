import "reflect-metadata";

// Dependency Injection
export {
    createWithInjection,
    getContainerInstances,
    Inject,
    Injectable,
    isInjectable,
    registerService,
    resolveService
} from "./decorators/injectable.decorator.js";

export {
    startTimeouts,
    Timeout,
    TimeoutOptions
} from "./decorators/timeout.decorator.js";

// Routing
export {
    Controller,
    Delete,
    Get,
    getControllerInstances,
    Patch,
    Post,
    Put,
    registerController
} from "./decorators/route.decorator.js";
