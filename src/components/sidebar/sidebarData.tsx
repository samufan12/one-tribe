import { 
  Home, 
  ShoppingBag, 
  Users, 
  MessageCircle, 
  Bot, 
  User,
  Tag,
  Heart,
  Palette,
  Ruler,
  Package,
  Store,
  BarChart3
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Home",
    icon: Home,
    id: "home" as const,
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    id: "marketplace" as const,
  },
  {
    title: "Community",
    icon: Users,
    id: "community" as const,
  },
  {
    title: "Messages",
    icon: MessageCircle,
    id: "messages" as const,
  },
  {
    title: "AI Assistant",
    icon: Bot,
    id: "assistant" as const,
  },
];

export const sidebarDropdownSections = [
  {
    title: "Selling",
    items: [
      {
        title: "Sell Item",
        icon: Tag,
        id: "sell" as const,
      },
      {
        title: "Seller Tools",
        icon: BarChart3,
        id: "seller-tools" as const,
      },
    ],
  },
  {
    title: "Shopping",
    items: [
      {
        title: "Categories",
        icon: Package,
        id: "categories" as const,
      },
      {
        title: "Watchlist",
        icon: Heart,
        id: "watchlist" as const,
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Style Guide",
        icon: Palette,
        id: "style-guide" as const,
      },
      {
        title: "Size Charts",
        icon: Ruler,
        id: "size-charts" as const,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        icon: User,
        id: "profile" as const,
      },
      {
        title: "Become Seller",
        icon: Store,
        id: "become-seller" as const,
      },
    ],
  },
];