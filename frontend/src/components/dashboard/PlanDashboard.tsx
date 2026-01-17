import React, { useEffect, useState } from 'react';
import { TriathlonPlan } from '@shared/types';
import { planApi } from '../../services/planApi';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { DashboardHeader } from './components/DashboardHeader';
import { EmptyPlanState } from './components/EmptyPlanState';
import { ActiveGoalCard } from './components/ActiveGoalCard';

export const PlanDashboard: React.FC = () => {
    const { user } = useAuth();
    const [plan, setPlan] = useState<TriathlonPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const goals = user?.goals || [];
    const activeGoal = goals[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentPlan = await planApi.getCurrentPlan();
                setPlan(currentPlan);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeletePlan = async () => {
        try {
            await planApi.deleteCurrentPlan();
            window.location.reload();
        } catch {
            alert('Erreur lors de la suppression du programme');
        }
    };

    const handleResetPeriods = async (goalId: string) => {
        setIsResetting(true);
        try {
            await planApi.resetGoalPeriods(goalId);
        } catch (e) {
            console.error('Error resetting periods:', e);
        } finally {
            setIsResetting(false);
        }
    };

    if (isLoading) {
        return (
            <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
                <Loader2 className='text-primary h-8 w-8 animate-spin' />
                <p className='text-muted-foreground font-medium'>
                    Chargement de votre programme...
                </p>
            </div>
        );
    }

    if (!plan && goals.length === 0) {
        return <EmptyPlanState />;
    }

    return (
        <div className='space-y-12'>
            <DashboardHeader goals={goals} onDeletePlan={handleDeletePlan} />
            {activeGoal && (
                <ActiveGoalCard
                    goal={activeGoal}
                    onResetPeriods={handleResetPeriods}
                    isResetting={isResetting}
                />
            )}
        </div>
    );
};
