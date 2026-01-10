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
        <div className='bg-background flex min-h-screen items-center justify-center p-4'>
            <Card className='w-full max-w-[600px] border-none bg-slate-900/50 shadow-2xl backdrop-blur-xl'>
                <CardHeader>
                    <div className='mb-6 h-1 w-full overflow-hidden rounded-full bg-white/10'>
                        <div
                            className='h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out'
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                    <CardTitle className='bg-gradient-to-r from-white to-slate-400 bg-clip-text text-3xl font-bold text-transparent'>
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
                                            ? 'bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:bg-blue-700'
                                            : 'border-white/10 hover:bg-white/5'
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
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : 'border-white/10 hover:bg-white/5'
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
                                    <Label className='text-sm tracking-widest text-slate-400 uppercase'>
                                        Temps disponible par semaine
                                    </Label>
                                    <span className='text-2xl font-bold text-blue-400'>
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
                                className='h-12 border-white/10 bg-white/5'
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
                            className='flex-1 border-white/10'
                            onClick={() => setStep(step - 1)}
                        >
                            Retour
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button
                            className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 transition-opacity hover:opacity-90'
                            onClick={() => setStep(step + 1)}
                        >
                            Suivant
                        </Button>
                    ) : (
                        <Button
                            className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 transition-opacity hover:opacity-90'
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
