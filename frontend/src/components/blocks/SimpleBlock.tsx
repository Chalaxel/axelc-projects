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
        <div className='group border-border bg-card hover:border-primary/20 relative mb-6 rounded-2xl border p-6 shadow-sm transition-all'>
            <div className='mb-6 flex items-center justify-between'>
                <Badge className='bg-primary text-primary-foreground font-bold tracking-tighter uppercase'>
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

            <div className='border-border mt-6 space-y-2 border-t pt-4'>
                <Label className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
                    Notes complémentaires
                </Label>
                <Textarea
                    value={block.note || ''}
                    onChange={e => onNoteChange(e.target.value)}
                    rows={2}
                    className='border-border bg-muted/30 text-foreground focus:border-primary/50 resize-none transition-all'
                    placeholder="Précisions sur l'allure, le terrain, etc."
                />
            </div>
        </div>
    );
};
