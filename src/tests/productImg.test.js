const request = require("supertest");
const app = require("../app");
const path = require("path");

const URL_BASE = "/api/v1/users";
const URL_BASE_PRODUCTIMG = "/api/v1/product_images";
let TOKEN;
let productImgId;

beforeAll(async () => {
  const user = {
    email: "estebanbmth99@gmail.com",
    password: "7972",
  };

  const res = await request(app).post(`${URL_BASE}/login`).send(user);

  TOKEN = res.body.token;
});

test("POST -> '/api/v1/product_images' shoul return status code 201 and res.body.url to be defined", async () => {
  const localImage = path.join(__dirname, "..", "public", "test.jpg");

  const res = await request(app)
    .post(URL_BASE_PRODUCTIMG)
    .attach("image", localImage)
    .set("Authorization", `Bearer ${TOKEN}`);

  productImgId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.url).toBeDefined();
  expect(res.body.filename).toBeDefined();
});

test("GET -> '/api/v1/product_images', should resturn status code 200 and res.body.legnth = 1", async () => {
  const res = await request(app)
    .get(URL_BASE_PRODUCTIMG)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("DELETE -> '/api/v1/product_images/:id', shoul return status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_BASE_PRODUCTIMG}/${productImgId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
