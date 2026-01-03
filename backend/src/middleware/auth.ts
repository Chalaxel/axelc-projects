import { Request, Response, NextFunction } from 'express';
import { authService, JWTPayload } from '../services/AuthService';

export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}

export const getUserMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token d'authentification manquant",
            });
            return;
        }

        const payload = authService.verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Token invalide',
        });
    }
};
