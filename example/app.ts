import { registerController } from "@albertoielpo/ielpify";
import Fastify from "fastify";
import { AnotherController } from "./controllers/another.controller";
import { HomeController } from "./controllers/home.controller";

const fastify = Fastify();

// Register controllers
registerController(fastify, HomeController);
registerController(fastify, AnotherController);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server is listening on ${address}`);
});
