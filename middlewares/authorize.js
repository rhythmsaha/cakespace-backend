const jwt = require("jsonwebtoken");

exports.authorizeAdmin = async (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(403).json({ message: "No Token Provided!" });

    const token = req.headers.authorization.split(" ")[1];

    try {
        const storeData = jwt.verify(token, process.env.ADMIN_SECRET);
        req.storeData = storeData;
    } catch (error) {
        return res.status(403).json({ message: "Access Denied!" });
    }

    next();
};
