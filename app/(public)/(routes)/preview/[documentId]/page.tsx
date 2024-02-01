"use client";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toolbar from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmPin } from "@/hooks/useConfirmPin";
import Image from "next/image";

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
      {document?.isLocked && document.isLocked?.length > 0 && !pinConfirm.isUnlocked
        ? <div className="flex flex-col items-center justify-center h-full">
          <Image
            src="/error.png"
            height="300"
            width="300"
            alt="Error"
            className="dark:hidden"
          />
          <Image
            src="/error-dark.png"
            height="300"
            width="300"
            alt="Error"
            className="hidden dark:block"
          />
          <p className="text-muted-foreground mt-2">Note is locked by the author. Please contact the author if you want to view it.</p>

        </div>
        : <div className="pb-40">
          <Cover preview url={document.coverImage} />
          <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
            <Toolbar preview initialData={document} />
            <Editor
              editable={false}
              onChange={onChange}
              initialContent={document.content}
            />
          </div>
        </div>}
    </>
  );
}

export default DocumentIdPage;