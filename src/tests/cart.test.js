const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

const URL_BASE = "/api/v1/users";
const URL_BASE_CART = "/api/v1/cart";
let TOKEN;
let product;
let userId;
let cartId;

beforeAll(async () => {
  const user = {
    email: "estebanbmth99@gmail.com",
    password: "7972",
  };
  const login = await request(app).post(`${URL_BASE}/login`).send(user);

  TOKEN = login.body.token;
  userId = login.body.user.id;

  productBody = {
    title: "GOW",
    description: "lorem30",
    price: 9.99,
  };

  product = await Product.create(productBody);
});

test("POST -> '/api/v1/cart' should return status code 201 and res.body.quantity === product.quantity", async () => {
  const bodyCart = {
    quantity: 1,
    productId: product.id,
  };

  const res = await request(app)
    .post(URL_BASE_CART)
    .send(bodyCart)
    .set("Authorization", `Bearer ${TOKEN}`);

  cartId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(bodyCart.quantity);
  expect(res.body.id).toBe(userId);
});

test("GET -> '/api/v1/cart' should resturn status code 200 and res.body to have length === 1", async () => {
  const res = await request(app)
    .get(URL_BASE_CART)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].userId).toBe(userId);
  expect(res.body[0].product).toBeDefined();
  expect(res.body[0].product.id).toBe(product.id);
});

test("PUT -> '/api/v1/cart/:id',should return status code 200 and res.body.quantity === bodyUpdate.quantity", async () => {
  const bodyUpdate = {
    quantity: 2,
  };

  const res = await request(app)
    .put(`${URL_BASE_CART}/${cartId}`)
    .send(bodyUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(bodyUpdate.quantity);
});

test("DELETE -> '/api/v1/cart/:id' should resturn status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_BASE_CART}/${cartId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
  await product.destroy();
});
