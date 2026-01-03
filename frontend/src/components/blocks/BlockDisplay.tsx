import { SessionBlock, SportEnum, SessionBlockType } from '@shared/types';
import { formatGoal } from '../../utils/sessionHelpers';
import { formStyles } from '../../styles/formStyles';

interface BlockDisplayProps {
    block: SessionBlock;
    sport: SportEnum;
}

export const BlockDisplay = ({ block, sport }: BlockDisplayProps) => {
    if (block.type === SessionBlockType.SIMPLE) {
        return (
            <div
                style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    backgroundColor: '#f8f9fa',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                    }}
                >
                    <span style={{ ...formStyles.badge, backgroundColor: '#007bff' }}>
                        Bloc simple
                    </span>
                </div>
                {block.goal && (
                    <div style={{ marginBottom: '0.5rem', color: '#333', fontSize: '0.9rem' }}>
                        {formatGoal(block.goal, sport)}
                    </div>
                )}
                {block.note && (
                    <div
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            color: '#666',
                        }}
                    >
                        <strong>Note:</strong> {block.note}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#f8f9fa',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                }}
            >
                <span style={{ ...formStyles.badge, backgroundColor: '#28a745' }}>
                    Série × {block.repetitions}
                </span>
                {block.recovery !== undefined && (
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                        Récupération entre séries: {block.recovery}s
                    </span>
                )}
            </div>

            <div style={{ marginLeft: '1rem' }}>
                {block.steps?.map((step, stepIndex) => (
                    <div
                        key={stepIndex}
                        style={{
                            marginBottom: '0.75rem',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                            }}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#666' }}>
                                Étape {stepIndex + 1}
                            </span>
                            {step.recovery !== undefined && (
                                <span style={{ fontSize: '0.85rem', color: '#888' }}>
                                    Récup: {step.recovery}s
                                </span>
                            )}
                        </div>
                        {step.goal && (
                            <div
                                style={{
                                    marginBottom: '0.5rem',
                                    color: '#333',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {formatGoal(step.goal, sport)}
                            </div>
                        )}
                        {step.note && (
                            <div
                                style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.85rem',
                                    color: '#666',
                                    fontStyle: 'italic',
                                }}
                            >
                                {step.note}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {block.note && (
                <div
                    style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        color: '#666',
                    }}
                >
                    <strong>Note série:</strong> {block.note}
                </div>
            )}
        </div>
    );
};
