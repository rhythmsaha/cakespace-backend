const jwt = require("jsonwebtoken");

exports.authorizeAdmin = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).json({ message: "No Token Provided!" });

    const token = req.headers.authorization.split(" ")[1];

    try {
        req.storeData = jwt.verify(token, process.env.ADMIN_SECRET);
    } catch (error) {
        return res.status(403).json({ message: "Access Denied!" });
    }

    next();
};

exports.authorizeUser = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).json({ message: "No Token Provided!" });

    const token = req.headers.authorization.split(" ")[1];

    try {
        req.userData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(403).json({ message: "Access Denied!" });
    }

    next();
};
