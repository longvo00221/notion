"use client";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Copy, ExternalLink, Heart, HeartCrack, Lock, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from 'convex/react'
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator
}
  from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import { useConfirmPin } from "@/hooks/useConfirmPin";
import { useOrigin } from "@/hooks/useOrigin";
type ItemProps = {
  id?: Id<"documents">;
  parendId?: Id<"documents">;
  documentIcon?: String;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  onExpand?: () => void;
  level?: number;
  label: String;
  onClick?: () => void;
  isFav?: boolean | undefined;
  content?: string;
  iconDoc?: string;
  title?: string;
  coverImage?: string;
  isLocked?: any
  icon: LucideIcon;
};
type ItemStaticProps = {
  Skeleton: React.FC<{ level?: number }>;
};
export const Item: React.FC<ItemProps> & ItemStaticProps = ({
  label,
  onClick,
  icon: Icon,
  active,
  isSearch,
  documentIcon,
  expanded,
  isLocked,
  id,
  isFav,
  content,
  iconDoc,
  coverImage,
  onExpand,
  parendId,
  title,
  level = 0,
}) => {

  const create = useMutation(api.documents.create)
  const pinConfirm = useConfirmPin()
  const update = useMutation(api.documents.update)
  const user = useUser()
  const origin = useOrigin();
  const router = useRouter()
  const archive = useMutation(api.documents.archive)
  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return;
    const promise = archive({ id })
    toast.promise(promise, {
      loading: "Moving to trash",
      success: "Note moved to trash!",
      error: "Failed to archive note."
    })
  }
  const onFavorite = () => {
    if (isFav) {
      const promise = update({
        id: id as Id<"documents">,
        isFavorite: false
      })
      toast.promise(promise, {
        loading: "Removing note from favorite list...",
        success: "Remove successfully",
        error: "Failed to remove "
      })
    } else {
      const promise = update({
        id: id as Id<"documents">,
        isFavorite: true
      })
      toast.promise(promise, {
        loading: "Adding to favorite list...",
        success: "Add to favorite success",
        error: "Failed to add to favorite"
      })
    }

  }
  const onDuplicate = () => {

    if (isLocked && isLocked.length > 0 && !pinConfirm.isUnlocked) {
      toast.warning("The duplicated note won't have a pin. To continue, enter your pin first")


      pinConfirm.onOpen(id as Id<"documents">)
    } else {
      const promise = create({
        title: title + "",
        parentDocument: parendId,
        content: content,
        icon: iconDoc,
        coverImage: coverImage
      }).then((documentId) => router.push(`/documents/${documentId}`))
      toast.promise(promise, {
        loading: "Duplicating a note...",
        success: "Duplicated",
        error: "Failed to duplicate a note"
      })
    }

  }
  const onOpenInNewtab = () => {
    const url = `${origin}/documents/${id}`
    window.open(url, '_blank');
  }
  const handleExpand = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onExpand?.();
  }
  const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id })
      .then((docId) => {
        if (!expanded) {
          onExpand?.()
        }
        router.push(`/documents/${docId}`)
      })
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    })
  }
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 
            mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-forceground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        isLocked && isLocked.length > 0 ? (
          <Lock className="text-rose-600 w-6 h-6 mr-2" />
        ) : (
          <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
        )
      )}


      <div className="flex items-center justify-between w-full">
        <span className="truncate">{label} </span>

      </div>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>k
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              asChild
            >
              <div role='button' className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onFavorite}>
                {
                  isFav ?
                    <div className="flex items-center dark:text-white/75 text-black">
                      <HeartCrack className="h-4 w-4 mr-2 " />
                      Remove favorite
                    </div> :
                    <div className="flex items-center dark:text-white/75 text-black" >
                      <Heart className="h-4 w-4 mr-2 " />
                      Add to favorite
                    </div>

                }
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenInNewtab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in new tab
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(event) => { onArchive(event) }}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by : {user?.user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};
Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}