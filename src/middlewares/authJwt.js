import jwt from 'jsonwebtoken';

import User from '../models/User';

export const verifyToken = async (req, res, next) => {
    const authorization = req.headers['authorization'];

    // Validate header
    if (!authorization) {
        res.set('WWW-Authenticate', 'Bearer realm=""');
        return res.status(400).json({ error: 'Authorization header must be provided' });
    }

    const [authType, token] = authorization.split(' ');
    if (!authType || !/^Bearer$/i.test(authType)) {
        res.set('WWW-Authenticate', 'Bearer realm=""');
        return res.status(401).json({ error: 'Unsupported authentication method' });
    }
    if (!token) {
        res.set('WWW-Authenticate', 'Bearer realm="", error="invalid_request"');
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const { id: userId } = decoded;
        
        const user = await User.methods.getUserById(userId);
        if (!user) {
            res.set('WWW-Authenticate', 'Bearer realm="", error="invalid_token"');
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = user;

        next();
    } catch (err) {
        res.set('WWW-Authenticate', 'Bearer realm="", error="invalid_token"');
        return res.status(401).json({ error: 'Invalid token' });
    }
};