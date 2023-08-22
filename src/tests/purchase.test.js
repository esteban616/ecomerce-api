const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const URL_BASE = "/api/v1/users";
const URL_BASE_PURCHASE = "/api/v1/purchase";

let TOKEN;
let userId;
let productBody;
let product;

beforeAll(async () => {
  const user = {
    email: "estebanbmth99@gmail.com",
    password: "7972",
  };
  const res = await request(app).post(`${URL_BASE}/login`).send(user);

  TOKEN = res.body.token;
  userId = res.body.user.id;

  productBody = {
    title: "productTest",
    description: "lorem20",
    price: 23,
  };
  product = await Product.create(productBody);

  const bodyCart = {
    quantity: 1,
    productId: product.id,
  };

  await request(app)
    .post("api/v1/cart")
    .send(bodyCart)
    .set("Authorization", `Bearer ${TOKEN}`);
});

test("POST -> '/api/v1/purchase' should return status code 201 and res.body.quantity === product.quantity", async () => {
  const res = await request(app)
    .post(URL_BASE_PURCHASE)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(201);
  expect(res.body[0].quantity).toBe(bodyCart.quantity);

  await product.destroy();
});

// test("GET -> '/api/v1/purchase' should resturn status code 200 and res.body to have length === 1", async () => {
//   const res = await request(app)
//     .get(URL_BASE_PURCHASE)
//     .set("Authorization", `Bearer ${TOKEN}`);

//   expect(res.status).toBe(200);
//   expect(res.body).toBeDefined();
//   expect(res.body).toHaveLength(1);
//   expect(res.body[0].userId).toBe(userId);
//   expect(res.body[0].product).toBeDefined();
//   expect(res.body[0].product.id).toBe(product.id);

//   await product.destroy();
// });
