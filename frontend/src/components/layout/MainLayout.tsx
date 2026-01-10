import { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className='bg-background flex min-h-screen flex-col'>
            <Header />
            <main className='mx-auto w-full max-w-7xl px-6 py-8'>{children}</main>
            <footer className='border-border mt-auto border-t py-8'>
                <div className='mx-auto max-w-7xl px-6'>
                    <p className='text-muted-foreground text-center text-[10px] font-black tracking-[0.2em] uppercase'>
                        &copy; {new Date().getFullYear()} P3RF - Votre coach triathlon intelligent
                    </p>
                </div>
            </footer>
        </div>
    );
};
