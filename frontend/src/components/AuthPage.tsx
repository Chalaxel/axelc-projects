import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    return (
        <div className='flex items-center justify-center min-h-screen bg-background'>
            <Card className='w-full max-w-[500px] shadow-lg'>
                <CardHeader>
                    <CardTitle className='text-center text-3xl font-bold text-foreground'>
                        Mes Séances d'Entraînement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex border-b border-border mb-8'>
                        <Button
                            variant='ghost'
                            className={`flex-1 rounded-none border-b-2 hover:bg-transparent transition-all ${
                                activeTab === 'login'
                                    ? 'border-primary font-bold text-primary'
                                    : 'border-transparent text-muted-foreground'
                            }`}
                            onClick={() => setActiveTab('login')}
                        >
                            Connexion
                        </Button>
                        <Button
                            variant='ghost'
                            className={`flex-1 rounded-none border-b-2 hover:bg-transparent transition-all ${
                                activeTab === 'register'
                                    ? 'border-primary font-bold text-primary'
                                    : 'border-transparent text-muted-foreground'
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
