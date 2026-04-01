import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Store, ImageIcon } from "lucide-react";
import { z } from "zod";
import { sanitizeString } from "@/lib/sanitize";

interface CreateStorefrontProps {
  existingStorefront?: {
    id: string;
    name: string;
    description: string | null;
    logo_url: string | null;
    cover_image_url: string | null;
  } | null;
}

export const CreateStorefront = ({ existingStorefront }: CreateStorefrontProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(existingStorefront?.name || "");
  const [description, setDescription] = useState(existingStorefront?.description || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(existingStorefront?.logo_url || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(existingStorefront?.cover_image_url || null);
  const [saving, setSaving] = useState(false);

  const isEditing = !!existingStorefront;

  const handleFileSelect = (file: File, type: "logo" | "cover") => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "logo") {
        setLogoFile(file);
        setLogoPreview(reader.result as string);
      } else {
        setCoverFile(file);
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const storefrontSchema = z.object({
    name: z.string().trim().min(2, "Store name must be at least 2 characters").max(100, "Store name too long"),
    description: z.string().trim().max(1000, "Description too long").optional(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const validation = storefrontSchema.safeParse({ name, description: description || undefined });
    if (!validation.success) {
      toast.error(validation.error.errors[0]?.message || "Invalid input");
      return;
    }

    setSaving(true);
    try {
      let logoUrl = existingStorefront?.logo_url || null;
      let coverUrl = existingStorefront?.cover_image_url || null;

      if (logoFile) {
        logoUrl = await uploadImage(logoFile, `storefronts/${user.id}/logo-${Date.now()}`);
      }
      if (coverFile) {
        coverUrl = await uploadImage(coverFile, `storefronts/${user.id}/cover-${Date.now()}`);
      }

      if (isEditing) {
        const { error } = await supabase
          .from("storefronts")
          .update({
            name: sanitizeString(validation.data.name),
            description: validation.data.description ? sanitizeString(validation.data.description) : null,
            logo_url: logoUrl,
            cover_image_url: coverUrl,
          })
          .eq("id", existingStorefront.id);
        if (error) throw error;
        toast.success("Storefront updated!");
      } else {
        const { error } = await supabase
          .from("storefronts")
          .insert({
            user_id: user.id,
            name: name.trim(),
            description: description.trim() || null,
            logo_url: logoUrl,
            cover_image_url: coverUrl,
          });
        if (error) throw error;
        toast.success("Storefront created!");
      }

      navigate("/storefronts");
    } catch (error: any) {
      console.error("Error saving storefront:", error);
      toast.error(error.message || "Failed to save storefront");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Store className="text-primary" size={28} />
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? "Edit Your Storefront" : "Create Your Storefront"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image */}
        <div>
          <Label>Cover Image</Label>
          <label className="mt-2 block cursor-pointer">
            <div className={`relative w-full h-48 rounded-lg border-2 border-dashed border-border overflow-hidden flex items-center justify-center transition-colors hover:border-primary/50 ${coverPreview ? '' : 'bg-muted'}`}>
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Click to upload cover image</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "cover")}
            />
          </label>
        </div>

        {/* Logo */}
        <div>
          <Label>Logo</Label>
          <label className="mt-2 block cursor-pointer w-fit">
            <div className={`relative w-24 h-24 rounded-full border-2 border-dashed border-border overflow-hidden flex items-center justify-center transition-colors hover:border-primary/50 ${logoPreview ? '' : 'bg-muted'}`}>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Upload size={20} className="text-muted-foreground" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "logo")}
            />
          </label>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Store Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your store name"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell buyers about your store..."
            rows={4}
          />
        </div>

        <Button type="submit" disabled={saving || !name.trim()} className="w-full">
          {saving ? "Saving..." : isEditing ? "Update Storefront" : "Create Storefront"}
        </Button>
      </form>
    </div>
  );
};
