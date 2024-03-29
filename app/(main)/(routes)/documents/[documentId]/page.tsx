"use client";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toolbar from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmPin } from "@/hooks/useConfirmPin";
import LockedNote from "@/app/(main)/_components/lockednote";
import { useSearchParams } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
};

const DocumentIdPage = ({
  params
}: DocumentIdPageProps) => {
  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor").then((module) => module.default), {
        ssr: false,
      }),
    []
  );
  const p = useSearchParams()
  const notification = useNotification();
  useEffect(() => {
    if (p.size === 1) {
      notification.onOpen();
    }
  }, []);

  const pinConfirm = useConfirmPin()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  });

  const update = useMutation(api.documents.update);
 
  const onChange = (content: string) => {
  
    update({
      id: params.documentId,
      content
    });
  };
  useEffect(() => {
    if (document?.isLocked && document.isLocked?.length > 0 && !pinConfirm.isUnlocked) {
      pinConfirm.onOpen(params.documentId)
    }
  }, [])
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <>
      {document?.isLocked && document.isLocked?.length > 0 && !pinConfirm.isUnlocked ? <LockedNote documentId={document._id}/> : <div className="pb-40">
        <Cover url={document.coverImage} />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <Toolbar initialData={document} />
          <Editor
            onChange={onChange}
            holder="editorjs-container"
         
            initialContent={document.content}
          />
        </div>
      </div>}
    </>
  );
}

export default DocumentIdPage;