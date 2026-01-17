import { GoalAttributes } from '../goal';

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

export interface UserProfile {}

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

export interface UserWithGoals extends User {
    goals: GoalAttributes[];
}
