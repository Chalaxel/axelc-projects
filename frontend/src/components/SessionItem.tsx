import { Session, SessionBlockType, SportEnum } from '@shared/types';
import { getSportLabel } from '../utils/sessionHelpers';
import { BlockDisplay } from './blocks/BlockDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, FootprintsIcon, BikeIcon, WavesIcon } from 'lucide-react';

interface SessionItemProps {
    session: Session;
}

const sportIcons = {
    [SportEnum.SWIM]: <WavesIcon className='h-4 w-4' />,
    [SportEnum.CYCLING]: <BikeIcon className='h-4 w-4' />,
    [SportEnum.RUN]: <FootprintsIcon className='h-4 w-4' />,
};

export const SessionItem = ({ session }: SessionItemProps) => {
    const blocksCount = session.blocks?.length || 0;
    const seriesCount = session.blocks?.filter(b => b.type === SessionBlockType.SERIES).length || 0;

    const getSportIcon = (sport: SportEnum) => {
        return (
            <div className='bg-primary/10 text-primary mr-4 flex h-8 w-8 items-center justify-center rounded-full font-bold uppercase'>
                {sportIcons[sport]}
            </div>
        );
    };

    return (
        <Card className='group border-border bg-card mb-6 overflow-hidden shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <div className='flex items-center'>
                    {getSportIcon(session.sport)}
                    <div>
                        <CardTitle className='text-foreground group-hover:text-primary text-xl font-bold transition-colors'>
                            {getSportLabel(session.sport)}
                        </CardTitle>
                        <div className='mt-1 flex flex-wrap gap-4'>
                            <div className='text-muted-foreground flex items-center text-xs'>
                                <Layers className='text-muted-foreground/60 mr-1 h-3 w-3' />
                                <span className='font-medium'>
                                    {blocksCount} bloc{blocksCount > 1 ? 's' : ''}
                                    {seriesCount > 0 &&
                                        ` (${seriesCount} série${seriesCount > 1 ? 's' : ''})`}
                                </span>
                            </div>
                            {session.date && (
                                <div className='text-primary/80 flex items-center text-xs'>
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
                                <div className='text-secondary/80 flex items-center text-xs'>
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
                    <div className='border-primary/10 bg-primary/5 text-muted-foreground mb-6 rounded-xl border p-4 text-sm italic'>
                        <span className='text-primary mr-2 text-[10px] font-black tracking-widest uppercase not-italic'>
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
