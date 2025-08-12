
import { useState } from "react";
import { CommunityFeed } from "./CommunityFeed";
import { ChatInterface } from "./ChatInterface";
import { Marketplace } from "./Marketplace";
import { Assistant } from "./Assistant";

type ContentView = 'home' | 'marketplace' | 'community' | 'messages' | 'assistant' | 'profile';

interface MainContentProps {
  activeView: ContentView;
}

export const MainContent = ({ activeView }: MainContentProps) => {
  switch (activeView) {
    case 'marketplace':
      return <Marketplace />;
    case 'community':
      return <CommunityFeed />;
    case 'messages':
      return (
        <div className="h-[calc(100vh-4rem)]">
          <ChatInterface />
        </div>
      );
    case 'assistant':
      return (
        <div className="h-[calc(100vh-4rem)]">
          <Assistant />
        </div>
      );
    case 'home':
    default:
      return (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to OneTribe
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The premier marketplace for authentic Ethiopian & Eritrean cultural goods
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Start Shopping
              </button>
              <button className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                Sell Your Items
              </button>
            </div>
          </div>

          {/* Featured Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Featured Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <img 
                  src="/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png" 
                  alt="Traditional Clothing"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">Traditional Clothing</h3>
                <p className="text-gray-300">Authentic habesha kemis, traditional dresses, and cultural attire</p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <img 
                  src="/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png" 
                  alt="Coffee & Spices"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">Coffee & Spices</h3>
                <p className="text-gray-300">Premium Ethiopian coffee, berbere, and traditional spices</p>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                <img 
                  src="/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png" 
                  alt="Handcrafts"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">Handcrafts & Art</h3>
                <p className="text-gray-300">Handwoven baskets, traditional art, and cultural artifacts</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Community Highlights</h2>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <p className="text-gray-300 mb-4">
                Join our growing community of Ethiopian and Eritrean culture enthusiasts. 
                Connect with sellers, discover authentic goods, and share your cultural heritage.
              </p>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  Join Community Feed
                </button>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
                  Browse Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      );
  }
};
