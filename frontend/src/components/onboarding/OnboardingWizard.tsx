import React, { useState } from 'react';
import { TriathlonDistance, UserLevel, UserGoal } from '@shared/types';
import { planApi } from '../../services/planApi';
import { useAuth } from '../../context/AuthContext';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const nextMonday = () => {
    const today = new Date();
    const daysUntilNextMonday = (1 - today.getDay() + 7) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    return nextMonday.toISOString().split('T')[0];
};

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
            const updatedUser = await planApi.addGoal(newGoal);
            updateUser(updatedUser);

            const startDate = nextMonday();
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
        <div className='bg-background flex min-h-screen items-center justify-center p-4'>
            <Card className='border-border bg-card w-full max-w-[600px] border shadow-2xl'>
                <CardHeader>
                    <div className='bg-muted mb-6 h-1 w-full overflow-hidden rounded-full'>
                        <div
                            className='bg-primary h-full transition-all duration-500 ease-out'
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                    <CardTitle className='text-foreground text-3xl font-bold'>
                        {step === 1 && 'Quel est votre objectif ?'}
                        {step === 2 && 'Votre profil de sportif'}
                        {step === 3 && 'Votre date de course'}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && 'Choisissez la distance de triathlon que vous visez.'}
                        {step === 2 && 'Dites-en nous plus sur votre niveau et vos disponibilités.'}
                        {step === 3 &&
                            'Fixez la date de votre compétition pour caler votre pic de forme.'}
                    </CardDescription>
                </CardHeader>

                <CardContent className='py-6'>
                    {step === 1 && (
                        <div className='grid grid-cols-2 gap-4'>
                            {Object.values(TriathlonDistance).map(d => (
                                <Button
                                    key={d}
                                    variant={newGoal.targetDistance === d ? 'default' : 'outline'}
                                    className={`h-24 text-lg font-bold transition-all ${
                                        newGoal.targetDistance === d
                                            ? 'bg-primary text-primary-foreground shadow-lg'
                                            : 'border-border hover:bg-muted'
                                    }`}
                                    onClick={() => setNewGoal({ ...newGoal, targetDistance: d })}
                                >
                                    {d}
                                </Button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className='space-y-10'>
                            <div className='space-y-4'>
                                <Label className='text-sm tracking-widest text-slate-400 uppercase'>
                                    Niveau actuel
                                </Label>
                                <div className='grid grid-cols-3 gap-3'>
                                    {Object.values(UserLevel).map(l => (
                                        <Button
                                            key={l}
                                            variant={newGoal.level === l ? 'default' : 'outline'}
                                            className={`transition-all ${
                                                newGoal.level === l
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'border-border hover:bg-muted'
                                            }`}
                                            onClick={() => setNewGoal({ ...newGoal, level: l })}
                                        >
                                            {l.charAt(0).toUpperCase() + l.slice(1)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <div className='flex items-end justify-between'>
                                    <Label className='text-muted-foreground text-sm tracking-widest uppercase'>
                                        Temps disponible par semaine
                                    </Label>
                                    <span className='text-primary text-2xl font-bold'>
                                        {newGoal.weeklyAvailability}h
                                    </span>
                                </div>
                                <Slider
                                    defaultValue={[newGoal.weeklyAvailability]}
                                    max={25}
                                    min={3}
                                    step={1}
                                    className='py-4'
                                    onValueChange={vals =>
                                        setNewGoal({ ...newGoal, weeklyAvailability: vals[0] })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className='space-y-4'>
                            <Label htmlFor='race-date'>Date de la compétition</Label>
                            <Input
                                id='race-date'
                                type='date'
                                className='border-border bg-muted/30 h-12 font-bold'
                                value={newGoal.raceDate}
                                onChange={e => setNewGoal({ ...newGoal, raceDate: e.target.value })}
                            />
                        </div>
                    )}
                </CardContent>

                <CardFooter className='flex justify-between gap-4 pt-6'>
                    {step > 1 && (
                        <Button
                            variant='outline'
                            className='border-border flex-1'
                            onClick={() => setStep(step - 1)}
                        >
                            Retour
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button
                            className='bg-primary text-primary-foreground flex-1 transition-opacity hover:opacity-90'
                            onClick={() => setStep(step + 1)}
                        >
                            Suivant
                        </Button>
                    ) : (
                        <Button
                            className='bg-primary text-primary-foreground flex-1 transition-opacity hover:opacity-90'
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Génération...' : 'Générer mon programme'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};
