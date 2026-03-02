import { useState, useEffect } from "react";
import GrailedLayout from "@/components/GrailedLayout";
import { CreateStorefront } from "@/components/CreateStorefront";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CreateStorefrontPage = () => {
  const { user } = useAuth();
  const [existingStorefront, setExistingStorefront] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStorefront = async () => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("storefronts")
        .select("id, name, description, logo_url, cover_image_url")
        .eq("user_id", user.id)
        .maybeSingle();
      setExistingStorefront(data);
      setLoading(false);
    };
    fetchStorefront();
  }, [user]);

  if (loading) {
    return (
      <GrailedLayout requireAuth>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
        </div>
      </GrailedLayout>
    );
  }

  return (
    <GrailedLayout requireAuth>
      <CreateStorefront existingStorefront={existingStorefront} />
    </GrailedLayout>
  );
};

export default CreateStorefrontPage;
