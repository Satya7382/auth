import jwt from 'jsonwebtoken';

export const userAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId; 
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized: Login Again' });
        }
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
}