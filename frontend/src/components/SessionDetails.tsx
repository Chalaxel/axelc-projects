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
                        className='text-muted-foreground hover:text-primary p-0 text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-transparent'
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
                <div className='border-border bg-muted/10 hover:bg-muted/20 rounded-xl border p-6 transition-all'>
                    <div className='mb-4 flex items-center gap-3'>
                        <MessageSquare className='text-primary h-4 w-4 opacity-50' />
                        <Label className='text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase'>
                            Instructions générales
                        </Label>
                    </div>
                    <Textarea
                        value={notes}
                        onChange={e => onNotesChange(e.target.value)}
                        rows={3}
                        className='border-border bg-card text-foreground focus:border-primary/50 resize-none font-medium transition-all'
                        placeholder='Échauffement, météo, sensations...'
                    />
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
