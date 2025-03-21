const request = require("supertest");
const app = require("../server");
const http = require("http");

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(() => done()); // Start the server before running tests
});

afterAll((done) => {
  server.close(done); // Close the server after all tests
});

describe("Task API", () => {
  test("GET /api/tasks should return an array of tasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // Ensure the response is an array
  });
});