import { Palette, Ruler, Shirt, Info } from "lucide-react";
import kemis1 from "@/assets/kemis-1.jpg";
import kemis2 from "@/assets/kemis-2.jpg";
import seller2 from "@/assets/seller-2.jpg";

export const StyleGuide = () => {
  const traditionalStyles = [
    {
      name: "Habesha Kemis",
      origin: "Ethiopia",
      description: "Traditional white cotton dress with colorful woven borders",
      occasions: ["Weddings", "Religious ceremonies", "Cultural festivals"],
      features: ["Hand-woven cotton", "Colorful tibeb borders", "Long sleeves", "Floor-length"]
    },
    {
      name: "Zuria",
      origin: "Eritrea", 
      description: "Elegant traditional dress with intricate embroidery",
      occasions: ["Special celebrations", "Church events", "Cultural gatherings"],
      features: ["Embroidered patterns", "Traditional colors", "Flowing silhouette", "Cultural significance"]
    },
    {
      name: "Netela",
      origin: "Ethiopia/Eritrea",
      description: "Traditional white cotton shawl with decorative borders",
      occasions: ["Church services", "Prayer meetings", "Traditional ceremonies"],
      features: ["Pure cotton", "Hand-woven", "Decorative borders", "Versatile styling"]
    }
  ];

  const colorMeanings = [
    { color: "White", meaning: "Purity, peace, spiritual significance", usage: "Base color for most traditional garments" },
    { color: "Red", meaning: "Strength, courage, celebration", usage: "Often used in border patterns and embroidery" },
    { color: "Green", meaning: "Growth, harmony, nature", usage: "Common in traditional patterns and designs" },
    { color: "Gold/Yellow", meaning: "Prosperity, wisdom, divinity", usage: "Used for special occasion garments and trim" },
    { color: "Blue", meaning: "Sky, heaven, tranquility", usage: "Popular in modern traditional wear variations" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Traditional Style Guide</h1>
        <p className="text-muted-foreground">
          Learn about authentic traditional clothing styles, their cultural significance, and proper wearing guidelines
        </p>
      </div>

      {/* Traditional Styles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shirt className="w-6 h-6" />
          Traditional Garments
        </h2>
        <div className="grid gap-6">
          {traditionalStyles.map((style, index) => (
            <div key={index} className="bg-card rounded-lg border p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48 h-48 rounded-lg overflow-hidden">
                  <img 
                    src={index === 0 ? kemis1 : index === 1 ? kemis2 : seller2} 
                    alt={style.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{style.name}</h3>
                    <p className="text-sm text-muted-foreground">Origin: {style.origin}</p>
                  </div>
                  <p className="text-muted-foreground">{style.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Appropriate Occasions:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {style.occasions.map((occasion, i) => (
                          <li key={i}>• {occasion}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {style.features.map((feature, i) => (
                          <li key={i}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Meanings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="w-6 h-6" />
          Color Significance
        </h2>
        <div className="grid gap-4">
          {colorMeanings.map((item, index) => (
            <div key={index} className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center">
                  <div 
                    className={`w-6 h-6 rounded-full ${
                      item.color === 'White' ? 'bg-white border' :
                      item.color === 'Red' ? 'bg-red-500' :
                      item.color === 'Green' ? 'bg-green-500' :
                      item.color === 'Gold/Yellow' ? 'bg-yellow-500' :
                      item.color === 'Blue' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.color}</h4>
                  <p className="text-sm text-muted-foreground">{item.meaning}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.usage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Guidelines */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Info className="w-6 h-6" />
          Cultural Guidelines
        </h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Respectful Wearing</h3>
              <p className="text-sm text-muted-foreground">
                Traditional garments carry deep cultural significance. When wearing traditional clothing:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>• Understand the cultural context and appropriate occasions</li>
                <li>• Show respect for the traditions and heritage they represent</li>
                <li>• Appreciate the craftsmanship and cultural artistry</li>
                <li>• Support authentic artisans and traditional makers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Authenticity</h3>
              <p className="text-sm text-muted-foreground">
                Look for authentic pieces that support traditional artisans and preserve cultural heritage. 
                Quality indicators include hand-woven fabrics, traditional patterns, and proper construction techniques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};