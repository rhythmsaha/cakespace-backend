const jwt = require("jsonwebtoken");

exports.authorize = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).json({ type: "AUTHORIZATION", message: "Invald Token!" });

    try {
        const token = req.headers.authorization.split(" ")[1];
        const JWT_DATA = jwt.verify(token, process.env.JWT_SECRET);
        req.user = JWT_DATA;
        next();
    } catch (error) {
        return res.status(403).json({ type: "AUTHORIZATION", message: "Access Denied!" });
    }
};
