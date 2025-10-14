import { Elysia, t } from "elysia";
import { db } from "./database/client";
import { newsPosts } from "./database/schema";
import { eq } from "drizzle-orm";

const app = new Elysia({ prefix: "/post" })
  .get("/", async () => {
    const posts = await db.select().from(newsPosts);
    return posts;
  })
  .get("/:id", async ({ params }) => {
    const [post] = await db.select().from(newsPosts).where(
      eq(newsPosts.id, params.id),
    );

    if (!post) {
      return new Response("Not Found", { status: 404 });
    }

    return post;
  })
  .post(
    "/",
    async ({ body }) => {
      await db.insert(newsPosts).values(body);
      return { success: true };
    },
    {
      body: t.Object({
        id: t.String(),
        publisher: t.Array(t.String()),
        content: t.String(),
        files: t.Array(t.String()),
        state: t.Number(),
      }),
    },
  )
  .patch(
    "/:id",
    async ({ params, body }) => {
      await db.update(newsPosts).set(body).where(eq(newsPosts.id, params.id));
      return { updated: true };
    },
    {
      body: t.Partial(
        t.Object({
          id: t.String(),
          publisher: t.Array(t.String()),
          content: t.String(),
          files: t.Array(t.String()),
          state: t.Number(),
        }),
      ),
    },
  )
  .listen(3000);

export const api = app;
