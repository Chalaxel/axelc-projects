import { Session, SessionBlockType } from '@shared/types';
import { getSportLabel } from '../utils/sessionHelpers';
import { BlockDisplay } from './blocks/BlockDisplay';
import { formStyles } from '../styles/formStyles';

interface SessionItemProps {
    session: Session;
    onEdit: (session: Session) => void;
    onDelete: (id: string) => void;
}

export const SessionItem = ({ session, onEdit, onDelete }: SessionItemProps) => {
    const blocksCount = session.blocks?.length || 0;
    const simpleBlocksCount =
        session.blocks?.filter(b => b.type === SessionBlockType.SIMPLE).length || 0;
    const seriesCount = session.blocks?.filter(b => b.type === SessionBlockType.SERIES).length || 0;

    return (
        <div
            style={{
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
                marginBottom: '1rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                }}
            >
                <div style={{ flex: 1 }}>
                    <h3
                        style={{
                            margin: 0,
                            marginBottom: '0.5rem',
                            color: '#333',
                            fontSize: '1.25rem',
                        }}
                    >
                        {getSportLabel(session.sport)}
                    </h3>
                    <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {blocksCount > 0 && (
                            <span>
                                {blocksCount} bloc{blocksCount > 1 ? 's' : ''}
                                {simpleBlocksCount > 0 && seriesCount > 0 && (
                                    <span>
                                        {' '}
                                        ({simpleBlocksCount} simple
                                        {simpleBlocksCount > 1 ? 's' : ''}, {seriesCount} série
                                        {seriesCount > 1 ? 's' : ''})
                                    </span>
                                )}
                            </span>
                        )}
                    </div>

                    {session.data?.notes && (
                        <div
                            style={{
                                marginTop: '0.75rem',
                                padding: '0.75rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                            }}
                        >
                            <div style={{ marginTop: '0.5rem', color: '#666' }}>
                                <strong>Notes:</strong> {session.data.notes}
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => onEdit(session)}
                        style={{
                            ...formStyles.button,
                            padding: '0.5rem 1rem',
                            ...formStyles.buttonPrimary,
                            fontSize: '0.9rem',
                        }}
                    >
                        Éditer
                    </button>
                    <button
                        onClick={() => onDelete(session.id)}
                        style={{
                            ...formStyles.button,
                            padding: '0.5rem 1rem',
                            ...formStyles.buttonDanger,
                            fontSize: '0.9rem',
                        }}
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            {session.blocks && session.blocks.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    {session.blocks.map((block, index) => (
                        <BlockDisplay key={index} block={block} sport={session.sport} />
                    ))}
                </div>
            )}
        </div>
    );
};
