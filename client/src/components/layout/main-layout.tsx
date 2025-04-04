import { ReactNode } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-1 w-full h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {children}
      </div>
    </div>
  );
}
