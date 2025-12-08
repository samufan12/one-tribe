
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import kemis1 from "@/assets/kemis-1.jpg";
import kemis2 from "@/assets/kemis-2.jpg";
import coffeeSet from "@/assets/coffee-set.jpg";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const HomeContent = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to OneTribe
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          The premier marketplace for authentic traditional clothing
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => navigate('/marketplace')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Start Shopping
          </button>
          {!user && (
            <button 
              onClick={() => navigate('/auth')}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              Sign In / Sign Up
            </button>
          )}
          {user && (
            <button 
              onClick={() => navigate('/sell')}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              Sell Your Items
            </button>
          )}
        </div>
      </div>

      {/* Featured Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate('/categories')}
          >
            <div className="w-full h-48 rounded-md mb-4 overflow-hidden">
              <img src={kemis1} alt="Traditional Kemis" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Traditional Kemis</h3>
            <p className="text-muted-foreground">Authentic traditional dresses and cultural attire</p>
          </div>
          
          <div 
            className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate('/categories')}
          >
            <div className="w-full h-48 rounded-md mb-4 overflow-hidden">
              <img src={kemis2} alt="Cultural Accessories" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cultural Accessories</h3>
            <p className="text-muted-foreground">Traditional jewelry, scarves, and accessories</p>
          </div>
          
          <div 
            className="bg-card rounded-lg p-6 border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate('/categories')}
          >
            <div className="w-full h-48 rounded-md mb-4 overflow-hidden">
              <img src={coffeeSet} alt="Handcrafts" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Handcrafts & Art</h3>
            <p className="text-muted-foreground">Handwoven items and traditional crafts</p>       
          </div>
        </div>
      </div>

      {/* Community Highlights */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Community Highlights</h2>
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground mb-4">
            Join our growing community of traditional clothing enthusiasts. 
            Connect with sellers, discover authentic goods, and share your cultural heritage.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/community')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Join Community Feed
            </button>
            <button 
              onClick={() => navigate('/marketplace')}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <HomeContent />
    </Layout>
  );
};

export default Index;
