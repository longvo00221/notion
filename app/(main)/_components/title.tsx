'use client'
import { Doc } from '@/convex/_generated/dataModel';
import React, { useRef, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type TitleProps = {
    initalData: Doc<"documents">
};

type TitleComponent = React.FC<TitleProps> & {
    Skeleton: React.FC;
};

export const Title: TitleComponent = ({initalData}) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const update = useMutation(api.documents.update)
    const [title,setTitle] = useState(initalData.title || "Untitled")
    const [isEditing,setIsEditing] = useState<boolean>(false)
    const enableInput = () => {
        setTitle(initalData.title)
        setIsEditing(true)
        setTimeout(()=>{
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        },0)
    }
    const disableInput= () =>  {
        setIsEditing(false)
    }
    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
        update({
            id:initalData._id,
            title:event.target.value || "Untitled"
        })
    }
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter"){
            disableInput()
        }
    }
    return (
        <div className='flex items-center gap-x-1'>
            {!!initalData?.icon && <p>{initalData.icon}</p>}
            {isEditing ? (
                <Input 
                className='h-7 px-2 focus-visible:ring-transparent'
                ref={inputRef}
                onClick={enableInput}
                onBlur={disableInput}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={title}
                />
            ):(
                <Button
                onClick={enableInput}
                variant="ghost"
                size="sm"
                className='font-normal h-auto p-1'
                >
                    <span className='truncate'>
                        {initalData?.title}
                    </span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return(
        <Skeleton className='h-5 w-20 rounded-md'/>
    )
}