import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import GrailedHeader from "./GrailedHeader";


interface GrailedLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const GrailedLayout = ({ 
  children, 
  requireAuth = false 
}: GrailedLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <GrailedHeader />
      
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <span className="text-background font-bold text-xs">OT</span>
              </div>
              <span className="font-bold">OneTribe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OneTribe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GrailedLayout;
