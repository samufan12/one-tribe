import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import GrailedHeader from "./GrailedHeader";
import { MobileBottomNav } from "./MobileBottomNav";

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
      
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Footer - hidden on mobile */}
      <footer className="hidden md:block border-t border-border/60 py-12 mt-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-semibold text-[15px] tracking-tight">OneTribe</span>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} OneTribe. The Global Habesha Marketplace.
            </p>
          </div>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default GrailedLayout;
