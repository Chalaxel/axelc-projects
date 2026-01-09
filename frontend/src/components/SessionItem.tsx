import { Session, SessionBlockType } from '@shared/types';
import { getSportLabel } from '../utils/sessionHelpers';
import { BlockDisplay } from './blocks/BlockDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Layers } from 'lucide-react';

interface SessionItemProps {
    session: Session;
    onEdit: (session: Session) => void;
    onDelete: (id: string) => void;
}

export const SessionItem = ({ session, onEdit, onDelete }: SessionItemProps) => {
    const blocksCount = session.blocks?.length || 0;
    const seriesCount = session.blocks?.filter(b => b.type === SessionBlockType.SERIES).length || 0;

    const getSportIcon = (sport: string) => {
        return (
            <div className='w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4 font-bold uppercase'>
                {sport[0]}
            </div>
        );
    };

    return (
        <Card className='mb-6 border-white/5 bg-slate-900/40 backdrop-blur-sm shadow-xl overflow-hidden group'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <div className='flex items-center'>
                    {getSportIcon(session.sport)}
                    <div>
                        <CardTitle className='text-xl font-bold text-white group-hover:text-blue-400 transition-colors'>
                            {getSportLabel(session.sport)}
                        </CardTitle>
                        <div className='flex gap-4 mt-1'>
                            <div className='flex items-center text-xs text-slate-400'>
                                <Layers className='w-3 h-3 mr-1 text-slate-500' />
                                <span className='font-medium'>
                                    {blocksCount} bloc{blocksCount > 1 ? 's' : ''}
                                    {seriesCount > 0 &&
                                        ` (${seriesCount} série${seriesCount > 1 ? 's' : ''})`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onEdit(session)}
                        className='h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10'
                    >
                        <Edit2 className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onDelete(session.id)}
                        className='h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10'
                    >
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {session.data?.notes && (
                    <div className='mb-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-sm text-slate-300 italic'>
                        <span className='not-italic font-black text-blue-400 mr-2 uppercase text-[10px] tracking-widest'>
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
