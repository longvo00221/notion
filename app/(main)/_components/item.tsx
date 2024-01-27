"use client";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {useMutation} from 'convex/react'
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator } 
from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
type ItemProps = {
  id?: Id<"documents">;
  documentIcon?: String;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  onExpand?: () => void;
  level?: number;
  label: String;
  onClick?: () => void;
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
  id,
  onExpand,
  level = 0,
}) => {

    const create = useMutation(api.documents.create)
    const user = useUser()
  const router = useRouter()
  const archive = useMutation(api.documents.archive)
  const onArchive = (event:React.MouseEvent<HTMLDivElement,MouseEvent>) => {
    event.stopPropagation()
    if(!id) return;
    const promise = archive({id})
    toast.promise(promise,{
      loading:"Moving to trash",
      success:"Note moved to trash!",
      error:"Failed to archive note."
    })
  }
  const handleExpand = (
    e: React.MouseEvent<HTMLDivElement,MouseEvent>
  ) => {
    e.stopPropagation();
    onExpand?.();
  }
  const onCreate = (e:React.MouseEvent<HTMLDivElement,MouseEvent>)=>{
    if(!id) return;
    const promise = create({title:"Untitled",parentDocument:id})
    .then((docId) => {
      if(!expanded) {
        onExpand?.()
      }
      router.push(`/documents/${docId}`)
    })
    toast.promise(promise,{
      loading:"Creating a new note...",
      success:"New note created!",
      error:"Failed to create a new note."
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
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>
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
                <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
            className="w-60"
            align="start"
            side="right"
            forceMount
            >
              <DropdownMenuItem onClick={(event)=>{onArchive(event)}}>
                <Trash className="h-4 w-4 mr-2"/>
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
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
            <Plus className="h-4 w-4 text-muted-foreground"/>
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