import { verify } from "otplib";
import type { Satisfies } from "../types";
import type { Editor, Session, SessionCheckResponse } from "./schema";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Verifies a TOTP code against an {@linkcode Editor}'s secret
 * and returns a new {@linkcode Session} on success.
 *
 * @param editor - Fetched from DB by the caller before invoking this
 * @param totpCode - 6-digit code submitted by the editor
 * @param ip - Request IP
 * @param userAgent - Request User-Agent
 * @returns A new {@linkcode Session} to persist, or `null` on bad code
 */
export function createSession(
    editor: Editor,
    totpCode: string,
    ip: string,
    userAgent: string,
): Session | null {
    if (!verify({ secret: editor.totpSecret, token: totpCode })) {
        return null;
    }

    const now = new Date();

    return {
        id: crypto.randomUUID(),
        editorId: editor.id,
        ip,
        userAgent,
        expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
        createdAt: now,
    };
}

/**
 * USE {@linkcode SessionCheckResponse}.
 */
type SessionCheckData = Satisfies<{
    trusted: boolean;
    valid: boolean;
}, SessionCheckResponse>;

/**
 * Checks whether a {@linkcode Session} is still valid.
 */
export function checkSession(
    session: Session,
    ip: Session["ip"],
    userAgent: Session["userAgent"],
    editorId: Editor["id"],
): SessionCheckResponse {
    const result: SessionCheckData = {
        trusted: true,
        valid: true,
    };

    if (session.expiresAt < new Date()) result.valid = false;
    if (ip !== session.ip) result.trusted = false;
    if (userAgent !== session.userAgent || editorId !== session.editorId) {
        result.trusted = false;
        result.valid = false;
    }

    return {
        trusted: result.trusted,
        valid: result.valid,
    }; // as SessionCheckResponse;
}
