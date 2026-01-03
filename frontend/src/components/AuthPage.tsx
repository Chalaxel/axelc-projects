import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    return (
        <div
            style={{
                maxWidth: '500px',
                margin: '2rem auto',
                padding: '2rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                {"Mes Séances d'Entraînement"}
            </h1>

            <div
                style={{
                    display: 'flex',
                    borderBottom: '2px solid #ddd',
                    marginBottom: '2rem',
                }}
            >
                <button
                    onClick={() => setActiveTab('login')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: activeTab === 'login' ? 'bold' : 'normal',
                        color: activeTab === 'login' ? '#007bff' : '#666',
                        borderBottom: activeTab === 'login' ? '2px solid #007bff' : 'none',
                        marginBottom: '-2px',
                    }}
                >
                    Connexion
                </button>
                <button
                    onClick={() => setActiveTab('register')}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: activeTab === 'register' ? 'bold' : 'normal',
                        color: activeTab === 'register' ? '#007bff' : '#666',
                        borderBottom: activeTab === 'register' ? '2px solid #007bff' : 'none',
                        marginBottom: '-2px',
                    }}
                >
                    Inscription
                </button>
            </div>

            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
    );
};
