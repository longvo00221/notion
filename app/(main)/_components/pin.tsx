'use client'
import React, { useState } from 'react';
import {
    PopoverTrigger,
    Popover,
    PopoverContent
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from '@/convex/_generated/dataModel';
import { Lock } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { usePin } from '@/hooks/usePin';
type PinProps = {
    initialData: Doc<"documents">
};

const Pin: React.FC<PinProps> = ({ initialData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const update = useMutation(api.documents.update)
    const pin = usePin()
    const onUnlock = () => {
        setIsSubmitting(true);
        const promise = update({
            id:initialData._id,
            isLocked:[]
        }).finally(() => setIsSubmitting(false));
        toast.promise(promise,{
            loading:"Unlocking...",
            success:"Note unlocked",
            error:"Failed to unlock note"
        })
    }
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost" className="dark:text-white/75 text-black">


                    {initialData.isLocked.length === 0 ? (
                        <Lock
                            className="w-4 h-4 dark:text-white/75 text-black"
                        />
                    ) : (
                        <Lock
                            className="w-4 h-4 text-rose-600"
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72 drop-shadow-sm"
                align="end"
                alignOffset={8}
                forceMount
            >
                {initialData.isLocked.length !== 0? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Lock className="text-rose-600 animate-pulse h-4 w-4" />
                            <p className="text-xs font-medium text-rose-600">
                                This note is locked
                            </p>
                        </div>

                        <Button
                            size="sm"
                            className="w-full text-xs"

                            onClick={onUnlock}
                        >
                            Unlock
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">

                        <p className="text-sm font-medium mb-2">
                            Lock this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            This action will make your note private
                        </span>
                        <Button

                            onClick={pin.onOpen}
                            className="w-full text-xs"
                            size="sm"
                        >
                            Lock
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
export default Pin;