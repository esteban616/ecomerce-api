const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
require("../models");

const URL_BASE = "/api/v1/users";
const URL_BASE_PRODUCT = "/api/v1/products";
let TOKEN;
let product;
let category;
let productId;

beforeAll(async () => {
  const user = {
    email: "estebanbmth99@gmail.com",
    password: "7972",
  };
  const res = await request(app).post(`${URL_BASE}/login`).send(user);

  TOKEN = res.body.token;

  const categoryBody = {
    name: "home",
  };
  category = await Category.create(categoryBody);

  product = {
    title: "GOW",
    description: "lorem30",
    price: 9.99,
    categoryId: category.id,
  };
});

test("POST -> '/api/v1/products' should return status code 201 and res.body.title === product.title", async () => {
  const res = await request(app)
    .post(URL_BASE_PRODUCT)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  productId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("GET -> '/api/v1/products' should resturn status code 200 and res.body to have length === 1", async () => {
  const res = await request(app).get(URL_BASE_PRODUCT);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("GET ONE-> '/api/v1/products/:id' should return status code 200 and res.body.title === product.title", async () => {
  const res = await request(app).get(`${URL_BASE_PRODUCT}/${productId}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("PUT -> '/api/v1/products/:id' should resturn status code 200 and res.body.title === productUpdate.title", async () => {
  const productUpdate = {
    title: "GOW",
  };
  const res = await request(app)
    .put(`${URL_BASE_PRODUCT}/${productId}`)
    .send(productUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(productUpdate.title);
});

test("DELETE -> '/api/v1/products/:id' should resturn status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_BASE_PRODUCT}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
  await category.destroy();
});
