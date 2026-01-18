import { Controller, Get, Inject } from "@albertoielpo/ielpify";
import { FastifyReply, FastifyRequest } from "fastify";
import { ExampleInjectableService } from "../services/example-injectable.service";
import { HomeService } from "../services/home.service";

// curl http://localhost:3000/another/world
@Controller("another")
export class AnotherController {
    constructor(
        // HomeService is NOT @Injectable, so we must instantiate it manually.
        // This creates a NEW instance for this controller only.
        private homeService: HomeService,

        // ExampleInjectableService IS @Injectable, so it's automatically
        // injected as a singleton. The SAME instance is shared with
        // HomeController - no new instance is created here.
        @Inject(ExampleInjectableService)
        private exampleService: ExampleInjectableService
    ) {
        this.homeService = new HomeService();
    }

    @Get("world")
    helloWorld(req: FastifyRequest, res: FastifyReply) {
        return res.send({
            controller: "AnotherController",
            // This ID will be DIFFERENT from HomeController (new instance each time)
            homeServiceInstanceId: this.homeService.getInstanceId(),
            // This ID will be THE SAME as HomeController (singleton)
            exampleServiceInstanceId: this.exampleService.getInstanceId()
        });
    }
}
