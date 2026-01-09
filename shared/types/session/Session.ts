export enum SportEnum {
    RUN = 'run',
    SWIM = 'swim',
    CYCLING = 'cycling',
}

export enum TriathlonDistance {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
}

export enum StrokeEnum {
    CRAWL = 'crawl',
    BREASTSTROKE = 'breaststroke',
    BACKSTROKE = 'backstroke',
    BUTTERFLYSTROKE = 'butterflystroke',
    FREE = 'free',
}

export const RunGoalAttributes = ['distance', 'time', 'pace'];
export const SwimGoalAttributes = ['lengths', 'stroke', 'rpe', 'pace'];
export const CyclingGoalAttributes = ['speed', 'power', 'cadence'];

export type StepGoal = {
    distance?: number;
    time?: number;
    pace?: number;
    lengths?: number;
    stroke?: StrokeEnum;
    rpe?: number;
    speed?: number;
    power?: number;
    cadence?: number;
};

export type Step = {
    goal?: StepGoal;
    recovery?: number;
    note?: string;
};

export enum SessionBlockType {
    SIMPLE = 'simple',
    SERIES = 'series',
}

export type SessionBlock = {
    type: SessionBlockType;
    note?: string;
    goal?: StepGoal;
    repetitions?: number;
    recovery?: number;
    steps?: Step[];
};

export type SessionData = {
    notes?: string;
};

export interface Session {
    id: string;
    sport: SportEnum;
    blocks: SessionBlock[];
    data: SessionData;
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SessionCreationAttributes {
    sport: SportEnum;
    blocks?: SessionBlock[];
    data?: SessionData;
    userId?: string;
}

export interface TriathlonPlan {
    id: string;
    userId: string;
    distance: TriathlonDistance;
    weeklyHours: number;
    startDate: string;
    endDate: string; // Race date
    sessions?: Session[];
    createdAt: string;
    updatedAt: string;
}

export interface TriathlonPlanCreationAttributes {
    userId: string;
    distance: TriathlonDistance;
    weeklyHours: number;
    startDate: string;
    endDate: string;
}

export default Session;
