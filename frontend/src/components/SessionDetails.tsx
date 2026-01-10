import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SessionDetailsProps {
    notes: string;
    onNotesChange: (value: string) => void;
}

export const SessionDetails = ({ notes, onNotesChange }: SessionDetailsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full space-y-2'>
            <div className='flex items-center justify-between space-x-4'>
                <CollapsibleTrigger asChild>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='p-0 text-[10px] font-bold tracking-widest text-slate-400 uppercase transition-all hover:bg-transparent hover:text-blue-400'
                    >
                        {isOpen ? (
                            <ChevronDown className='mr-2 h-4 w-4' />
                        ) : (
                            <ChevronRight className='mr-2 h-4 w-4' />
                        )}
                        Notes de session
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className='space-y-4 pt-2'>
                <div className='rounded-xl border border-white/5 bg-white/2 p-6 transition-all hover:bg-white/5'>
                    <div className='mb-4 flex items-center gap-3'>
                        <MessageSquare className='h-4 w-4 text-blue-500 opacity-50' />
                        <Label className='text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase'>
                            Instructions générales
                        </Label>
                    </div>
                    <Textarea
                        value={notes}
                        onChange={e => onNotesChange(e.target.value)}
                        rows={3}
                        className='resize-none border-white/5 bg-white/5 text-slate-300 transition-all focus:border-blue-500/50'
                        placeholder='Échauffement, météo, sensations...'
                    />
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
