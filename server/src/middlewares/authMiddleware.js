import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (req, res, next) => {
    try {
        // Intentar obtener el token del header de autorización
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // Si no hay token, intentar obtenerlo de las cookies
        if (!token) {
            return res.status(401).json({ 
                error: 'No token provided',
                message: 'Please login to access this resource'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ 
                        error: 'Token expired',
                        message: 'Your session has expired. Please login again.'
                    });
                }
                return res.status(401).json({ 
                    error: 'Invalid token',
                    message: 'Please login again'
                });
            }

            req.user = {
                uid: decoded.userId,
                email: decoded.email
            };
            next();
        });
    } catch (error) {
        return res.status(401).json({ 
            error: 'Authentication failed',
            message: 'Please login to continue'
        });
    }
};
