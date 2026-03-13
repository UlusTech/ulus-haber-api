import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import z from "zod";
import { db } from "../db";
import { editors, sessions } from "../db/schema";
import { createSession } from "./service";

const LoginBodySchema = z.object({
    email: z.string().email().describe("Editor org email."),
    totpCode: z.string().length(6).describe("6-digit TOTP code."),
});

export const session = new Elysia({ prefix: "/session" })
    .post(
        "/",
        async (context) => {
            const editor = await db.query.editors.findFirst({
                where: eq(editors.email, context.body.email),
            });

            if (!editor) {
                context.set.status = 401;
                return "Invalid credentials";
            }

            const newSession = createSession(
                editor,
                context.body.totpCode,
                context.request.headers.get("x-forwarded-for") ?? "",
                context.request.headers.get("user-agent") ?? "",
            );

            if (!newSession) {
                context.set.status = 401;
                return "Invalid credentials";
            }

            await db.insert(sessions).values(newSession);

            return { token: newSession.id };
        },
        {
            body: LoginBodySchema,
        },
    );

const editor = new Elysia({ prefix: "/editor" })
    .use(session)
    .get("/:id", ({ params: { id } }) => { // This will return the name of the editor.
        return id;
    });

export const auth = new Elysia({ prefix: "/auth" }).use(editor);
