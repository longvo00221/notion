'use client'
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
}from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


type MenuProps = {
    documentId:Id<"documents">
};
type MenuComponent = React.FC<MenuProps> & {
    Skeleton: React.FC;
};

const Menu:MenuComponent = ({documentId}) => {
    const router = useRouter()
    const user = useUser()
    const archive = useMutation(api.documents.archive)
    const onArchive = () => {
        const promise = archive({id:documentId})
        toast.promise(promise,{
            loading:"Moving to trash...",
            success:"Note moved to trash!",
            error:"Failed to archive note."
        })
        router.push("/documents")
    }
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" >
                    <MoreHorizontal className='h-4 w-4 '/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60' align='center' alignOffset={8} forceMount>
                <DropdownMenuItem>
                  <Button onClick={onArchive} variant="ghost" className='w-full flex items-center justify-start'>
                        <Trash className='h-4 w-4 mr-2'/>
                        Delete
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <div className='tetxt-xs text-muted-foreground p-2'>
                    Last edited by: {user?.user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
Menu.Skeleton = function MenuSkeleton() {
    return(
        <Skeleton className='h-10 w-10'/>
    )
}
export default Menu;