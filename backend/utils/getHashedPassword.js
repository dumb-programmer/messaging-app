const bcryptjs = require("bcryptjs");

const getHashedPassword = async (password) => {
    const salt = await bcryptjs.genSalt();
    return await bcryptjs.hash(password, salt);
};

module.exports = getHashedPassword;