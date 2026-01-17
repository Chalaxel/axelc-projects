import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { planApi } from '../../services/planApi';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { PlanSelector } from './PlanSelector';
import { VolumeSelector } from './VolumeSelector';
import { GoalForm } from '@shared/types/goal/Goal';

const stepsDict: Record<number, { title: string; description: string }> = {
    1: {
        title: 'Quel est votre objectif ?',
        description: 'Choisissez la distance de triathlon que vous visez.',
    },
    2: {
        title: 'Votre volume hebdomadaire',
        description:
            'Dites-en nous plus sur le nombre de séances que vous pouvez faire par semaine.',
    },
};

export const OnboardingWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [newGoal, setNewGoal] = useState<Partial<GoalForm>>({});

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await planApi.setGoal(newGoal as GoalForm);

            navigate('/');
        } catch (error) {
            console.error('Error during onboarding:', error);
            alert('Une erreur est survenue lors de la création de votre programme.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='bg-background flex items-center justify-center p-4'>
            <Card className='border-border bg-card w-full max-w-[600px] border shadow-2xl'>
                <CardHeader>
                    <div className='bg-muted mb-6 h-1 w-full overflow-hidden rounded-full'>
                        <div
                            className='bg-primary h-full transition-all duration-500 ease-out'
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                    <CardTitle className='text-foreground text-3xl font-bold'>
                        {stepsDict[step].title}
                    </CardTitle>
                    <CardDescription>{stepsDict[step].description}</CardDescription>
                </CardHeader>

                <CardContent className='py-6'>
                    {step === 1 && <PlanSelector newGoal={newGoal} setNewGoal={setNewGoal} />}

                    {step === 2 && <VolumeSelector newGoal={newGoal} setNewGoal={setNewGoal} />}
                </CardContent>

                <CardFooter className='flex justify-between gap-4 pt-6'>
                    {step === 1 && (
                        <Button
                            className='bg-primary text-primary-foreground flex-1 transition-opacity hover:opacity-90'
                            onClick={() => setStep(step + 1)}
                            disabled={
                                newGoal.targetDistance === undefined ||
                                newGoal.raceDate === undefined
                            }
                        >
                            Suivant
                        </Button>
                    )}
                    {step === 2 && (
                        <>
                            <Button
                                variant='outline'
                                className='border-border flex-1'
                                onClick={() => setStep(step - 1)}
                            >
                                Retour
                            </Button>
                            <Button
                                className='bg-primary text-primary-foreground flex-1 transition-opacity hover:opacity-90'
                                onClick={handleSubmit}
                                disabled={isLoading || newGoal.weeklyTrainingNumbers === undefined}
                            >
                                {isLoading ? 'Génération...' : 'Générer mon programme'}
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};
