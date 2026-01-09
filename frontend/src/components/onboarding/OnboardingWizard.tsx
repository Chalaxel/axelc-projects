import React, { useState } from 'react';
import { TriathlonDistance, UserLevel, UserGoal } from '@shared/types';
import { planApi } from '../../services/planApi';
import { useAuth } from '../../context/AuthContext';
import '../../index.css';

export const OnboardingWizard: React.FC = () => {
    const { updateUser } = useAuth();
    const [step, setStep] = useState(1);
    const [newGoal, setNewGoal] = useState<Omit<UserGoal, 'id' | 'status'>>({
        level: UserLevel.BEGINNER,
        weeklyAvailability: 5,
        targetDistance: TriathlonDistance.S,
        raceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Add new goal to user profile
            const updatedUser = await planApi.addGoal(newGoal);
            updateUser(updatedUser);

            // Generate plan for the new goal
            const startDate = new Date().toISOString().split('T')[0];
            await planApi.generatePlan({
                distance: newGoal.targetDistance as TriathlonDistance,
                weeklyHours: newGoal.weeklyAvailability,
                startDate,
                endDate: newGoal.raceDate || '',
            });

            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error during onboarding:', error);
            alert('Une erreur est survenue lors de la création de votre programme.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='onboarding-container'>
            <div className='onboarding-card'>
                <div className='progress-bar'>
                    <div className='progress' style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>

                {step === 1 && (
                    <div className='step-content'>
                        <h2>Quel est votre objectif ?</h2>
                        <div className='distance-grid'>
                            {Object.values(TriathlonDistance).map(d => (
                                <button
                                    key={d}
                                    className={`distance-btn ${newGoal.targetDistance === d ? 'active' : ''}`}
                                    onClick={() => setNewGoal({ ...newGoal, targetDistance: d })}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        <button className='next-btn' onClick={() => setStep(2)}>
                            Suivant
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className='step-content'>
                        <h2>Quel est votre niveau ?</h2>
                        <div className='level-grid'>
                            {Object.values(UserLevel).map(l => (
                                <button
                                    key={l}
                                    className={`level-btn ${newGoal.level === l ? 'active' : ''}`}
                                    onClick={() => setNewGoal({ ...newGoal, level: l })}
                                >
                                    {l.charAt(0).toUpperCase() + l.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className='availability-section'>
                            <h3>Temps disponible par semaine (heures)</h3>
                            <input
                                type='range'
                                min='3'
                                max='25'
                                value={newGoal.weeklyAvailability}
                                onChange={e =>
                                    setNewGoal({
                                        ...newGoal,
                                        weeklyAvailability: parseInt(e.target.value),
                                    })
                                }
                            />
                            <span className='hours-value'>{newGoal.weeklyAvailability}h</span>
                        </div>
                        <div className='navigation-btns'>
                            <button className='back-btn' onClick={() => setStep(1)}>
                                Retour
                            </button>
                            <button className='next-btn' onClick={() => setStep(3)}>
                                Suivant
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className='step-content'>
                        <h2>Votre date de course</h2>
                        <input
                            type='date'
                            className='date-input'
                            value={newGoal.raceDate}
                            onChange={e => setNewGoal({ ...newGoal, raceDate: e.target.value })}
                        />
                        <div className='navigation-btns'>
                            <button className='back-btn' onClick={() => setStep(2)}>
                                Retour
                            </button>
                            <button
                                className='submit-btn'
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Génération...' : 'Générer mon programme'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
