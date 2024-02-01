'use client'
import { Button } from '@/components/ui/button';
import { Id } from '@/convex/_generated/dataModel';
import { useConfirmPin } from '@/hooks/useConfirmPin';
import { Lock } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"

interface LockedNoteProps {
   documentId:Id<"documents">
}

const LockedNote:React.FC<LockedNoteProps> = ({documentId}) => {
    const pinConFirm = useConfirmPin()
 
    const handleOpenPinModal = () => {
        pinConFirm.onOpen(documentId)
    }
    useEffect(()=>{
        pinConFirm.onOpen(documentId)
    },[])
    return (
        <div className='flex flex-col items-center justify-center h-full gap-4'>
            <Lock className='h-16 w-16' />
            <p className='text-muted-foreground text-lg'>This note is locked</p>
            <Button variant="ghost" className='text-blue-500' onClick={handleOpenPinModal}>Unlock</Button>
        </div>
    )
}
export default LockedNote;