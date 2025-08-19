import { Marketplace } from "./Marketplace";
import { CommunityFeed } from "./CommunityFeed";
import { ChatInterface } from "./ChatInterface";
import { Assistant } from "./Assistant";
import { SellerTools } from "./SellerTools";

type ContentView = 'home' | 'marketplace' | 'community' | 'messages' | 'assistant' | 'profile' | 'become-seller' | 'seller-tools';

interface MainContentProps {
  activeView: ContentView;
}

const HomeContent = () => (
  <div className="space-y-8">
    {/* Hero Section */}
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Kemis Marketplace
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        The premier marketplace for authentic traditional clothing
      </p>
      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
          Start Shopping
        </button>
        <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium">
          Sell Your Items
        </button>
      </div>
    </div>

    {/* Featured Categories */}
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Featured Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors">
          <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
            <span className="text-muted-foreground">Traditional Kemis</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Traditional Kemis</h3>
          <p className="text-muted-foreground">Authentic traditional dresses and cultural attire</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors">
          <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
            <span className="text-muted-foreground">Cultural Accessories</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Cultural Accessories</h3>
          <p className="text-muted-foreground">Traditional jewelry, scarves, and accessories</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors">
          <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
            <span className="text-muted-foreground">Handcrafts</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Handcrafts & Art</h3>
          <p className="text-muted-foreground">Handwoven items and traditional crafts</p>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community Highlights</h2>
      <div className="bg-card rounded-lg border p-6">
        <p className="text-muted-foreground mb-4">
          Join our growing community of traditional clothing enthusiasts. 
          Connect with sellers, discover authentic goods, and share your cultural heritage.
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Join Community Feed
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
            Browse Marketplace
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProfileContent = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <p className="text-muted-foreground">
        Manage your account settings and preferences.
      </p>
    </div>
  </div>
);

export const MainContent = ({ activeView }: MainContentProps) => {
  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomeContent />;
      case 'marketplace':
        return <Marketplace />;
      case 'community':
        return <CommunityFeed />;
      case 'messages':
        return <ChatInterface />;
      case 'assistant':
        return <Assistant />;
      case 'profile':
        return <ProfileContent />;
      case 'seller-tools':
        return <SellerTools />;
      case 'become-seller':
        return <ProfileContent />; // This will be handled by the modal
      default:
        return <HomeContent />;
    }
  };

  return <div className="flex-1">{renderContent()}</div>;
};