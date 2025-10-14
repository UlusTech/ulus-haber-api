import { expect, test } from "bun:test";
import { api } from "./main";

const fetchRequest = (method: "GET" | "POST", path: string, body?: any) => {
    return api.handle(
        new Request(`http://localhost${path}`, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        }),
    );
};

const newPostData = {
    id: crypto.randomUUID(),
    publisher: ["test"],
    content: "# test",
    files: ["test"],
    state: 3,
};

test("POST /post should create a new post and return success", async () => {
    const response = await fetchRequest("POST", "/post", newPostData);

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ success: true });
});

test("GET /post/:id should retrieve the created post", async () => {
    const postId = "test";

    const response = await fetchRequest("GET", `/post/${postId}`);
    expect(response.status).toBe(200);
    const post = await response.json();

    expect(post.id).toBe(postId);
    expect(post.content).toBe("# test");
    expect(post.state).toBe(3);

    expect(post.createdAt).toBeString();
    expect(post.updatedAt).toBeString();
});

// ------------------------------------------------------------------------------------------------
test("GET /post/:id for a non-existent post should return 404", async () => {
    const response = await fetchRequest("GET", "/post/" + crypto.randomUUID());

    expect(response.status).toBe(404);
});
