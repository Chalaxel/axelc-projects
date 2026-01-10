import { Session, SessionBlockType } from '@shared/types';
import { getSportLabel } from '../utils/sessionHelpers';
import { BlockDisplay } from './blocks/BlockDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';

interface SessionItemProps {
    session: Session;
}

export const SessionItem = ({ session }: SessionItemProps) => {
    const blocksCount = session.blocks?.length || 0;
    const seriesCount = session.blocks?.filter(b => b.type === SessionBlockType.SERIES).length || 0;

    const getSportIcon = (sport: string) => {
        return (
            <div className='mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 font-bold text-blue-400 uppercase'>
                {sport[0]}
            </div>
        );
    };

    return (
        <Card className='group mb-6 overflow-hidden border-white/5 bg-slate-900/40 shadow-xl backdrop-blur-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <div className='flex items-center'>
                    {getSportIcon(session.sport)}
                    <div>
                        <CardTitle className='text-xl font-bold text-white transition-colors group-hover:text-blue-400'>
                            {getSportLabel(session.sport)}
                        </CardTitle>
                        <div className='mt-1 flex flex-wrap gap-4'>
                            <div className='flex items-center text-xs text-slate-400'>
                                <Layers className='mr-1 h-3 w-3 text-slate-500' />
                                <span className='font-medium'>
                                    {blocksCount} bloc{blocksCount > 1 ? 's' : ''}
                                    {seriesCount > 0 &&
                                        ` (${seriesCount} série${seriesCount > 1 ? 's' : ''})`}
                                </span>
                            </div>
                            {session.date && (
                                <div className='flex items-center text-xs text-blue-400/80'>
                                    <span className='mr-1 font-black tracking-widest uppercase'>
                                        Date:
                                    </span>
                                    <span className='font-bold'>
                                        {new Date(session.date).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            )}
                            {session.weekNumber && (
                                <div className='flex items-center text-xs text-emerald-400/80'>
                                    <span className='mr-1 font-black tracking-widest uppercase'>
                                        Semaine:
                                    </span>
                                    <span className='font-bold'>{session.weekNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {session.data?.notes && (
                    <div className='mb-6 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4 text-sm text-slate-300 italic'>
                        <span className='mr-2 text-[10px] font-black tracking-widest text-blue-400 uppercase not-italic'>
                            Objectif:
                        </span>
                        {session.data.notes}
                    </div>
                )}

                {session.blocks && session.blocks.length > 0 && (
                    <div className='space-y-4'>
                        {session.blocks.map((block, index) => (
                            <BlockDisplay key={index} block={block} sport={session.sport} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
