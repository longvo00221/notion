"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { remove } from "@/convex/documents";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { ConfirmModal } from "./modals/confirm-modal";
import { Skeleton } from "./ui/skeleton";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}
export const Cover = ({ url, preview }: CoverImageProps) => {
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);
  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url,
      });
    }
    removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
  };
  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className=" opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2 z-50">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground "
            variant="outline"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <ConfirmModal onConfirm={onRemove}>
            <Button className="text-muted-foreground " variant="outline">
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </ConfirmModal>
        </div>
      )}
    </div>
  );
};
Cover.Skeleton = function CoverSkeleton() {
  return(
    <Skeleton className="w-full h-[12vh]"/>
  )
}