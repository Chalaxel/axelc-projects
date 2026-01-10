import { SessionBlock, SportEnum, StepGoal } from '@shared/types';
import { GoalFields } from '../goals/GoalFields';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

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
        <div className='group relative mb-6 rounded-2xl border border-white/5 bg-slate-900/40 p-6 transition-all hover:border-blue-500/20'>
            <div className='mb-6 flex items-center justify-between'>
                <Badge className='bg-blue-600 font-bold tracking-tighter uppercase'>
                    Bloc simple
                </Badge>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={onRemove}
                    className='text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-400/5 hover:text-red-400'
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>

            <GoalFields goal={block.goal} sport={sport} onChange={onGoalChange} />

            <div className='mt-6 space-y-2'>
                <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                    Notes complémenaires
                </Label>
                <Textarea
                    value={block.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    className='resize-none border-white/5 bg-white/5 text-slate-300 transition-all focus:border-blue-500/50'
                    placeholder="Précisions sur l'allure, le terrain, etc."
                />
            </div>
        </div>
    );
};
