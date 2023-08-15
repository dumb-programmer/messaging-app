require("dotenv").config();
const request = require("supertest");
const setupMongo = require("./setupMongoTest");
const mongoose = require("mongoose");
const app = require("./app");
const { createUsers } = require("./seedDB");
const { User, Request, Friend } = require("./models");
const fs = require("fs/promises");

beforeAll(async () => {
    await setupMongo();
    await createUsers();
});

describe("/login", () => {
    test("Request with no body responds with 400 status", async () => {
        await request(app).post("/api/login").expect("Content-Type", /json/).expect(400);
    });

    test("Missing either username or password field in body results in 400 response", async () => {
        await request(app).post("/api/login").send({ username: "test" }).expect("Content-Type", /json/).expect(400);
        await request(app).post("/api/login").send({ password: "test" }).expect("Content-Type", /json/).expect(400);
    });

    test("Incorrect username message is sent with status 404 status code", async () => {
        await request(app).post("/api/login").send({ username: "test", password: "hello" }).expect("Content-Type", /json/).expect(404);
    });

    test("Incorrect password message is show with 401 status code", async () => {
        await request(app).post("/api/login").send({ username: "john", password: "hello" }).expect("Content-Type", /json/).expect(401);
    });

    test("Correct crendials results in auth token", async () => {
        const response = await request(app).post("/api/login").send({ username: "john", password: "123" }).expect("Content-Type", /json/).expect(200);
        expect(response.body.token).not.toBeNull();
        expect(response.body.user).not.toBeNull();
    });
});

describe("/signup", () => {
    test("Incomplete request body results in 400 status code with error messages", async () => {
        const response = await request(app).post("/api/signup").expect("Content-Type", /json/).expect(400);
        expect(response._body.message).not.toBeNull();
    });
    test("Existing username error is show", async () => {
        await request(app).post("/api/signup").field("username", "john").field("password", "123").field("bio", "Hello").attach("avatar", "adventurer-1691214884915.png").expect(409);
    });
    test("A new user is created when all required fields are sent in the body", async () => {
        await request(app).post("/api/signup").field("firstName", "Kane").field("lastName", "123").field("username", "kane").field("password", "123").field("bio", "Hello").attach("avatar", "adventurer-1691214884915.png").expect(200);
    });
});

describe("/users", () => {
    let token = null;
    beforeAll(async () => {
        const response = await request(app).post("/api/login").send({ username: "kane", password: "123" });
        token = response._body.token;
    });

    test("Must be authorized to fetch user info", async () => {
        const user = await User.findOne({ username: "kane" });
        await request(app).get(`/api/users/${user._id.toString()}`).expect(401);
    });

    test("Can fetch user info when authorized", async () => {
        const user = await User.findOne({ username: "kane" });
        const response = await request(app).get(`/api/users/${user._id.toString()}`).set("Authorization", `Bearer ${token}`).expect(200);
        expect(response._body.user.firstName).toEqual("Kane");
        expect(response._body.user.lastName).toEqual("123");
        expect(response._body.user.username).toEqual("kane");
    });

    test("Users must be authorized to update user data", async () => {
        const user = await User.findOne({ username: "john" });
        await request(app).patch(`/api/users/${user._id.toString()}`).send({ firstName: "Larry" }).expect(401);
    });

    test("Cannot update another user's data", async () => {
        const user = await User.findOne({ username: "john" });
        await request(app).patch(`/api/users/${user._id.toString()}`).set("Authorization", `Bearer ${token}`).send({ firstName: "Larry" }).expect(403);
    });

    test("User can update their own data", async () => {
        const user = await User.findOne({ username: "kane" });
        await request(app).patch(`/api/users/${user._id.toString()}`).set("Authorization", `Bearer ${token}`).send({ firstName: "Larry" }).expect(200);
        const newUser = await User.findOne({ username: "kane" });
        expect(newUser.firstName).toEqual("Larry");
    });

    test("User can update their password", async () => {
        const user = await User.findOne({ username: "kane" });
        await request(app).patch(`/api/users/${user._id.toString()}`).set("Authorization", `Bearer ${token}`).send({ password: "123", newPassword: "abc", confirmPassword: "abc" }).expect(200);
        const newUser = await User.findOne({ username: "kane" });
        expect(newUser.password).not.toEqual(user.password);
    });
});

