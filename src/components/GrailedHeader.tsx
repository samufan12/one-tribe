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

  const iconBtn =
    "p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary transition-all duration-200 ease-spring";

  return (
    <header className="sticky top-0 z-50 bg-background/75 backdrop-blur-xl border-b border-border/60">
      {/* Main Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          className="flex items-center gap-2 shrink-0 group"
          onClick={() => navigate('/')}
          aria-label="OneTribe home"
        >
          <span className="font-semibold text-[17px] tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
            OneTribe
          </span>
        </button>

        {/* Search Bar - Center */}
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        {/* Action Buttons - Right */}
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant="default"
            size="sm"
            onClick={() => user ? navigate('/sell') : navigate('/auth')}
            className="rounded-full px-4 h-8 text-xs font-medium tracking-wide"
          >
            Sell
          </Button>



          <button
            onClick={() => navigate('/community')}
            className="px-3 py-1.5 text-[13px] font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-secondary"
          >
            Feed
          </button>

          <button
            onClick={() => navigate('/cultural-guide')}
            className="px-3 py-1.5 text-[13px] font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-secondary"
          >
            Cultural Guide
          </button>

          <button
            onClick={() => navigate('/assistant')}
            className="px-3 py-1.5 text-[13px] font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-secondary inline-flex items-center gap-1.5"
          >
            <Sparkles size={14} strokeWidth={1.75} />
            Find it
          </button>

          <button
            onClick={() => user ? navigate('/messages') : navigate('/auth')}
            className={`${iconBtn} relative`}
            aria-label="Messages"
          >
            <MessageSquare size={18} strokeWidth={1.75} />
            <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[9px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center ring-2 ring-background">
              1
            </span>
          </button>

          <button
            onClick={() => user ? navigate('/watchlist') : navigate('/auth')}
            className={iconBtn}
            aria-label="Watchlist"
          >
            <Heart size={18} strokeWidth={1.75} />
          </button>

          <button
            onClick={() => navigate('/cart')}
            className={`${iconBtn} relative`}
            aria-label="Cart"
          >
            <ShoppingCart size={18} strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[9px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center ring-2 ring-background">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => user ? navigate('/profile') : navigate('/auth')}
            className={iconBtn}
            aria-label="Profile"
          >
            <User size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-1 animate-fade-in">
          <Button
            size="sm"
            onClick={() => { navigate(user ? '/sell' : '/auth'); setMobileMenuOpen(false); }}
            className="w-full rounded-full font-medium"
          >
            Sell
          </Button>
          {[
            { label: 'AI Assistant', icon: Sparkles, path: '/assistant', auth: false },
            { label: 'Feed', icon: null, path: '/community', auth: false },
            { label: 'Messages', icon: MessageSquare, path: '/messages', auth: true },
            { label: 'Wishlist', icon: Heart, path: '/watchlist', auth: true },
            { label: `Cart${itemCount > 0 ? ` (${itemCount})` : ''}`, icon: ShoppingCart, path: '/cart', auth: false },
            { label: 'Profile', icon: User, path: '/profile', auth: true },
          ].map(({ label, icon: Icon, path, auth }) => (
            <button
              key={label}
              onClick={() => { navigate(auth && !user ? '/auth' : path); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-foreground hover:bg-secondary flex items-center gap-3 transition-colors"
            >
              {Icon && <Icon size={18} strokeWidth={1.75} />}
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
          {user ? (
            <Button variant="outline" size="sm" onClick={signOut} className="w-full rounded-full mt-2">
              Sign Out
            </Button>
          ) : (
            <Button size="sm" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} className="w-full rounded-full mt-2">
              Sign In
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default GrailedHeader;
