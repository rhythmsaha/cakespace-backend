const jwt = require("jsonwebtoken");

exports.createJWT = (data, expiration) => {
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: expiration,
    });
};
