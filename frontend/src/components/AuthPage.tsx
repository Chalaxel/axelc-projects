import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    return (
        <div className='bg-background flex min-h-screen items-center justify-center'>
            <Card className='w-full max-w-[500px] shadow-lg'>
                <CardHeader>
                    <CardTitle className='text-foreground text-center text-3xl font-bold'>
                        Mes Séances d'Entraînement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='border-border mb-8 flex border-b'>
                        <Button
                            variant='ghost'
                            className={`flex-1 rounded-none border-b-2 transition-all hover:bg-transparent ${
                                activeTab === 'login'
                                    ? 'border-primary text-primary font-bold'
                                    : 'text-muted-foreground border-transparent'
                            }`}
                            onClick={() => setActiveTab('login')}
                        >
                            Connexion
                        </Button>
                        <Button
                            variant='ghost'
                            className={`flex-1 rounded-none border-b-2 transition-all hover:bg-transparent ${
                                activeTab === 'register'
                                    ? 'border-primary text-primary font-bold'
                                    : 'text-muted-foreground border-transparent'
                            }`}
                            onClick={() => setActiveTab('register')}
                        >
                            Inscription
                        </Button>
                    </div>

                    {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
                </CardContent>
            </Card>
        </div>
    );
};
