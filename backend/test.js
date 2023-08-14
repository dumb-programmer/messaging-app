require("dotenv").config();
const request = require("supertest");
const setupMongo = require("./setupMongoTest");
const mongoose = require("mongoose");
const app = require("./app");
const { createUsers } = require("./seedDB");

beforeAll(async () => {
    await setupMongo();
    await createUsers();
});

describe("/login", () => {
    test("Request with no body responds with 400 status", done => {
        request(app).post("/api/login").expect("Content-Type", /json/).expect(400, done);
    });

    test("Missing either username or password field in bio results in 400 response", done => {
        request(app).post("/api/login").send({ username: "test" }).expect("Content-Type", /json/).expect(400, done);
        request(app).post("/api/login").send({ password: "test" }).expect("Content-Type", /json/).expect(400, done);
    });

    test("Incorrect username message is sent with status 404 status code", done => {
        request(app).post("/api/login").send({ username: "test", password: "hello" }).expect("Content-Type", /json/).expect(404, done);
    });

    test("Incorrect password message is show with 401 status code", done => {
        request(app).post("/api/login").send({ username: "john", password: "hello" }).expect("Content-Type", /json/).expect(401, done);
    });

    test("Correct crendials results in auth token", done => {
        request(app).post("/api/login").send({ username: "john", password: "123" }).expect("Content-Type", /json/).expect(200).then(response => {
            expect(response.body.token).not.toBeNull();
            expect(response.body.user).not.toBeNull();
            done();
        });
    });
});

describe("/signup", () => {
    test("Incomplete request body results in 400 status code with error messages", done => {
        request(app).post("/api/signup").expect("Content-Type", /json/).expect(400).then(response => {
            expect(response._body.message).not.toBeNull();
            done();
        });
    });
    test("Existing username error is show", done => {
        request(app).post("/api/signup").field("username", "john").field("password", "123").field("bio", "Hello").attach("avatar", "adventurer-1691214884915.png").expect(409, done);
    });
    test("A new user is created", done => {
        request(app).post("/api/signup").field("firstName", "Kane").field("lastName", "123").field("username", "kane").field("password", "123").field("bio", "Hello").attach("avatar", "adventurer-1691214884915.png").expect(200, done);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
