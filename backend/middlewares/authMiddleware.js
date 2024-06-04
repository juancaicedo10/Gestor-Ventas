import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

function authMiddleware(req, res, next) {
    // Get the authorization header
    const authHeader = req.headers['authorization'];

    // Check if the authorization header exists
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Split the authorization header into a scheme and a token
    const parts = authHeader.split(' ');

    // Check if the authorization header has the correct format
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    // Get the token from the authorization header
    const token = parts[1];

    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY , (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.role = decoded.role;
        next();
    });
}

function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.role)) {
            console.log(req.role);
            return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' });
        }
        next();
    }

}



export { authMiddleware , authorize } ;