
import { HomeIcon, Users, Video, Image, Edit, Palette, Grid, LayoutGrid, Rss, Code, Clock, Bookmark, Heart, Album, Boxes, BookOpen, HelpCircle, Sparkles, Palette as ThemeIcon, Newspaper } from "lucide-react";

export const mainNavItems = [
  { icon: <HomeIcon size={20} />, label: "Home", key: "home" },
  { icon: <Grid size={20} />, label: "Marketplace", key: "marketplace" },
  { icon: <Rss size={20} />, label: "Community Feed", key: "community" },
  { icon: <Users size={20} />, label: "Messages", key: "messages", isNew: true },
  { icon: <Sparkles size={20} />, label: "AI Assistant", key: "assistant", isNew: true },
  { icon: <Video size={20} />, label: "Sell Item", key: "sell" },
  { icon: <Image size={20} />, label: "Categories", key: "categories" },
  { icon: <Edit size={20} />, label: "Watchlist", key: "watchlist" },
  { icon: <Palette size={20} />, label: "Style Guide", key: "style" },
  { icon: <LayoutGrid size={20} />, label: "Size Charts", key: "size" },
  { icon: <Code size={20} />, label: "Seller Tools", key: "seller" },
];

export const myStuffItems = [
  { icon: <Clock size={16} />, label: "Creation History" },
  { icon: <Bookmark size={16} />, label: "Bookmarks" },
  { icon: <Heart size={16} />, label: "Liked" },
  { icon: <Album size={16} />, label: "Saved Albums" },
  { icon: <Boxes size={16} />, label: "Trained Models" },
];

export const resourcesItems = [
  { icon: <BookOpen size={16} />, label: "Tutorials" },
  { icon: <HelpCircle size={16} />, label: "Wiki", isExternal: true },
  { icon: <HelpCircle size={16} />, label: "Help Center" },
  { icon: <Sparkles size={16} />, label: "What's New" },
  { icon: <ThemeIcon size={16} />, label: "Theme Gallery" },
  { icon: <Newspaper size={16} />, label: "Blog", isExternal: true },
];
