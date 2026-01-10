import { SportEnum, StepGoal, StrokeEnum } from '@shared/types';

export const getSportLabel = (sport: SportEnum): string => {
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

export const getDistanceUnit = (sport: SportEnum): string => {
    switch (sport) {
        case SportEnum.RUN:
            return 'm ou km';
        case SportEnum.SWIM:
            return 'm';
        case SportEnum.CYCLING:
            return 'km';
        default:
            return 'm';
    }
};

export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
        return `${minutes}min${remainingSeconds > 0 ? remainingSeconds + 's' : ''}`;
    }
    return `${seconds}s`;
};

export const formatGoal = (goal: StepGoal | undefined, sport: SportEnum): string => {
    if (!goal) return '';
    const parts: string[] = [];

    // Longueur
    if (goal.distance !== undefined) {
        const unit =
            sport === SportEnum.SWIM ? 'm' : sport === SportEnum.CYCLING ? 'km' : 'm ou km';
        parts.push(`${goal.distance}${unit}`);
    } else if (goal.time !== undefined) {
        parts.push(formatTime(goal.time));
    }

    // Objectifs
    if (sport === SportEnum.RUN && goal.pace !== undefined) {
        parts.push(`Allure: ${goal.pace}min/km`);
    }

    if (sport === SportEnum.SWIM) {
        if (goal.speed !== undefined) {
            parts.push(`Vitesse: ${goal.speed}min/100m`);
        }
        if (goal.lengths !== undefined) {
            parts.push(`${goal.lengths} longueur${goal.lengths > 1 ? 's' : ''}`);
        }
        if (goal.stroke) {
            const strokeLabels: Record<StrokeEnum, string> = {
                [StrokeEnum.CRAWL]: 'Crawl',
                [StrokeEnum.BREASTSTROKE]: 'Brasse',
                [StrokeEnum.BACKSTROKE]: 'Dos',
                [StrokeEnum.BUTTERFLYSTROKE]: 'Papillon',
                [StrokeEnum.FREE]: 'Libre',
            };
            parts.push(strokeLabels[goal.stroke] || goal.stroke);
        }
    }

    if (sport === SportEnum.CYCLING) {
        if (goal.power !== undefined) {
            parts.push(`Puissance: ${goal.power}W`);
        }
        if (goal.cadence !== undefined) {
            parts.push(`Cadence: ${goal.cadence}rpm`);
        }
        if (goal.speed !== undefined) {
            parts.push(`Vitesse: ${goal.speed}km/h`);
        }
    }

    return parts.join(' • ');
};

export const getStrokeOptions = (): Array<{
    value: StrokeEnum;
    label: string;
}> => {
    return [
        { value: StrokeEnum.CRAWL, label: 'Crawl' },
        { value: StrokeEnum.BREASTSTROKE, label: 'Brasse' },
        { value: StrokeEnum.BACKSTROKE, label: 'Dos' },
        { value: StrokeEnum.BUTTERFLYSTROKE, label: 'Papillon' },
        { value: StrokeEnum.FREE, label: 'Libre' },
    ];
};
