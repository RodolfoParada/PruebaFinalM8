const jwt = require('jsonwebtoken');

const {
    secretKey
} = require('../config/auth.config');

const TokenActivo = (request, response, next) => {

    const token = request.headers.authorization;

    if (!token) {
        return response.status(401).json({
            success: false,
            message: 'Token no proporcionado'
        });
    }

    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return response.status(403).json({
                success: false,
                message: 'Token inválido'
            });
        }
        request.userId = decoded.userId;
        next();
    });
};

module.exports = TokenActivo;