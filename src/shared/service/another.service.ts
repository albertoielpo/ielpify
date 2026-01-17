import { Injectable } from "../../decorators/injectable.decorator";

@Injectable()
export class AnotherService {
    timestamp(): number {
        return Date.now();
    }
}
