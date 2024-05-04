const { User } = require("./models");
const bcryptjs = require("bcryptjs");

const createUsers = async () => {
    await User.create([
        { username: "john", password: bcryptjs.hashSync("123", bcryptjs.genSaltSync()), bio: "Hello everyone I am john" },
        { username: "samantha", password: bcryptjs.hashSync("123", bcryptjs.genSaltSync()) },
        { username: "batman", password: bcryptjs.hashSync("123", bcryptjs.genSaltSync()) }
    ]);
};

module.exports = { createUsers };
