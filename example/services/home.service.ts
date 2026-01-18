/**
 * This service is NOT decorated with @Injectable().
 * Each controller that uses it must instantiate it manually with `new`.
 * A new instance is created for each controller.
 */
export class HomeService {
    private readonly createdAt: number;

    constructor() {
        this.createdAt = Date.now();
        console.log(`[New Instance] HomeService created at ${this.createdAt}`);
    }

    /**
     * Returns the timestamp when this instance was created.
     * This value will be DIFFERENT for each controller, proving
     * that each controller has its own instance.
     */
    getInstanceId(): number {
        return this.createdAt;
    }
}
