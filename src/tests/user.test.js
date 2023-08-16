const request = require("supertest");
const app = require("../app");
require("../models");

const URL_BASE = "/api/v1/users";
let TOKEN;

beforeAll(async () => {
  const user = {
    email: "estebanbmth99@gmail.com",
    password: "7972",
  };
  const login = await request(app).post(`${URL_BASE}/login`).send(user);

  TOKEN = login.body.token;
});

let userId;

test("GET -> '/api/v1/users' should return status code 200 and res.body.toHaveLength === 1", async () => {
  const res = await request(app)
    .get(URL_BASE)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("POST -> '/api/v1/users' should return status code 201 and res.body.firstName === user.firstName", async () => {
  const user = {
    firstName: "Esteban",
    lastName: "Bustos",
    email: "estebanbmth@gmail.com",
    password: "7972",
    phone: "+573113195202",
  };

  const res = await request(app).post(URL_BASE).send(user);

  userId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("PUT -> '/api/v1/users/:id' should return status code 200 and res.body.firstName === userUpdate.firstName", async () => {
  const userUpdate = {
    firstName: "Juan",
  };
  const res = await request(app)
    .put(`${URL_BASE}/${userId}`)
    .send(userUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(userUpdate.firstName);
});

test("POST -> ' '/api/v1/users/login' should resturn status code 200, res.body.email === user.email and res.body.token to be defined", async () => {
  const user = {
    email: "estebanbmth@gmail.com",
    password: "7972",
  };

  const res = await request(app).post(`${URL_BASE}/login`).send(user);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.user.email).toBe(user.email);
  expect(res.body.token).toBeDefined();
});

test("POST -> ' '/api/v1/users/login' should resturn status code 401", async () => {
  const user = {
    email: "estebanbmth@gmail.com",
    password: "insvalid password",
  };

  const res = await request(app).post(`${URL_BASE}/login`).send(user);

  expect(res.status).toBe(401);
});

test("DELETE -> ' '/api/v1/users/:id' should resturn status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_BASE}/${userId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
