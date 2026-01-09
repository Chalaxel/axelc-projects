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
        <div className='p-6 mb-6 border border-white/5 rounded-2xl bg-slate-900/40 relative group transition-all hover:border-blue-500/20'>
            <div className='flex justify-between items-center mb-6'>
                <Badge className='bg-blue-600 font-bold uppercase tracking-tighter'>
                    Bloc simple
                </Badge>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={onRemove}
                    className='text-slate-500 hover:text-red-400 hover:bg-red-400/5 opacity-0 group-hover:opacity-100 transition-all'
                >
                    <Trash2 className='w-4 h-4' />
                </Button>
            </div>

            <GoalFields goal={block.goal} sport={sport} onChange={onGoalChange} />

            <div className='mt-6 space-y-2'>
                <Label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                    Notes complémenaires
                </Label>
                <Textarea
                    value={block.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    className='bg-white/5 border-white/5 focus:border-blue-500/50 transition-all resize-none text-slate-300'
                    placeholder="Précisions sur l'allure, le terrain, etc."
                />
            </div>
        </div>
    );
};
