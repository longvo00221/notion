'use client'
import React from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Heart, HeartCrack, MenuIcon } from "lucide-react";
import { Title } from "./title";
import Banner from "./banner";
import Menu from "./menu";
import { Publish } from "./publish";
import Pin from "./pin";
import { useConfirmPin } from "@/hooks/useConfirmPin";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
type NavbarProps = {
  isCollapsed: boolean;
  onResetWidth: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, onResetWidth }) => {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });
  const update = useMutation(api.documents.update)

  const pinConfirm = useConfirmPin()
  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
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
  if (document === null) {
    return null;
  }
  return (
    <>
      {document?.isLocked && document.isLocked?.length > 0 && !pinConfirm.isUnlocked ? <></> : <>
        <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
          {isCollapsed && (
            <MenuIcon
              role="button"
              onClick={onResetWidth}
              className="h-6 w-6 min-h-[24px] min-w-[24px] text-muted-foreground"
            />
          )}
          <div className="flex items-center justify-between w-full">
            <Title initalData={document} />
            <div className="flex items-center gap-x-2">
              <div className="md:flex items-center gap-x-2 hidden">
               
                  {
                    document.isFavorite ?
                      <Button onClick={onFavorite} variant="ghost" className="px-3 py-2">
                        <HeartCrack className="h-5 w-5 " />
                      </Button > :
                      <Button onClick={onFavorite} variant="ghost" className="px-3 py-2">
                        <Heart className="h-5 w-5 " />
                      </Button >

                  }
                </div>
               
           
              <Publish initialData={document} />
                <Pin initialData={document} />
              <Menu documentId={document._id} />
            </div>
          </div>
        </nav>
        {document.isArchived && (
          <Banner documentId={document._id} />
        )}
      </>}
    </>
  );
};
export default Navbar;
