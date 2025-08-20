import { useState } from "react";
import { Upload, DollarSign, Tag, Package, Camera } from "lucide-react";

export const SellItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    size: "",
    location: ""
  });

  const categories = ["Traditional Wear", "Home & Decor", "Jewelry", "Art", "Music"];
  const conditions = ["New with tags", "New without tags", "Excellent", "Very Good", "Good", "Fair"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Listing item:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">List an Item</h1>
        <p className="text-muted-foreground">
          Share your traditional items with the OneTribe community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photos */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera size={20} />
            Photos
          </h2>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Click to upload photos or drag and drop</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            <button type="button" className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Choose Files
            </button>
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package size={20} />
            Item Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title*</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="e.g., Traditional Ethiopian Habesha Kemis"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category*</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Condition*</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Select condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="e.g., S, M, L, XL"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">Description*</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-input rounded-md bg-background h-32"
              placeholder="Describe your item in detail..."
              required
            />
          </div>
        </div>

        {/* Pricing & Location */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={20} />
            Pricing & Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price*</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full pl-8 pr-3 py-2 border border-input rounded-md bg-background"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location*</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="e.g., Washington, DC"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-input rounded-md hover:bg-accent transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            List Item
          </button>
        </div>
      </form>
    </div>
  );
};