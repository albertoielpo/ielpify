# @albertoielpo/ielpify

TypeScript decorators for Fastify: controllers, routing, and simple dependency injection.

## Installation

```bash
npm install @albertoielpo/ielpify
npm install reflect-metadata fastify  # peer dependencies
```

## Decorators

### Routing

- `@Controller(prefix?)` - Define a controller with optional route prefix
- `@Get(path?)`, `@Post(path?)`, `@Put(path?)`, `@Delete(path?)`, `@Patch(path?)` - HTTP method decorators

### Dependency Injection

- `@Injectable()` - Mark a class as a singleton service
- `@Inject(ServiceClass)` - Inject a dependency

### Functions

- `registerController(fastify, Controller)` - Register a controller with Fastify

## Example

See the [example/](./example) folder for a complete working demo.

```bash
cd example
npm install
npm run dev
```

## Development

To test changes locally without publishing:

```bash
npm run build
mkdir -p example/node_modules/@albertoielpo/ielpify
cp -R dist example/node_modules/@albertoielpo/ielpify/
cp package.json example/node_modules/@albertoielpo/ielpify/
```

## License

MIT
