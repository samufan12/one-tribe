
import { useState } from "react";
import { HelpCircle, MessageSquare, BookOpen, GraduationCap, Plus, ShoppingCart, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for cultural goods..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* YouTube icon */}
          <a 
            href="https://www.youtube.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800 relative z-50"
            aria-label="Visit YouTube"
          >
            <img src="/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png" alt="YouTube" className="w-6 h-6 pointer-events-none" />
          </a>
        
        {/* Discord icon */}
          <a 
            href="https://discord.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800 relative z-50"
            aria-label="Visit Discord"
          >
            <img src="/lovable-uploads/92333427-5a32-4cf8-b110-afc5b57c9f27.png" alt="Discord" className="w-6 h-6 pointer-events-none" />
          </a>
        
        {/* Shopping Cart */}
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800 relative"
        >
          <ShoppingCart size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
        
        {/* Help icon with dropdown */}
        <div className="relative">
          <button 
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800" 
            onClick={() => setHelpMenuOpen(!helpMenuOpen)}
          >
            <HelpCircle size={20} />
          </button>
          
          {helpMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-gray-800 rounded-md shadow-lg py-1 z-50">
              <button 
                onClick={() => navigate('/support')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 w-full text-left"
              >
                <MessageSquare size={16} />
                <span>Customer Support</span>
              </button>
              <button 
                onClick={() => navigate('/faq')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 w-full text-left"
              >
                <HelpCircle size={16} />
                <span>FAQ</span>
              </button>
              <button 
                onClick={() => navigate('/size-charts')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 w-full text-left"
              >
                <BookOpen size={16} />
                <span>Size Guide</span>
              </button>
              <button 
                onClick={() => navigate('/cultural-guide')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 w-full text-left"
              >
                <GraduationCap size={16} />
                <span>Cultural Guide</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Account/Auth buttons */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2"
          >
            <User size={16} />
            Sign In
          </Button>
        )}
        
        {/* Wishlist/Favorites */}
        <button 
          onClick={() => navigate('/watchlist')}
          className="px-4 py-1.5 text-gray-300 text-sm border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
        >
          Wishlist
        </button>
      </div>
    </div>
  );
};

export default Header;
