import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { getDatabase } from '../utils/dbSync';
import { initUserModel, getUserModel } from '../models/User';
import { User, UserCreationAttributes, UserPublic } from '@shared/types';

const db = getDatabase();
initUserModel(db);
const UserModel = getUserModel();

const JWT_SECRET = (process.env.JWT_SECRET || 'your-secret-key-change-in-production') as Secret;
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 24 * 60 * 60 * 1000;

export interface JWTPayload {
    userId: string;
    email: string;
}

export class AuthService {
    async register(data: UserCreationAttributes): Promise<{ user: UserPublic; token: string }> {
        const existingUser = await UserModel.findOne({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const user = await UserModel.create({
            email: data.email,
            password: hashedPassword,
        });

        const userJson = user.toJSON() as User;

        const token = this.generateToken({
            userId: userJson.id,
            email: userJson.email,
        });

        return {
            user: {
                id: userJson.id,
                email: userJson.email,
                createdAt: userJson.createdAt,
                updatedAt: userJson.updatedAt,
            },
            token,
        };
    }

    async login(email: string, password: string): Promise<{ user: UserPublic; token: string }> {
        const user = await UserModel.findOne({
            where: { email },
        });

        if (!user) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const userJson = user.toJSON() as User;

        const isPasswordValid = await bcrypt.compare(password, userJson.password);

        if (!isPasswordValid) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const token = this.generateToken({
            userId: userJson.id,
            email: userJson.email,
        });

        return {
            user: {
                id: userJson.id,
                email: userJson.email,
                createdAt: userJson.createdAt,
                updatedAt: userJson.updatedAt,
            },
            token,
        };
    }

    verifyToken(token: string): JWTPayload {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
            return decoded;
        } catch (error) {
            throw new Error('Token invalide ou expiré');
        }
    }

    async getUserById(userId: string): Promise<UserPublic | null> {
        const user = await UserModel.findByPk(userId);
        if (!user) {
            return null;
        }

        return user.toJSON() as User;
    }

    private generateToken(payload: JWTPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    }
}

export const authService = new AuthService();
