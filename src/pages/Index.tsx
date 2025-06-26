
import { useEffect } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { CreationCard } from "../components/CreationCard";
import { QuickStartItem } from "../components/QuickStartItem";
import { FeaturedAppCard } from "../components/FeaturedAppCard";
import { ModelCard } from "../components/ModelCard";
import { ShoppingBag, Coffee, Shirt, Music, BookOpen, Gift, ArrowRight, Search, Star, Heart } from "lucide-react";

const Index = () => {
  useEffect(() => {
    const checkLogo = async () => {
      try {
        const response = await fetch('/logo.svg');
        if (response.status === 404) {
          console.log('Logo not found, would create one in a real app');
        }
      } catch (error) {
        console.log('Error checking logo:', error);
      }
    };
    
    checkLogo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              <h1 className="text-3xl font-bold text-white mb-8">
                Discover Authentic Ethiopian & Eritrean Cultural Goods
              </h1>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-gradient-to-br from-[#1D8FFF] to-[#0066CC] rounded-xl p-6 text-white feature-card cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Shirt size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Traditional Clothing</h2>
                      <p className="text-white/80">Habesha kemis, netela, and more</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 mb-4">
                    Discover beautiful handwoven traditional garments crafted by skilled artisans
                  </p>
                  <button className="bg-white text-[#1D8FFF] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Shop Now
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-[#FFD426] to-[#FFC107] rounded-xl p-6 text-black feature-card cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-black/10 rounded-lg">
                      <Coffee size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Coffee & Spices</h2>
                      <p className="text-black/70">Premium Ethiopian coffee & berbere</p>
                    </div>
                  </div>
                  <p className="text-sm text-black/60 mb-4">
                    Authentic flavors from the birthplace of coffee and exotic spice blends
                  </p>
                  <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Explore
                  </button>
                </div>
              </div>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Product Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="p-3 rounded-lg bg-[#3A3600] mr-4 flex items-center justify-center">
                      <Music size={24} className="text-[#FFD426]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Traditional Music</h3>
                      <p className="text-sm text-gray-400 mt-1">Instruments & recordings</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="p-3 rounded-lg bg-[#00361F] mr-4 flex items-center justify-center">
                      <BookOpen size={24} className="text-[#00A67E]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Books & Literature</h3>
                      <p className="text-sm text-gray-400 mt-1">Amharic & Tigrinya books</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="p-3 rounded-lg bg-[#360036] mr-4 flex items-center justify-center">
                      <Gift size={24} className="text-[#FF3EA5]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Handcrafts</h3>
                      <p className="text-sm text-gray-400 mt-1">Pottery, baskets & art</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="p-3 rounded-lg bg-[#36003B] mr-4 flex items-center justify-center">
                      <Heart size={24} className="text-[#FF3EA5]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Jewelry</h3>
                      <p className="text-sm text-gray-400 mt-1">Traditional silver & gold</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="p-3 rounded-lg bg-[#3A3600] mr-4 flex items-center justify-center">
                      <Search size={24} className="text-[#FFD426]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Home Decor</h3>
                      <p className="text-sm text-gray-400 mt-1">Cultural decorations</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="p-3 rounded-lg bg-[#003619] mr-4 flex items-center justify-center">
                      <ShoppingBag size={24} className="text-[#00A67E]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Gift Sets</h3>
                      <p className="text-sm text-gray-400 mt-1">Curated cultural packages</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Featured Products
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                      <Coffee size={48} className="text-white" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-white">Ethiopian Coffee Beans</h3>
                        <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                          Popular
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">Single origin Yirgacheffe</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">4.9 (127 reviews)</span>
                      </div>
                      <p className="text-lg font-bold text-white">$24.99</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                      <Shirt size={48} className="text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-1">Habesha Kemis</h3>
                      <p className="text-sm text-gray-400 mb-2">Traditional white dress</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">4.8 (89 reviews)</span>
                      </div>
                      <p className="text-lg font-bold text-white">$149.99</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                      <Music size={48} className="text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-1">Krar (Traditional Lyre)</h3>
                      <p className="text-sm text-gray-400 mb-2">Handcrafted instrument</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">4.7 (43 reviews)</span>
                      </div>
                      <p className="text-lg font-bold text-white">$299.99</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                      <Gift size={48} className="text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-1">Berbere Spice Blend</h3>
                      <p className="text-sm text-gray-400 mb-2">Authentic Ethiopian spice</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">4.9 (156 reviews)</span>
                      </div>
                      <p className="text-lg font-bold text-white">$12.99</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <button className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium">
                    View All Products
                    <ArrowRight size={16} />
                  </button>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Popular Collections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#1A1A1A] rounded-lg p-6 text-center hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Coffee size={32} className="text-white" />
                    </div>
                    <h3 className="font-medium text-white mb-2">Coffee Lover's Set</h3>
                    <p className="text-sm text-gray-400 mb-4">Beans, cups & ceremony tools</p>
                    <span className="text-primary font-semibold">From $89.99</span>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-6 text-center hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shirt size={32} className="text-white" />
                    </div>
                    <h3 className="font-medium text-white mb-2">Traditional Wear</h3>
                    <p className="text-sm text-gray-400 mb-4">Complete outfit collection</p>
                    <span className="text-primary font-semibold">From $199.99</span>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-6 text-center hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Music size={32} className="text-white" />
                    </div>
                    <h3 className="font-medium text-white mb-2">Music Collection</h3>
                    <p className="text-sm text-gray-400 mb-4">Instruments & recordings</p>
                    <span className="text-primary font-semibold">From $149.99</span>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-6 text-center hover:bg-[#222] transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart size={32} className="text-white" />
                    </div>
                    <h3 className="font-medium text-white mb-2">Artisan Crafts</h3>
                    <p className="text-sm text-gray-400 mb-4">Handmade cultural items</p>
                    <span className="text-primary font-semibold">From $49.99</span>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <button className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium">
                    View All Collections
                    <ArrowRight size={16} />
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
