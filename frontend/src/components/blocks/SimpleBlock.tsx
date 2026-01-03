import { SessionBlock, SportEnum, StepGoal } from '@shared/types';
import { GoalFields } from '../goals/GoalFields';
import { formStyles } from '../../styles/formStyles';

interface SimpleBlockProps {
    block: SessionBlock;
    sport: SportEnum;
    onGoalChange: (field: keyof StepGoal, value: number | string | undefined) => void;
    onNoteChange: (value: string) => void;
    onRemove: () => void;
}

export const SimpleBlock = ({
    block,
    sport,
    onGoalChange,
    onNoteChange,
    onRemove,
}: SimpleBlockProps) => {
    return (
        <div style={formStyles.card}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                }}
            >
                <span style={{ ...formStyles.badge, backgroundColor: '#007bff' }}>Bloc simple</span>
                <button
                    type='button'
                    onClick={onRemove}
                    style={{
                        ...formStyles.button,
                        padding: '0.25rem 0.75rem',
                        ...formStyles.buttonDanger,
                        fontSize: '0.85rem',
                    }}
                >
                    Supprimer
                </button>
            </div>
            <GoalFields goal={block.goal} sport={sport} onChange={onGoalChange} />
            <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Notes (optionnel)
                </label>
                <textarea
                    value={block.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    style={formStyles.textarea}
                    placeholder='Notes sur ce bloc...'
                />
            </div>
        </div>
    );
};
