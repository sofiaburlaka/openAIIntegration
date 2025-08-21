import request from "supertest";
import app from "index.js";
import * as test from "node:test";

describe("API tests", () => {
    test("summarize with valid input returns 200 and non-empty result", async () => {
        const res = await request(app)
            .post("/api/run")
            .send({ text: "This is a test", mode: "summarize" });

        expect(res.status).toBe(200);
        expect(res.body.result).toBeDefined();
        expect(res.body.result.length).toBeGreaterThan(0);
    });

    test("rephrase without tone returns 400", async () => {
        const res = await request(app)
            .post("/api/run")
            .send({ text: "Test text", mode: "rephrase" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Tone is required for rephrase mode");
    });

    test("classify returns one of the allowed labels", async () => {
        const res = await request(app)
            .post("/api/run")
            .send({ text: "Classify this text", mode: "classify" });

        expect(res.status).toBe(200);
        const allowedLabels = ["label1", "label2", "label3"]; // Змініть на ваші справжні лейбли
        expect(allowedLabels).toContain(res.body.result);
    });

    test("extract_json returns valid JSON with all required keys", async () => {
        const res = await request(app)
            .post("/api/run")
            .send({ text: "{\"key\":\"value\"}", mode: "extract_json" });

        expect(res.status).toBe(200);
        const jsonResult = JSON.parse(res.body.result);
        expect(jsonResult).toHaveProperty("key");
        // Додайте інші необхідні ключі
    });

    test("rate limit returns 429 after threshold", async () => {
        for (let i = 0; i < 10; i++) {
            const res = await request(app)
                .post("/api/run")
                .send({ text: "Test rate limit", mode: "summarize" });
            expect(res.status).toBeLessThan(429);
        }
        const res = await request(app)
            .post("/api/run")
            .send({ text: "Test rate limit", mode: "summarize" });

        expect(res.status).toBe(429);
    });
});
