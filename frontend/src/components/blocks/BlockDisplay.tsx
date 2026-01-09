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
            <div className='mb-4 p-4 border border-white/5 rounded-lg bg-white/5'>
                <div className='flex justify-between items-center mb-3'>
                    <Badge variant='secondary' className='bg-blue-500/20 text-blue-400 border-none'>
                        Bloc simple
                    </Badge>
                </div>
                {block.goal && (
                    <div className='text-slate-200 text-sm font-medium'>
                        {formatGoal(block.goal, sport)}
                    </div>
                )}
                {block.note && (
                    <div className='mt-3 p-3 bg-slate-950/50 rounded border border-white/5 text-xs text-slate-400 italic'>
                        <strong className='text-slate-300 not-italic mr-1'>Note:</strong> {block.note}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='mb-4 p-4 border border-white/5 rounded-lg bg-white/5'>
            <div className='flex justify-between items-center mb-4'>
                <Badge variant='secondary' className='bg-emerald-500/20 text-emerald-400 border-none'>
                    Série × {block.repetitions}
                </Badge>
                {block.recovery !== undefined && (
                    <span className='text-xs text-slate-400'>
                        Récup: {block.recovery}s
                    </span>
                )}
            </div>

            <div className='space-y-3 pl-2 border-l-2 border-emerald-500/20'>
                {block.steps?.map((step, stepIndex) => (
                    <div
                        key={stepIndex}
                        className='p-3 border border-white/5 rounded bg-slate-950/30'
                    >
                        <div className='flex justify-between items-center mb-2'>
                            <span className='text-[10px] uppercase tracking-widest text-slate-500 font-bold'>
                                Étape {stepIndex + 1}
                            </span>
                            {step.recovery !== undefined && (
                                <span className='text-[10px] text-slate-500'>
                                    Récup: {step.recovery}s
                                </span>
                            )}
                        </div>
                        {step.goal && (
                            <div className='text-slate-200 text-sm'>
                                {formatGoal(step.goal, sport)}
                            </div>
                        )}
                        {step.note && (
                            <div className='mt-1 text-xs text-slate-400 italic'>
                                {step.note}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {block.note && (
                <div className='mt-4 p-3 bg-slate-950/50 rounded border border-white/5 text-xs text-slate-400 italic'>
                    <strong className='text-slate-300 not-italic mr-1'>Note série:</strong> {block.note}
                </div>
            )}
        </div>
    );
};
