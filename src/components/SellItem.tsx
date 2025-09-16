import { useState, useRef } from "react";
import { Upload, DollarSign, Tag, Package, Camera, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts, CreateProductData } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import kemis1 from "@/assets/kemis-1.jpg";
import kemis2 from "@/assets/kemis-2.jpg";
import coffeeSet from "@/assets/coffee-set.jpg";

export const SellItem = () => {
  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    size: "",
    location: ""
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesPreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = ["Traditional Wear", "Home & Decor", "Jewelry", "Art", "Music"];
  const conditions = ["New with tags", "New without tags", "Excellent", "Very Good", "Good", "Fair"];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + selectedImages.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images per product",
        variant: "destructive",
      });
      return;
    }

    const newFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...newFiles]);

    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImages.length === 0) {
      toast({
        title: "Images required",
        description: "Please add at least one image of your item",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const productData: CreateProductData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      condition: formData.condition,
      size: formData.size || undefined,
      location: formData.location,
      images: selectedImages,
      status: 'active'
    };

    const success = await createProduct(productData);
    
    if (success) {
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        size: "",
        location: ""
      });
      setSelectedImages([]);
      setImagePreviews([]);
      
      // Navigate to marketplace
      navigate('/marketplace');
    }
    
    setLoading(false);
  };

  const saveDraft = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Title and description required",
        description: "Please provide at least a title and description to save as draft",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const productData: CreateProductData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category || 'Other',
      condition: formData.condition || 'Good',
      size: formData.size || undefined,
      location: formData.location || 'Not specified',
      images: selectedImages,
      status: 'draft'
    };

    await createProduct(productData);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">List an Item</h1>
        <p className="text-muted-foreground">
          Share your traditional items with the OneTribe community
        </p>
      </div>

      <div className="space-y-8">
        {/* Tips Section */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Selling Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-full h-32 rounded-md mb-3 overflow-hidden">
                <img src={kemis1} alt="High quality photos" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium mb-2">High Quality Photos</h3>
              <p className="text-sm text-muted-foreground">Use natural lighting and show multiple angles</p>
            </div>
            <div className="text-center">
              <div className="w-full h-32 rounded-md mb-3 overflow-hidden">
                <img src={kemis2} alt="Detailed descriptions" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium mb-2">Detailed Descriptions</h3>
              <p className="text-sm text-muted-foreground">Include materials, measurements, and history</p>
            </div>
            <div className="text-center">
              <div className="w-full h-32 rounded-md mb-3 overflow-hidden">
                <img src={coffeeSet} alt="Fair pricing" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium mb-2">Fair Pricing</h3>
              <p className="text-sm text-muted-foreground">Research similar items for competitive pricing</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photos */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera size={20} />
            Photos ({selectedImages.length}/5)
          </h2>
          
          {/* Image Previews */}
          {imagesPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {imagesPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div 
            className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Click to upload photos or drag and drop</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB (max 5 images)</p>
            <button type="button" className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Choose Files
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
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
            onClick={saveDraft}
            disabled={loading}
            className="px-6 py-2 border border-input rounded-md hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.description || !formData.price || !formData.category || !formData.condition || !formData.location || selectedImages.length === 0}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'List Item'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};