import React, { useEffect, useState } from 'react';
import { TriathlonPlan, Session, UserGoal } from '@shared/types';
import { planApi } from '../../services/planApi';
import { sessionApi } from '../../services/sessionApi';
import { SessionItem } from '../SessionItem';
import { useAuth } from '../../context/AuthContext';
import '../../index.css';

export const PlanDashboard: React.FC = () => {
    const { user } = useAuth();
    const [plan, setPlan] = useState<TriathlonPlan | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const goals = user?.profile?.goals || [];
    const activeGoal = goals.find((g: UserGoal) => g.status === 'active') || goals[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentPlan = await planApi.getCurrentPlan();
                setPlan(currentPlan);

                const allSessions = await sessionApi.getSessions();
                // Filter sessions for the current week or similar logic
                setSessions(allSessions.slice(0, 10));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div className='loading'>Chargement de votre programme...</div>;

    if (!plan && goals.length === 0) {
        return (
            <div className='no-plan'>
                <h2>Vous n&apos;avez pas encore d&apos;objectif fixé.</h2>
                <button onClick={() => (window.location.href = '/onboarding')}>
                    Fixer un nouvel objectif
                </button>
            </div>
        );
    }

    const handleEdit = (session: Session) => {
        console.log('Edit session:', session.id);
        // Implement redirect to edit page or open modal
    };

    const handleDelete = async (id: string) => {
        if (confirm('Voulez-vous supprimer cette séance ?')) {
            try {
                await sessionApi.deleteSession(id);
                setSessions(sessions.filter(s => s.id !== id));
            } catch (error) {
                console.error('Error deleting session:', error);
            }
        }
    };

    return (
        <div className='dashboard-container'>
            <header className='dashboard-header'>
                <h1>Mon Coaching</h1>
                <div className='goals-summary'>
                    {goals.length > 0 && (
                        <div className='objectives-list'>
                            <h3>Mes Objectifs ({goals.length})</h3>
                            <div className='goals-badges'>
                                {goals.map((g: UserGoal) => (
                                    <span key={g.id} className={`goal-badge ${g.status}`}>
                                        {g.targetDistance} -{' '}
                                        {new Date(g.raceDate || '').toLocaleDateString()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {activeGoal && (
                <div className='active-goal-info'>
                    <h2>Objectif Actuel : {activeGoal.targetDistance}</h2>
                    <div className='plan-info'>
                        <span>
                            Volume: <strong>{activeGoal.weeklyAvailability}h/semaine</strong>
                        </span>
                        <span>
                            Compétition:{' '}
                            <strong>
                                {new Date(activeGoal.raceDate || '').toLocaleDateString()}
                            </strong>
                        </span>
                    </div>
                </div>
            )}

            <section className='next-sessions'>
                <h2>Prochaines séances</h2>
                <div className='sessions-list'>
                    {sessions.length > 0 ? (
                        sessions.map(session => (
                            <SessionItem
                                key={session.id}
                                session={session}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <p>Aucune séance prévue pour le moment.</p>
                    )}
                </div>
            </section>
        </div>
    );
};
