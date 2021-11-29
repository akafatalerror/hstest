const jwt = require("jsonwebtoken");


/**
 *
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 */
const getUserFromRequest = (request) => {
    //checking for token
    const token = request.headers["x-access-token"];
    if (!token) {
        throw new Error('Token is required');
    }

    try {
        return  jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {
        throw new Error('Invalid token');
    }
}

module.exports = getUserFromRequest;