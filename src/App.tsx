import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import Messages from "./pages/Messages";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import SellItem from "./pages/SellItem";
import SellerTools from "./pages/SellerTools";
import Categories from "./pages/Categories";
import Watchlist from "./pages/Watchlist";
import StyleGuide from "./pages/StyleGuide";
import SizeCharts from "./pages/SizeCharts";
import Cart from "./pages/Cart";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import CulturalGuide from "./pages/CulturalGuide";
import ProductDetail from "./pages/ProductDetail";
import PaymentSuccess from "./pages/PaymentSuccess";
import Storefronts from "./pages/Storefronts";
import StorefrontDetail from "./pages/StorefrontDetail";
import CreateStorefrontPage from "./pages/CreateStorefrontPage";
import SellerOnboarding from "./pages/SellerOnboarding";
import AdminDashboard from "./pages/AdminDashboard";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
      <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/community" element={<Community />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sell" element={<SellItem />} />
            <Route path="/seller-tools" element={<SellerTools />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/watchlist" element={<Watchlist />} /> 
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="/size-charts" element={<SizeCharts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/support" element={<Support />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cultural-guide" element={<CulturalGuide />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/storefronts" element={<Storefronts />} />
            <Route path="/storefront/:id" element={<StorefrontDetail />} />
            <Route path="/create-storefront" element={<CreateStorefrontPage />} />
            <Route path="/seller-onboarding" element={<SellerOnboarding />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
