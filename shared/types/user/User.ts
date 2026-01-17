import { Goal } from '../goal';

export enum UserLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

export enum UserGoalStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    DRAFT = 'draft',
}

export interface UserGoal {
    id: string;
    level: UserLevel;
    weeklyAvailability: number; // hours
    targetDistance: string; // TriathlonDistance
    raceDate?: string;
    status: UserGoalStatus;
}

export type UserGoalCreationAttributes = Omit<UserGoal, 'id' | 'status'>;

export interface UserProfile {
    goals: Goal[];
}

export interface User {
    id: string;
    email: string;
    password: string;
    profile?: UserProfile;
    createdAt: string;
    updatedAt: string;
}

export interface UserCreationAttributes {
    email: string;
    password: string;
    profile?: UserProfile;
}

export interface UserPublic {
    id: string;
    email: string;
    profile?: UserProfile;
    createdAt: string;
    updatedAt: string;
}
