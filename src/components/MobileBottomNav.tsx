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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
