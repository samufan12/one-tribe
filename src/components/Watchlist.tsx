import { Heart, MessageCircle, Star, MapPin, Clock } from "lucide-react";

const watchlistItems = [
  {
    id: "1",
    name: "Vintage Ethiopian Traditional Dress",
    price: 320,
    image: "/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png",
    seller: "Almaz Bekele",
    rating: 4.9,
    location: "Atlanta, GA",
    addedDate: "3 days ago",
    status: "available"
  },
  {
    id: "2",
    name: "Handwoven Coffee Ceremony Set",
    price: 150,
    image: "/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png",
    seller: "Tekle Mariam",
    rating: 4.8,
    location: "Dallas, TX",
    addedDate: "1 week ago",
    status: "price_drop"
  },
  {
    id: "3",
    name: "Traditional Silver Jewelry Set",
    price: 280,
    image: "/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png",
    seller: "Hanna Teshome",
    rating: 4.7,
    location: "Seattle, WA",
    addedDate: "2 weeks ago",
    status: "sold"
  }
];

export const Watchlist = () => {
  const removeFromWatchlist = (itemId: string) => {
    console.log("Removing item from watchlist:", itemId);
  };

  const contactSeller = (itemId: string) => {
    console.log("Contacting seller for item:", itemId);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
          <p className="text-muted-foreground">
            Keep track of items you're interested in
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {watchlistItems.length} items saved
        </div>
      </div>

      {watchlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground mb-4">
            Start exploring and save items you're interested in
          </p>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {watchlistItems.map((item) => (
            <div key={item.id} className="bg-card rounded-lg border p-6 hover:border-primary/50 transition-colors">
              <div className="flex gap-6">
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.seller}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${item.price}</div>
                      {item.status === "price_drop" && (
                        <div className="text-sm text-green-600 font-medium">Price dropped!</div>
                      )}
                      {item.status === "sold" && (
                        <div className="text-sm text-red-600 font-medium">Sold</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Added {item.addedDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {item.status !== "sold" && (
                      <button
                        onClick={() => contactSeller(item.id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact Seller
                      </button>
                    )}
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};