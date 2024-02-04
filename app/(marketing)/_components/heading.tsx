"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth, useMutation } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import defaultDocument from "@/lib/data";
import { toast } from "sonner";
const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter()
  const create = useMutation(api.documents.create)
  const onNavigateToDocument = () => {
    
    const promise = create({
      title: defaultDocument.title,
      content: defaultDocument.content,
      coverImage:defaultDocument.coverImage,
      icon:defaultDocument.icon
    }).then((documentId)=>{router.push(`/documents/${documentId}`)})
    toast.promise(promise,{
      loading:"Creating a guide note...",
      success:"Created guide note! Welcome",
      error:"Failed to create a guide note"
    })
  }
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">Notion</span>{" "}
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Notion is the connected workspace where <br /> better, faster work
        happens.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Button onClick={onNavigateToDocument}>
            Enter Notion with guide <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Join Notion <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
export default Heading;
