import cors from "@fastify/cors";
import Fastify from "fastify";
import "reflect-metadata";
import { registerController } from "./decorators/route.decorator";
import { HomeController } from "./home/home.controller";

const fastify = Fastify({ logger: false });

// Enable CORS
fastify.register(cors, { origin: true });

// Register controllers
registerController(fastify, HomeController);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server is listening on ${address}`);
});