describe("/requests", () => {
    test("Unauthorized users can't send requests", async () => {
        const user = await User.findOne({ username: "john" });
        await request(app).post("/api/requests").send({ userId: user._id.toString() }).expect(401);
    });
    describe("Authorized User", () => {
        let token = null;
        beforeAll(async () => {
            const response = await request(app).post("/api/login").send({ username: "kane", password: "abc" });
            token = response._body.token;
        });

        test("Omitting the userId field in body results in status code 400", async () => {
            await request(app).post("/api/requests").set("Authorization", `Bearer ${token}`).expect(400);
        });

        test("User can send request if not already sent", async () => {
            const user = await User.findOne({ username: "john" });
            await request(app).post("/api/requests").set("Authorization", `Bearer ${token}`).send({ userId: user._id.toString() }).expect(200);
        });

        test("Duplicate request results in status code 409", async () => {
            const user = await User.findOne({ username: "john" });
            const response = await request(app).post("/api/requests").set("Authorization", `Bearer ${token}`).send({ userId: user._id.toString() }).expect(409);
            expect(response._body.message).toMatch(/request already exists/i);
        });

        test("User can get their pending requests", async () => {
            const response = await request(app).get("/api/requests/pending").set("Authorization", `Bearer ${token}`).expect(200);
            const user = await User.findOne({ username: "john" });
            expect(response._body.requests[0].to.username).toEqual(user.username);
        });

        test("User can get their incoming requests", async () => {
            const token = (await request(app).post("/api/login").send({ username: "john", password: "123" }))._body.token;
            const response = await request(app).get("/api/requests/incoming").set("Authorization", `Bearer ${token}`).expect(200);
            const user = await User.findOne({ username: "kane" });
            expect(response._body.requests[0].from.username).toEqual(user.username);
        });

        test("User can accept a request by sending a POST request with the requestId in params", async () => {
            const [from, to] = await Promise.all([
                User.findOne({ username: "kane" }),
                User.findOne({ username: "john" })
            ]);
            const sentRequest = await Request.findOne({ from: from._id.toString(), to: to._id.toString() });
            const token = (await request(app).post("/api/login").send({ username: "john", password: "123" }))._body.token;
            await request(app).post(`/api/requests/${sentRequest._id.toString()}`).set("Authorization", `Bearer ${token}`).expect(200);
        });

        test("If user's are already friends, then the request won't be sent", async () => {
            const userId = (await User.findOne({ username: "john" }))._id.toString();
            const response = await request(app).post("/api/requests").set("Authorization", `Bearer ${token}`).send({ userId }).expect(400);
            expect(response._body.message).toMatch(/already friends/i);
        });

        test("User can cancel/decline a request by sending a DELETE request with the requestId in params", async () => {
            const [from, to] = await Promise.all([
                User.findOne({ username: "kane" }),
                User.findOne({ username: "batman" })
            ]);
            await request(app).post("/api/requests").set("Authorization", `Bearer ${token}`).send({ userId: to._id.toString() });
            const sentRequest = await Request.findOne({ from: from._id.toString(), to: to._id.toString() });
            await request(app).delete(`/api/requests/${sentRequest._id.toString()}`).set("Authorization", `Bearer ${token}`).expect(200);
        });
    });
});

describe("/friends", () => {
    test("Unauthorized user's can't access this route", async () => {
        await request(app).get("/api/friends").expect(401);
    });

    describe("Authorized User", () => {
        let token = null;
        beforeAll(async () => {
            const response = await request(app).post("/api/login").send({ username: "kane", password: "abc" });
            token = response._body.token;
        });

        test("Can access their friends", async () => {
            const user = await User.findOne({ username: "john" });

            const response = await request(app).get("/api/friends").set("Authorization", `Bearer ${token}`).expect(200);
            expect(response._body.friends[0].user.firstName).toEqual(user.firstName);
            expect(response._body.friends[0].user.lastName).toEqual(user.lastName);
            expect(response._body.friends[0].user.username).toEqual(user.username);
        });

        test("Can unfriend someone", async () => {
            const user = await User.findOne({ username: "john" });
            const friend = await Friend.findOne({ user1: user._id });
            await request(app).delete(`/api/friends/${friend._id.toString()}`).set("Authorization", `Bearer ${token}`).expect(200);
        });
    });
});

describe("/messages", () => {
    test("Unauthorized can't access this route", async () => {
        await request(app).get("/api/messages").expect(401);
    });
    describe("Authorized Users", () => {
        let token = null;
        beforeAll(async () => {
            const response = await request(app).post("/api/login").send({ username: "kane", password: "abc" });
            token = response._body.token;
        });

        test("Can't send message to users which aren't friends with them", async () => {
            const to = (await User.findOne({ username: "batman" }))._id.toString();
            await request(app).post("/api/messages").set("Authorization", `Bearer ${token}`).send({ to, content: "Hi" }).expect(403);
        });

        test("Can send message to their friends", async () => {
            const [from, to] = await Promise.all([
                User.findOne({ username: "kane" }),
                User.findOne({ username: "john" })
            ]);
            await Friend.create({ user1: to._id, user2: from._id });
            await request(app).post("/api/messages").set("Authorization", `Bearer ${token}`).send({ to, content: "Hi" }).expect(200);
        });

        test("Can get messages from a user by providing the userId in the search query", async () => {
            const userId = (await User.findOne({ username: "john" }))._id.toString();
            const response = await request(app).get(`/api/messages?userId=${userId}`).set("Authorization", `Bearer ${token}`).expect(200);
            expect(response._body.messages[0].to._id.toString()).toEqual(userId);
            expect(response._body.messages[0].content).toEqual("Hi");
        });

        test("Can get latest messages to/from them", async () => {
            const user = await User.findOne({ username: "john" });
            const response = await request(app).get("/api/messages").set("Authorization", `Bearer ${token}`).expect(200);
            const { latestMessage } = response._body.messages[0];
            expect(latestMessage.to._id.toString()).toEqual(user._id.toString());
            expect(latestMessage.content).toEqual("Hi");
        });
    });
});

afterAll(async () => {
    const user = await User.findOne({ username: "kane" });
    await fs.unlink(`${user.avatar}`);
    await mongoose.connection.close();
});
