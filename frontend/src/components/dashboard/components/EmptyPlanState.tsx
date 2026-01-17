import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

export const EmptyPlanState: React.FC = () => {
    return (
        <div className='flex min-h-[80vh] items-center justify-center px-4'>
            <Card className='border-border bg-card w-full max-w-md border-dashed shadow-xl'>
                <CardHeader className='text-center'>
                    <div className='border-primary/20 bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border'>
                        <Target className='text-primary h-8 w-8' />
                    </div>
                    <CardTitle className='text-foreground text-2xl font-bold'>
                        Aucun objectif fixé
                    </CardTitle>
                    <CardDescription className='text-muted-foreground'>
                        Vous n&apos;avez pas encore de programme d&apos;entraînement. Commencez par
                        fixer un nouvel objectif pour générer votre coaching personnalisé.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex justify-center pb-8'>
                    <Button
                        className='bg-primary text-primary-foreground px-8 font-bold shadow-lg transition-all hover:scale-105 active:scale-95'
                        onClick={() => (window.location.href = '/onboarding')}
                    >
                        Démarrer mon coaching
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
