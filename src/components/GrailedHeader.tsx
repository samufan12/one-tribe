import { useState } from "react";
import { Search, MessageSquare, Heart, User, Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GrailedHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Main Header */}
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
            <span className="text-background font-bold text-sm">OT</span>
          </div>
          <span className="font-bold text-xl hidden sm:block">OneTribe</span>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search for anything"
              className="w-full pl-10 pr-24 py-2.5 border border-border rounded-full bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <button className="absolute right-1 px-4 py-1.5 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition-colors">
              SEARCH
            </button>
          </div>
        </div>

        {/* Action Buttons - Right */}
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => user ? navigate('/sell') : navigate('/auth')}
            className="font-medium border-foreground text-foreground hover:bg-foreground hover:text-background"
          >
            SELL
          </Button>
          
          <button 
            onClick={() => navigate('/assistant')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            title="AI Assistant"
          >
            <Sparkles size={18} />
            <span>AI</span>
          </button>
          
          <a 
            href="https://www.youtube.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Visit YouTube"
          >
            <img src="/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png" alt="YouTube" className="w-5 h-5" />
          </a>
          
          <button 
            onClick={() => navigate('/community')}
            className="px-3 py-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            MY FEED
          </button>
          
          <button 
            onClick={() => user ? navigate('/messages') : navigate('/auth')}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors relative"
          >
            <MessageSquare size={20} />
            <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </button>
          
          <button 
            onClick={() => user ? navigate('/watchlist') : navigate('/auth')}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <Heart size={20} />
          </button>
          
          <button 
            onClick={() => user ? navigate('/profile') : navigate('/auth')}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <User size={20} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { navigate(user ? '/sell' : '/auth'); setMobileMenuOpen(false); }}
            className="w-full font-medium"
          >
            SELL
          </Button>
          <button 
            onClick={() => { navigate('/assistant'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-foreground flex items-center gap-2"
          >
            <Sparkles size={18} />
            AI Assistant
          </button>
          <a 
            href="https://www.youtube.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-left py-2 text-foreground flex items-center gap-2"
          >
            <img src="/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png" alt="YouTube" className="w-5 h-5" />
            YouTube
          </a>
          <button 
            onClick={() => { navigate('/community'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-foreground"
          >
            My Feed
          </button>
          <button 
            onClick={() => { navigate(user ? '/messages' : '/auth'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-foreground"
          >
            Messages
          </button>
          <button 
            onClick={() => { navigate(user ? '/watchlist' : '/auth'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-foreground"
          >
            Wishlist
          </button>
          <button 
            onClick={() => { navigate(user ? '/profile' : '/auth'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-foreground"
          >
            Profile
          </button>
          {user ? (
            <Button variant="destructive" size="sm" onClick={signOut} className="w-full">
              Sign Out
            </Button>
          ) : (
            <Button size="sm" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} className="w-full">
              Sign In
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default GrailedHeader;
