import { Home, ShoppingBag, Tag, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "marketplace", label: "Shop", icon: ShoppingBag, path: "/marketplace" },
  { id: "sell", label: "Sell", icon: Tag, path: "/sell" },
  { id: "messages", label: "Messages", icon: MessageCircle, path: "/messages" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname === "/home";
    return location.pathname.startsWith(path);
  };

  const handleNav = (path: string) => {
    const authRequired = ["/sell", "/messages", "/profile"];
    if (authRequired.includes(path) && !user) {
      navigate("/auth");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/60 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 ease-spring"
            >
              <div className={`flex items-center justify-center h-8 w-12 rounded-full transition-all ${active ? 'bg-secondary' : ''}`}>
                <item.icon
                  size={20}
                  strokeWidth={active ? 2 : 1.5}
                  className={active ? "text-foreground" : "text-muted-foreground"}
                />
              </div>
              <span className={`text-[10px] font-medium tracking-tight ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
