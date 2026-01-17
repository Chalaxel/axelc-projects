import { TriathlonDistance } from '@shared/types';
import { Button } from '../ui/button';
import { GoalForm } from '@shared/types/goal/Goal';
import { useCallback } from 'react';

const MIN_TRAINING_DICT = {
    [TriathlonDistance.S]: 3,
    [TriathlonDistance.M]: 4,
    [TriathlonDistance.L]: 5,
    [TriathlonDistance.XL]: 6,
};

const MAX_TRAINING_NUMBER = 12;

export const VolumeSelector = ({
    newGoal,
    setNewGoal,
}: {
    newGoal: Partial<GoalForm>;
    setNewGoal: (newGoal: Partial<GoalForm>) => void;
}) => {
    const minTrainingNumber = MIN_TRAINING_DICT[newGoal.targetDistance!];

    const weeklyTrainingNumber = newGoal.weeklyTrainingNumbers;
    const setWeeklyTrainingNumber = useCallback(
        (number: number) => {
            setNewGoal({ ...newGoal, weeklyTrainingNumbers: number });
        },
        [newGoal, setNewGoal],
    );

    const options = Array.from(
        { length: MAX_TRAINING_NUMBER - minTrainingNumber + 1 },
        (_, i) => i + minTrainingNumber,
    );

    return (
        <div className='space-y-10'>
            <div className='flex flex-col gap-3'>
                {options.map(l => (
                    <Button
                        key={l}
                        className={
                            weeklyTrainingNumber === l
                                ? 'bg-primary text-primary-foreground justify-start transition-all'
                                : 'bg-muted/50 text-muted-foreground justify-start transition-all'
                        }
                        onClick={() => setWeeklyTrainingNumber(l)}
                    >
                        {`${l} séances / semaines`}
                    </Button>
                ))}
            </div>
        </div>
    );
};
