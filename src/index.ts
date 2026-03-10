import { Elysia } from "elysia";

const app = new Elysia()
    .listen(process.env.PORT ?? 3000);

console.log(
    `Running at http://${app.server?.hostname}:${app.server?.port}`,
);
