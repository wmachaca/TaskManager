const request = require('supertest');
const app = require('../server');
const http = require('http');
let authToken;

let server;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(resolve)); // Wait for server to start
  // Log in a test user and store the token (modify credentials as needed)
  const loginRes = await request(app)
    .post('/api/auth/login') // Adjust the login route if different
    .send({
      email: 'test@example.com', // Use a test user from your DB
      password: 'testpassword',
    });

  authToken = loginRes.body.token; // Adjust based on your API's response structure
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve)); // Wait for server to close
});

describe('Task API', () => {
  test('GET /api/tasks should return an array of tasks', async () => {
    const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${authToken}`); // Attach the JWT token
    console.log('Response body:', res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
