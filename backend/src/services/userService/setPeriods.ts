import { GoalAttributes } from '@shared/types';
import { nextMonday } from 'date-fns';

export const setPeriods = (goal: GoalAttributes) => {
    const startDate = nextMonday(new Date());
    const raceDate = new Date(goal.raceDate);
    const numberOfWeeks = Math.ceil(
        (raceDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );

    const getCycleNumber = (numberOfWeeks: number) => {
        return Math.floor(numberOfWeeks / 4);
    };

    const taperNb = 1;

    let cycleNumber = getCycleNumber(numberOfWeeks - taperNb);
    const prepNb = numberOfWeeks - taperNb - cycleNumber * 4;

    let generalNb = 0;
    let specificNb = 0;

    while (cycleNumber > 0) {
        if (cycleNumber % 2 === 1) {
            generalNb += 4;
        } else {
            specificNb += 4;
        }
        cycleNumber -= 1;
    }

    return {
        preparation: prepNb,
        general: generalNb,
        specific: specificNb,
        taper: taperNb,
    };
};
