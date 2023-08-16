const request = require("supertest");
const app = require("../app");

const URL_BASE = "/api/v1/users";
const URL_BASE_CATEGORY = "/api/v1/categories";
let TOKEN;
let CategoryId;

beforeAll(async () => {
  const user = {
    email: "estebanbmth99@gmail.com",
    password: "7972",
  };
  const login = await request(app).post(`${URL_BASE}/login`).send(user);

  TOKEN = login.body.token;
});

test("POST -> '/api/v1/categories' should return status code 201 and res.body.name === category.name", async () => {
  const category = {
    name: "game",
  };

  const res = await request(app)
    .post(URL_BASE_CATEGORY)
    .send(category)
    .set("Authorization", `Bearer ${TOKEN}`);

  CategoryId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.name).toBe(category.name);
});

test("GET -> '/api/v1/categories' should return status code 200 and res.body.toHaveLength === 1", async () => {
  const res = await request(app).get(URL_BASE_CATEGORY);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("DELETE -> ' '/api/v1/categories/:id' should resturn status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_BASE_CATEGORY}/${CategoryId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
