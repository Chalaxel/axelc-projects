import { useState, useEffect } from 'react';
import { Session, SessionCreationAttributes } from '@shared/types';
import { SessionItem } from './SessionItem';
import { SessionForm } from './SessionForm';
import { sessionApi } from '../services/sessionApi';
import { useAuth } from '../context/AuthContext';

export const SessionList = () => {
    const { user, logout } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [showForm, setShowForm] = useState(false);

    const loadSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await sessionApi.getSessions();
            setSessions(data);
        } catch (err) {
            setError('Erreur lors du chargement des sessions');
            console.error('Error loading sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleCreate = async (data: SessionCreationAttributes) => {
        try {
            await sessionApi.createSession(data);
            await loadSessions();
            setShowForm(false);
        } catch (err) {
            setError('Erreur lors de la création de la session');
            console.error('Error creating session:', err);
        }
    };

    const handleUpdate = async (data: SessionCreationAttributes) => {
        if (!editingSession) return;
        try {
            await sessionApi.updateSession(editingSession.id, data);
            await loadSessions();
            setEditingSession(null);
        } catch (err) {
            setError('Erreur lors de la mise à jour de la session');
            console.error('Error updating session:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
            return;
        }
        try {
            await sessionApi.deleteSession(id);
            await loadSessions();
            if (editingSession?.id === id) {
                setEditingSession(null);
            }
        } catch (err) {
            setError('Erreur lors de la suppression de la session');
            console.error('Error deleting session:', err);
        }
    };

    const handleEdit = (session: Session) => {
        setEditingSession(session);
        setShowForm(false);
    };

    const handleCancelEdit = () => {
        setEditingSession(null);
    };

    const handleCancelCreate = () => {
        setShowForm(false);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                }}
            >
                <h1 style={{ margin: 0, color: '#333' }}>{"Mes Séances d'Entraînement"}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user && (
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>{user.email}</span>
                    )}
                    <button
                        onClick={logout}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        Déconnexion
                    </button>
                </div>
            </div>

            {error && (
                <div
                    style={{
                        padding: '1rem',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                    }}
                >
                    {error}
                </div>
            )}

            {!showForm && !editingSession && (
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        + Nouvelle séance
                    </button>
                </div>
            )}

            {showForm && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', color: '#333' }}>
                        Créer une nouvelle séance
                    </h2>
                    <SessionForm onSubmit={handleCreate} onCancel={handleCancelCreate} />
                </div>
            )}

            {editingSession && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', color: '#333' }}>Éditer la séance</h2>
                    <SessionForm
                        onSubmit={handleUpdate}
                        onCancel={handleCancelEdit}
                        initialData={{
                            sport: editingSession.sport,
                            blocks: editingSession.blocks,
                        }}
                    />
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sessions.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: '#666',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                        }}
                    >
                        <p>Aucune séance pour le moment. Créez-en une ci-dessus !</p>
                    </div>
                ) : (
                    sessions.map(session => (
                        <SessionItem
                            key={session.id}
                            session={session}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
