"use client";
import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import React from "react";
import Navigation from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";
import { ToggleThemeMatchWithWindow } from "@/components/toggle-them-match-window";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
        <ToggleThemeMatchWithWindow/>
        <Navigation/>
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand/>
        {children}
        </main>
    </div>
  );
};
export default MainLayout;
