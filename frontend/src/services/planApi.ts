import { TriathlonDistance, TriathlonPlan, UserProfile, UserPublic } from '@shared/types';
import axios from 'axios';
import { TOKEN_KEY } from './authApi';
import { GoalForm } from '@shared/types/goal/Goal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const planApi = {
    async getCurrentPlan(): Promise<TriathlonPlan | null> {
        const response = await axios.get(`${API_URL}/plans/current`, getAuthHeaders());
        return response.data.data;
    },

    async generatePlan(data: {
        distance: TriathlonDistance;
        weeklyHours: number;
        startDate: string;
        endDate: string;
    }): Promise<TriathlonPlan> {
        const response = await axios.post(`${API_URL}/plans/generate`, data, getAuthHeaders());
        return response.data.data;
    },

    async updateProfile(profile: UserProfile): Promise<UserPublic> {
        const response = await axios.put(`${API_URL}/plans/profile`, profile, getAuthHeaders());
        return response.data.data;
    },

    async setGoal(goal: GoalForm): Promise<UserPublic> {
        const response = await axios.put(`${API_URL}/plans/goal`, goal, getAuthHeaders());
        return response.data.data;
    },

    async deleteCurrentPlan(): Promise<void> {
        await axios.delete(`${API_URL}/plans/current`, getAuthHeaders());
    },
};
