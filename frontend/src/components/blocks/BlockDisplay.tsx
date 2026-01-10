import { SessionBlock, SportEnum, SessionBlockType } from '@shared/types';
import { formatGoal } from '../../utils/sessionHelpers';
import { Badge } from '@/components/ui/badge';

interface BlockDisplayProps {
    block: SessionBlock;
    sport: SportEnum;
}

export const BlockDisplay = ({ block, sport }: BlockDisplayProps) => {
    if (block.type === SessionBlockType.SIMPLE) {
        return (
            <div className='border-border bg-muted/30 mb-4 rounded-lg border p-4'>
                <div className='mb-3 flex items-center justify-between'>
                    <Badge variant='secondary' className='border-none bg-blue-500/20 text-blue-400'>
                        Bloc simple
                    </Badge>
                </div>
                {block.goal && (
                    <div className='text-sm font-medium text-slate-200'>
                        {formatGoal(block.goal, sport)}
                    </div>
                )}
                {block.note && (
                    <div className='border-border bg-card text-muted-foreground mt-3 rounded border p-3 text-xs italic'>
                        <strong className='mr-1 text-slate-300 not-italic'>Note:</strong>{' '}
                        {block.note}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='border-border bg-muted/20 mb-4 rounded-lg border p-4'>
            <div className='mb-4 flex items-center justify-between'>
                <Badge
                    variant='secondary'
                    className='border-none bg-emerald-500/20 text-emerald-400'
                >
                    Série × {block.repetitions}
                </Badge>
                {block.recovery !== undefined && (
                    <span className='text-xs text-slate-400'>Récup: {block.recovery}s</span>
                )}
            </div>

            <div className='space-y-3 border-l-2 border-emerald-500/20 pl-2'>
                {block.steps?.map((step, stepIndex) => (
                    <div key={stepIndex} className='border-border bg-card rounded border p-3'>
                        <div className='mb-2 flex items-center justify-between'>
                            <span className='text-[10px] font-bold tracking-widest text-slate-500 uppercase'>
                                Étape {stepIndex + 1}
                            </span>
                            {step.recovery !== undefined && (
                                <span className='text-[10px] text-slate-500'>
                                    Récup: {step.recovery}s
                                </span>
                            )}
                        </div>
                        {step.goal && (
                            <div className='text-sm text-slate-200'>
                                {formatGoal(step.goal, sport)}
                            </div>
                        )}
                        {step.note && (
                            <div className='mt-1 text-xs text-slate-400 italic'>{step.note}</div>
                        )}
                    </div>
                ))}
            </div>

            {block.note && (
                <div className='border-border bg-card text-muted-foreground mt-4 rounded border p-3 text-xs italic'>
                    <strong className='mr-1 text-slate-300 not-italic'>Note série:</strong>{' '}
                    {block.note}
                </div>
            )}
        </div>
    );
};
