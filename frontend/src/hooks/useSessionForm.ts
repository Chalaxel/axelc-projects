import { useState } from 'react';
import {
    SessionCreationAttributes,
    SessionBlock,
    Step,
    StepGoal,
    SessionBlockType,
    SportEnum,
} from '@shared/types';

export const useSessionForm = () => {
    const [sport, setSport] = useState<SportEnum>(SportEnum.RUN);
    const [blocks, setBlocks] = useState<SessionBlock[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [weekNumber, setWeekNumber] = useState<number | undefined>();

    const createEmptyStep = (): Step => ({ goal: {} });

    const addBlock = (type: SessionBlockType) => {
        if (type === SessionBlockType.SIMPLE) {
            setBlocks([...blocks, { type: SessionBlockType.SIMPLE, goal: {} }]);
        } else {
            setBlocks([
                ...blocks,
                {
                    type: SessionBlockType.SERIES,
                    repetitions: 1,
                    steps: [createEmptyStep()],
                },
            ]);
        }
    };

    const removeBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const updateBlock = (index: number, updates: Partial<SessionBlock>) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = { ...updatedBlocks[index], ...updates };
        setBlocks(updatedBlocks);
    };

    const updateBlockNote = (blockIndex: number, value: string) => {
        updateBlock(blockIndex, { note: value || undefined });
    };

    const updateSeriesRepetitions = (blockIndex: number, value: number) => {
        updateBlock(blockIndex, { repetitions: value });
    };

    const updateSeriesRecovery = (blockIndex: number, value: number | string) => {
        updateBlock(blockIndex, {
            recovery: value === '' ? undefined : Number(value),
        });
    };

    const updateBlockGoal = (
        blockIndex: number,
        field: keyof StepGoal,
        value: number | string | undefined,
    ) => {
        const updatedBlocks = [...blocks];
        const block = updatedBlocks[blockIndex];
        if (block.type === SessionBlockType.SIMPLE) {
            updatedBlocks[blockIndex] = {
                ...block,
                goal: {
                    ...block.goal,
                    [field]: value === '' ? undefined : value,
                },
            };
            setBlocks(updatedBlocks);
        }
    };

    const addStep = (blockIndex: number) => {
        const updatedBlocks = [...blocks];
        const block = updatedBlocks[blockIndex];
        if (block.type === SessionBlockType.SERIES) {
            updatedBlocks[blockIndex] = {
                ...block,
                steps: [...(block.steps || []), createEmptyStep()],
            };
            setBlocks(updatedBlocks);
        }
    };

    const removeStep = (blockIndex: number, stepIndex: number) => {
        const updatedBlocks = [...blocks];
        const block = updatedBlocks[blockIndex];
        if (block.type === SessionBlockType.SERIES && (block.steps?.length || 0) > 1) {
            updatedBlocks[blockIndex] = {
                ...block,
                steps: block.steps?.filter((_, i) => i !== stepIndex),
            };
            setBlocks(updatedBlocks);
        }
    };

    const updateStep = (blockIndex: number, stepIndex: number, updates: Partial<Step>) => {
        const updatedBlocks = [...blocks];
        const block = updatedBlocks[blockIndex];
        if (block.type === SessionBlockType.SERIES) {
            const updatedSteps = [...(block.steps || [])];
            updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...updates };
            updatedBlocks[blockIndex] = {
                ...block,
                steps: updatedSteps,
            };
            setBlocks(updatedBlocks);
        }
    };

    const updateStepGoal = (
        blockIndex: number,
        stepIndex: number,
        field: keyof StepGoal,
        value: number | string | undefined,
    ) => {
        const updatedBlocks = [...blocks];
        const block = updatedBlocks[blockIndex];
        if (block.type === SessionBlockType.SERIES) {
            const updatedSteps = [...(block.steps || [])];
            updatedSteps[stepIndex] = {
                ...updatedSteps[stepIndex],
                goal: {
                    ...updatedSteps[stepIndex].goal,
                    [field]: value === '' ? undefined : value,
                },
            };
            updatedBlocks[blockIndex] = {
                ...block,
                steps: updatedSteps,
            };
            setBlocks(updatedBlocks);
        }
    };

    const getFormData = (): SessionCreationAttributes => {
        const filteredBlocks = blocks.filter(block => {
            if (block.type === SessionBlockType.SIMPLE) {
                return block.goal?.distance || block.goal?.time;
            } else {
                return (block.steps?.length || 0) > 0;
            }
        });

        return {
            sport,
            blocks: filteredBlocks.length > 0 ? filteredBlocks : undefined,
            data: {
                notes: notes || undefined,
            },
            date: date || undefined,
            weekNumber: weekNumber || undefined,
        };
    };

    return {
        sport,
        setSport,
        blocks,
        notes,
        setNotes,
        addBlock,
        removeBlock,
        updateBlock,
        updateBlockGoal,
        addStep,
        removeStep,
        updateStep,
        updateStepGoal,
        updateBlockNote,
        updateSeriesRepetitions,
        updateSeriesRecovery,
        date,
        setDate,
        weekNumber,
        setWeekNumber,
        getFormData,
    };
};
