const request = require('supertest');
// const app = require('../server');
const app = require('../app');

describe('Post Endpoints', () => {
  it('should signin - login', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        login: 'freeman28',
        password: 'freedom28',
      })
    expect(res.statusCode).toEqual(200)
    // expect(res.body).toHaveProperty('post')
    expect(res.body).toEqual({"message": "авторизация - OK"})
  })
})

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});