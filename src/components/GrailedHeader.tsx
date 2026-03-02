import { useState } from "react";
import { MessageSquare, Heart, User, Menu, X, Sparkles, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";

const GrailedHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
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
        <SearchBar />

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
            onClick={() => navigate('/cart')}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors relative"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
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
            onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-foreground flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            Cart {itemCount > 0 && `(${itemCount})`}
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
