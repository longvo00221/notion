import React from "react";
import { Navbar } from "./_components/marketing";
type layoutProps = {
  children: React.ReactNode;
};

const layout: React.FC<layoutProps> = ({ children }) => {
  return (
    <div className="h-full dark:bg-[#1f1f1f]">
      <Navbar />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};
export default layout;
