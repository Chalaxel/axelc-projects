import { SportEnum, StepGoal, StrokeEnum } from '@shared/types';
import { getDistanceUnit, getStrokeOptions } from '../../utils/sessionHelpers';

interface GoalFieldsProps {
    goal: StepGoal | undefined;
    sport: SportEnum;
    onChange: (field: keyof StepGoal, value: number | string | undefined) => void;
}

export const GoalFields = ({ goal, sport, onChange }: GoalFieldsProps) => {
    const goalData = goal || {};
    const lengthTypeId = `length-type-${Math.random()}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <LengthField
                goalData={goalData}
                sport={sport}
                lengthTypeId={lengthTypeId}
                onChange={onChange}
            />
            <ObjectiveField goalData={goalData} sport={sport} onChange={onChange} />
        </div>
    );
};

interface LengthFieldProps {
    goalData: StepGoal;
    sport: SportEnum;
    lengthTypeId: string;
    onChange: (field: keyof StepGoal, value: number | string | undefined) => void;
}

const LengthField = ({ goalData, sport, lengthTypeId, onChange }: LengthFieldProps) => {
    return (
        <div>
            <label
                style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                }}
            >
                Longueur
            </label>
            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                }}
            >
                <label
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer',
                    }}
                >
                    <input
                        type='number'
                        name={lengthTypeId}
                        value={goalData.distance}
                        onChange={() => {
                            onChange('distance', goalData.distance || 0);
                            onChange('time', undefined);
                        }}
                    />
                    <span>Distance ({getDistanceUnit(sport)})</span>
                </label>
                <label
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        cursor: 'pointer',
                    }}
                >
                    <input
                        type='number'
                        name={lengthTypeId}
                        value={goalData.time}
                        onChange={() => {
                            onChange('time', goalData.time || 0);
                            onChange('distance', undefined);
                        }}
                    />
                    <span>Temps (secondes)</span>
                </label>
            </div>
            {goalData.distance !== undefined && (
                <input
                    type='number'
                    min='0'
                    step='0.01'
                    value={goalData.distance || ''}
                    onChange={e =>
                        onChange('distance', e.target.value ? Number(e.target.value) : undefined)
                    }
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                    }}
                    placeholder={`Distance en ${getDistanceUnit(sport)}`}
                />
            )}
            {goalData.time !== undefined && (
                <input
                    type='number'
                    min='0'
                    value={goalData.time || ''}
                    onChange={e =>
                        onChange('time', e.target.value ? Number(e.target.value) : undefined)
                    }
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                    }}
                    placeholder='Temps en secondes'
                />
            )}
        </div>
    );
};

interface ObjectiveFieldProps {
    goalData: StepGoal;
    sport: SportEnum;
    onChange: (field: keyof StepGoal, value: number | string | undefined) => void;
}

const ObjectiveField = ({ goalData, sport, onChange }: ObjectiveFieldProps) => {
    return (
        <div>
            <label
                style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                }}
            >
                Objectif
            </label>
            {sport === SportEnum.RUN && (
                <input
                    type='number'
                    min='0'
                    step='0.01'
                    value={goalData.pace || ''}
                    onChange={e =>
                        onChange('pace', e.target.value ? Number(e.target.value) : undefined)
                    }
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                    }}
                    placeholder='Allure (min/km)'
                />
            )}
            {sport === SportEnum.SWIM && (
                <SwimObjectiveFields goalData={goalData} onChange={onChange} />
            )}
            {sport === SportEnum.CYCLING && (
                <CyclingObjectiveFields goalData={goalData} onChange={onChange} />
            )}
        </div>
    );
};

interface SwimObjectiveFieldsProps {
    goalData: StepGoal;
    onChange: (field: keyof StepGoal, value: number | string | undefined) => void;
}

const SwimObjectiveFields = ({ goalData, onChange }: SwimObjectiveFieldsProps) => {
    const strokeOptions = getStrokeOptions();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
                type='number'
                min='0'
                step='0.01'
                value={goalData.speed || ''}
                onChange={e =>
                    onChange('speed', e.target.value ? Number(e.target.value) : undefined)
                }
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                }}
                placeholder='Vitesse (min/100m)'
            />
            <input
                type='number'
                min='0'
                value={goalData.lengths || ''}
                onChange={e =>
                    onChange('lengths', e.target.value ? Number(e.target.value) : undefined)
                }
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                }}
                placeholder='Nombre de longueurs (optionnel)'
            />
            <select
                value={goalData.stroke || ''}
                onChange={e =>
                    onChange('stroke', e.target.value ? (e.target.value as StrokeEnum) : undefined)
                }
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                }}
            >
                <option value=''>Style (optionnel)</option>
                {strokeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

interface CyclingObjectiveFieldsProps {
    goalData: StepGoal;
    onChange: (field: keyof StepGoal, value: number | string | undefined) => void;
}

const CyclingObjectiveFields = ({ goalData, onChange }: CyclingObjectiveFieldsProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
                type='number'
                min='0'
                value={goalData.power || ''}
                onChange={e =>
                    onChange('power', e.target.value ? Number(e.target.value) : undefined)
                }
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                }}
                placeholder='Puissance (W)'
            />
            <input
                type='number'
                min='0'
                value={goalData.cadence || ''}
                onChange={e =>
                    onChange('cadence', e.target.value ? Number(e.target.value) : undefined)
                }
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                }}
                placeholder='Cadence (rpm, optionnel)'
            />
            <input
                type='number'
                min='0'
                step='0.1'
                value={goalData.speed || ''}
                onChange={e =>
                    onChange('speed', e.target.value ? Number(e.target.value) : undefined)
                }
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                }}
                placeholder='Vitesse (km/h, optionnel)'
            />
        </div>
    );
};
