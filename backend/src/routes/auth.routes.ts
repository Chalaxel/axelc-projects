import { Router, Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { AuthenticatedRequest } from '../middleware/auth';
import { RegisterRequest, LoginRequest, AuthResponse, AuthErrorResponse } from '@shared/types';
import { UserService } from 'src/services/UserService';

const router = Router();

router.post('/register', async (req: Request, res: Response<AuthResponse | AuthErrorResponse>) => {
    try {
        const data: RegisterRequest = req.body;

        if (!data.email || !data.password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe sont requis',
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return res.status(400).json({
                success: false,
                message: "Format d'email invalide",
            });
        }

        if (data.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Le mot de passe doit contenir au moins 6 caractères',
            });
        }

        const result = await authService.register(data);

        res.status(201).json({
            success: true,
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Erreur lors de l'inscription",
        });
    }
});

router.post('/login', async (req: Request, res: Response<AuthResponse | AuthErrorResponse>) => {
    try {
        const data: LoginRequest = req.body;

        if (!data.email || !data.password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe sont requis',
            });
        }

        const result = await authService.login(data.email, data.password);

        res.json({
            success: true,
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erreur lors de la connexion',
        });
    }
});

router.get(
    '/me',
    async (req: AuthenticatedRequest, res: Response<AuthResponse | AuthErrorResponse>) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié',
                });
            }

            const user = await UserService.getUserById(req.user.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé',
                });
            }

            res.json({
                success: true,
                user,
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération de l'utilisateur",
            });
        }
    },
);

export { router as authRouter };
