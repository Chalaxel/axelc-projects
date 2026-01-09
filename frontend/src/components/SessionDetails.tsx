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
                        className='p-0 hover:bg-transparent text-slate-400 hover:text-blue-400 transition-all font-bold text-[10px] uppercase tracking-widest'
                    >
                        {isOpen ? (
                            <ChevronDown className='h-4 w-4 mr-2' />
                        ) : (
                            <ChevronRight className='h-4 w-4 mr-2' />
                        )}
                        Notes de session
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className='space-y-4 pt-2'>
                <div className='bg-white/2 border border-white/5 rounded-xl p-6 transition-all hover:bg-white/5'>
                    <div className='flex items-center gap-3 mb-4'>
                        <MessageSquare className='w-4 h-4 text-blue-500 opacity-50' />
                        <Label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500'>
                            Instructions générales
                        </Label>
                    </div>
                    <Textarea
                        value={notes}
                        onChange={e => onNotesChange(e.target.value)}
                        rows={3}
                        className='bg-white/5 border-white/5 focus:border-blue-500/50 transition-all resize-none text-slate-300'
                        placeholder='Échauffement, météo, sensations...'
                    />
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
