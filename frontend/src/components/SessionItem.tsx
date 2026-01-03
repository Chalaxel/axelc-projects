import { Session, SportEnum } from '@shared/types';

interface SessionItemProps {
    session: Session;
    onEdit: (session: Session) => void;
    onDelete: (id: string) => void;
}

const getSportLabel = (sport: SportEnum): string => {
    switch (sport) {
        case SportEnum.RUN:
            return 'Course';
        case SportEnum.SWIM:
            return 'Natation';
        case SportEnum.CYCLING:
            return 'Vélo';
        default:
            return sport;
    }
};

const getTotalDuration = (blocks: { duration: number }[]): number => {
    return blocks.reduce((total, block) => total + (block.duration || 0), 0);
};

export const SessionItem = ({ session, onEdit, onDelete }: SessionItemProps) => {
    const totalDuration = getTotalDuration(session.blocks || []);
    const blocksCount = session.blocks?.length || 0;

    return (
        <div
            style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                    <h3
                        style={{
                            margin: 0,
                            marginBottom: '0.5rem',
                            color: '#333',
                        }}
                    >
                        {getSportLabel(session.sport)}
                    </h3>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        <p style={{ margin: '0.25rem 0' }}>
                            {blocksCount} bloc{blocksCount > 1 ? 's' : ''} • Durée totale : {totalDuration} min
                        </p>
                        {session.blocks && session.blocks.length > 0 && (
                            <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                                {session.blocks.map((block, index) => (
                                    <div key={index} style={{ marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>Bloc {index + 1}:</span> {block.duration} min
                                        {block.note && <span style={{ color: '#888' }}> - {block.note}</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => onEdit(session)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        Éditer
                    </button>
                    <button
                        onClick={() => onDelete(session.id)}
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
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};
