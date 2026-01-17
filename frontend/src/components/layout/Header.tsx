import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Calendar, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    return (
        <header className='bg-background/80 border-border sticky top-0 z-50 w-full border-b backdrop-blur-md'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6'>
                <div className='flex items-center gap-8'>
                    <div
                        className='hover:text-primary cursor-pointer text-xl font-black tracking-tighter uppercase transition-colors'
                        onClick={() => navigate('/')}
                    >
                        P3RF
                    </div>

                    <nav className='hidden items-center gap-1 md:flex'>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => navigate('/')}
                            className={`text-xs font-bold tracking-widest uppercase transition-all ${
                                path === '/'
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                            }`}
                        >
                            <LayoutDashboard className='mr-2 h-4 w-4' />
                            Dashboard
                        </Button>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => navigate('/sessions')}
                            className={`text-xs font-bold tracking-widest uppercase transition-all ${
                                path === '/sessions'
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                            }`}
                        >
                            <Calendar className='mr-2 h-4 w-4' />
                            Séances
                        </Button>
                    </nav>
                </div>

                <div className='flex items-center gap-4'>
                    {user && (
                        <div className='mr-2 hidden flex-col items-end gap-0 md:flex'>
                            <span className='text-foreground text-[10px] font-black tracking-widest uppercase'>
                                {user.email?.split('@')[0]}
                            </span>
                            <span className='text-muted-foreground text-[8px] font-bold uppercase'>
                                Athlète
                            </span>
                        </div>
                    )}

                    <Button
                        variant='ghost'
                        size='icon'
                        className='text-muted-foreground hover:bg-primary/5 hover:text-primary'
                    >
                        <User className='h-5 w-5' />
                    </Button>

                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={logout}
                        className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                    >
                        <LogOut className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </header>
    );
};
