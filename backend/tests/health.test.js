const request = require("supertest");
const app = require("../src/app");

describe("Health Check", () => {
  test("GET /health should return 200", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("environment");
  });

  test("GET /non-existent-route should return 404", async () => {
    const response = await request(app).get("/non-existent-route").expect(404);

    expect(response.body).toHaveProperty("success", false);
    expect(response.body.message).toContain("Not Found");
  });
});
