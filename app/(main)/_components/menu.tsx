'use client'
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
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
import { Copy, ExternalLink, Heart, HeartCrack, MoreHorizontal, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrigin } from '@/hooks/useOrigin';
import { useConfirmPin } from '@/hooks/useConfirmPin';
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
    const update = useMutation(api.documents.update)
    const pinConfirm = useConfirmPin()
    const create = useMutation(api.documents.create)
    const origin = useOrigin();
    const document = useQuery(api.documents.getById, {
        documentId: documentId as Id<"documents">,
      });
    const onArchive = () => {
        const promise = archive({id:documentId})
        toast.promise(promise,{
            loading:"Moving to trash...",
            success:"Note moved to trash!",
            error:"Failed to archive note."
        })
        router.push("/documents")
    }
    
    if (document === undefined) {
        return (
          <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Menu.Skeleton />
            </div>
          </nav>
        );
      }
      const onFavorite = () => {
        if (document.isFavorite) {
          const promise = update({
            id: document._id as Id<"documents">,
            isFavorite: false
          })
          toast.promise(promise, {
            loading: "Removing note from favorite list...",
            success: "Remove successfully",
            error: "Failed to remove "
          })
        } else {
          const promise = update({
            id: document._id as Id<"documents">,
            isFavorite: true
          })
          toast.promise(promise, {
            loading: "Adding to favorite list...",
            success: "Add to favorite success",
            error: "Failed to add to favorite"
          })
        }
    
      }
      const onOpenInNewtab = () => {
        const url = `${origin}/documents/${documentId}`
        window.open(url, '_blank');
      }
      const onDuplicate = () => {
    
        if (document.isLocked && document.isLocked.length > 0 && !pinConfirm.isUnlocked) {
          toast.warning("The duplicated note won't have a pin. To continue, enter your pin first")
    
    
          pinConfirm.onOpen(documentId as Id<"documents">)
        } else {
          const promise = create({
            title: document.title + "",
            parentDocument:document.parentDocument,
            content: document.content,
            icon: document.icon,
            coverImage: document.coverImage
          }).then((documentId) => router.push(`/documents/${documentId}`))
          toast.promise(promise, {
            loading: "Duplicating a note...",
            success: "Duplicated",
            error: "Failed to duplicate a note"
          })
        }
    
      }
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" >
                    <MoreHorizontal className='h-4 w-4 dark:text-white/75 text-black'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60' align='center' alignOffset={8} forceMount>
                <DropdownMenuItem>
                  <Button onClick={onArchive} variant="ghost" className='w-full flex items-center justify-start'>
                        <Trash className='h-4 w-4 mr-2'/>
                        Delete
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <div className="w-full">
                  {
                    document.isFavorite ?
                      <Button onClick={onFavorite} variant="ghost" className="px-3 py-2 w-full justify-start">
                        <HeartCrack className="h-5 w-5 mr-3" /> 
                        <p>Unfavorite</p>
                      </Button > :
                      <Button onClick={onFavorite} variant="ghost" className="px-3 py-2 w-full justify-start">
                        <Heart className="h-5 w-5 mr-3" /> 
                        <p>Favorite</p>
                      </Button >

                  }
                </div>
                </DropdownMenuItem>
                <DropdownMenuItem >
                  <Button onClick={onDuplicate} variant="ghost" className='w-full flex items-center justify-start'>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <Button onClick={onOpenInNewtab} variant="ghost" className='w-full flex items-center justify-start'>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in new tab
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