import jwt from 'jsonwebtoken';

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
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Store the user information and role in the request object for future use
        req.user = decoded.user;
        req.role = decoded.role;

        if (req.role !== 'Administrador') {
            return res.status(403).json({ message: 'Solo los administradores estan permitidos' });
        }

        next();
    });
}

export default authMiddleware;