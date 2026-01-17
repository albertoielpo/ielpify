import { FastifyReply, FastifyRequest } from "fastify";
import { Inject } from "../decorators/injectable.decorator";
import { Controller, Get } from "../decorators/route.decorator";
import { AnotherService } from "../shared/service/another.service";
import { HomeService } from "./home.service";

@Controller("hello")
export class HomeController {
    constructor(
        private homeService: HomeService, // this is not injectable and requires an explicit new
        @Inject(AnotherService) private anotherService: AnotherService // this is automatically created as singleton
    ) {
        this.homeService = new HomeService();
    }

    @Get("world")
    helloWorld(req: FastifyRequest, res: FastifyReply) {
        const q = req.query as Record<string, string>;
        console.log(q.par1);
        const isMyHome = this.homeService.isMyHome();

        return res.send({
            hello: "world",
            isMyHome,
            timestamp: this.anotherService.timestamp()
        });
    }
}
