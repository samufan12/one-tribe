import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only require auth if explicitly set
  if (requireAuth && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};