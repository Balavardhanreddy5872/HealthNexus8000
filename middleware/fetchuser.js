const jwt = require('jsonwebtoken');
const JWT_sceret = 'bvr12345';

const fetchuser = (req, res, next) => {
    const token =  req.query.token; // Corrected: use req.headers.authorization to access the token

    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_sceret);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
};

module.exports = fetchuser;

