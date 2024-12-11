const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const secretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign({user: payload}, secretKey, {expiresIn: '24h'});
    return token;
}

module.exports = {
    generateToken
}