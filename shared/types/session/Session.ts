export enum SportEnum {
    RUN = 'run',
    SWIM = 'swim',
    CYCLING = 'cycling',
}

interface SessionBlock {
    duration: number;
    note?: string;
}

export interface Session {
    id: string;
    sport: SportEnum;
    blocks: SessionBlock[];
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SessionCreationAttributes {
    sport: SportEnum;
    blocks?: SessionBlock[];
    userId?: string;
}

export default Session;
