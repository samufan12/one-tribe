import { ReactNode } from "react";
import { Link } from "react-router-dom";
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
      
      {/* Footer */}
      <footer className="border-t border-border/60 py-12 mt-12">
        <div className="max-w-[1400px] mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="space-y-2">
              <span className="font-semibold text-[17px] tracking-tight">OneTribe</span>
              <p className="text-sm text-muted-foreground">The Global Habesha Marketplace</p>
              <p className="text-xs text-muted-foreground/80 pt-1" lang="am">ለሐበሻ ማህበረሰብ</p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[
                { label: 'Marketplace', to: '/marketplace' },
                { label: 'Community Feed', to: '/community' },
                { label: 'Cultural Guide', to: '/cultural-guide' },
                { label: 'Find it for me', to: '/assistant' },
                { label: 'Sell', to: '/sell' },
                { label: 'About', to: '/support' },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="text-xs text-muted-foreground border-t border-border/60 pt-6">
            © 2026 OneTribe. The Global Habesha Marketplace.
          </p>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default GrailedLayout;
