import { SportEnum } from '@shared/types/session';
import { TrainingPhase, WorkoutTemplate } from '@shared/types/training';

export const WORKOUT_LIBRARY: WorkoutTemplate[] = [
    // --- SWIM ---
    {
        id: 'swim_base_endurance',
        name: 'Endurance Swim',
        sport: SportEnum.SWIM,
        phases: [
            TrainingPhase.PREP,
            TrainingPhase.BASE_1,
            TrainingPhase.BASE_2,
            TrainingPhase.BASE_3,
        ],
        goal: 'Aerobic Endurance',
        durationFactor: 1.0,
        blocks: [
            { type: 'warmup', description: '200m Easy Choice', durationMinutes: 10 },
            { type: 'drill', description: '4x50m Drills (Catch-up / Fist)', durationMinutes: 10 },
            { type: 'main', description: 'Continuous swim at Z2 (Aerobic)', durationMinutes: 30 },
            { type: 'cooldown', description: '100m Easy', durationMinutes: 5 },
        ],
    },
    {
        id: 'swim_threshold',
        name: 'Threshold Intervals',
        sport: SportEnum.SWIM,
        phases: [TrainingPhase.BUILD_1, TrainingPhase.BUILD_2],
        goal: 'Threshold Pace',
        durationFactor: 1.0,
        blocks: [
            { type: 'warmup', description: '300m Choice + 4x50m Build', durationMinutes: 15 },
            {
                type: 'main',
                description: '10x100m @ Threshold Pace / 20s rest',
                durationMinutes: 30,
            },
            { type: 'cooldown', description: '200m Easy', durationMinutes: 5 },
        ],
    },

    // --- BIKE ---
    {
        id: 'bike_base_long',
        name: 'Long Aerobic Ride',
        sport: SportEnum.CYCLING,
        phases: [TrainingPhase.BASE_1, TrainingPhase.BASE_2, TrainingPhase.BASE_3],
        goal: 'Base Miles',
        durationFactor: 1.5, // Longer than average
        blocks: [
            { type: 'warmup', description: '15min progressive to Z2', durationMinutes: 15 },
            {
                type: 'main',
                description: 'Steady Z2 Ride - focus on flat power',
                durationMinutes: 90,
            },
            { type: 'cooldown', description: '10min spin easy', durationMinutes: 10 },
        ],
    },
    {
        id: 'bike_intervals_vo2',
        name: 'VO2 Max Intervals',
        sport: SportEnum.CYCLING,
        phases: [TrainingPhase.BUILD_2, TrainingPhase.PEAK],
        goal: 'Top End Power',
        durationFactor: 1.0,
        blocks: [
            { type: 'warmup', description: '20min Warmup incl. 3x1min spins', durationMinutes: 20 },
            { type: 'main', description: '5x3min @ 110% FTP / 3min recovery', durationMinutes: 30 },
            { type: 'cooldown', description: '15min easy spin', durationMinutes: 15 },
        ],
    },
    {
        id: 'bike_recovery',
        name: 'Recovery Spin',
        sport: SportEnum.CYCLING,
        phases: [
            TrainingPhase.PREP,
            TrainingPhase.BASE_1,
            TrainingPhase.BASE_2,
            TrainingPhase.BASE_3,
            TrainingPhase.BUILD_1,
            TrainingPhase.BUILD_2,
            TrainingPhase.PEAK,
            TrainingPhase.RACE,
        ], // All phases
        goal: 'Active Recovery',
        durationFactor: 0.7,
        blocks: [
            {
                type: 'main',
                description: 'Very easy spin Z1. Keep cadence high.',
                durationMinutes: 45,
            },
        ],
    },

    // --- RUN ---
    {
        id: 'run_base_steady',
        name: 'Steady Run',
        sport: SportEnum.RUN,
        phases: [TrainingPhase.BASE_1, TrainingPhase.BASE_2, TrainingPhase.BASE_3],
        goal: 'Aerobic Condition',
        durationFactor: 1.0,
        blocks: [
            { type: 'warmup', description: '10min walk/jog', durationMinutes: 10 },
            { type: 'main', description: 'Steady Z2 Run', durationMinutes: 40 },
            { type: 'cooldown', description: '5min walk', durationMinutes: 5 },
        ],
    },
    {
        id: 'run_tempo',
        name: 'Tempo Run',
        sport: SportEnum.RUN,
        phases: [TrainingPhase.BASE_3, TrainingPhase.BUILD_1],
        goal: 'Muscular Endurance',
        durationFactor: 1.0,
        blocks: [
            { type: 'warmup', description: '15min Easy', durationMinutes: 15 },
            { type: 'main', description: '2x15min @ Z3 (Tempo) / 3min jog', durationMinutes: 33 },
            { type: 'cooldown', description: '10min Easy', durationMinutes: 10 },
        ],
    },
    {
        id: 'run_speed',
        name: 'Speed Work',
        sport: SportEnum.RUN,
        phases: [TrainingPhase.BUILD_2, TrainingPhase.PEAK],
        goal: 'Leg Speed',
        durationFactor: 0.9,
        blocks: [
            { type: 'warmup', description: '15min Easy + Drills + Strides', durationMinutes: 20 },
            { type: 'main', description: '12x400m @ 5k pace / 200m jog', durationMinutes: 30 },
            { type: 'cooldown', description: '10min Easy', durationMinutes: 10 },
        ],
    },
    {
        id: 'brick_session',
        name: 'Brick Session',
        sport: SportEnum.CYCLING, // Primary sport, but note says transition
        phases: [TrainingPhase.BUILD_2, TrainingPhase.PEAK],
        goal: 'Transition',
        durationFactor: 1.2,
        blocks: [
            { type: 'main', description: 'Bike: 45min Z3', durationMinutes: 45 },
            { type: 'main', description: 'Transition Run: 15min @ Race Pace', durationMinutes: 15 },
        ],
    },
];

export class WorkoutLibrary {
    static getTemplatesForPhase(phase: TrainingPhase): WorkoutTemplate[] {
        let templates = WORKOUT_LIBRARY.filter(t => t.phases.includes(phase));

        // Fallback: if no specific templates, grab Base templates
        if (templates.length === 0) {
            templates = WORKOUT_LIBRARY.filter(t => t.phases.includes(TrainingPhase.BASE_1));
        }

        return templates;
    }

    static getRecoveryTemplate(sport: SportEnum): WorkoutTemplate | undefined {
        return WORKOUT_LIBRARY.find(t => t.goal === 'Active Recovery' && t.sport === sport);
    }
}
