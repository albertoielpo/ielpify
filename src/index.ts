import "reflect-metadata";

// Dependency Injection
export {
    createWithInjection,
    Inject,
    Injectable,
    isInjectable,
    registerService,
    resolveService
} from "./decorators/injectable.decorator.js";

// Routing
export {
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    registerController
} from "./decorators/route.decorator.js";
