import GrailedLayout from "@/components/GrailedLayout";

const CulturalGuidePage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cultural Guide</h1>
            <p className="text-muted-foreground">
              Learn about the rich traditions behind the clothing and items on OneTribe.
            </p>
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Traditional Ethiopian Clothing</h2>
              <p className="text-muted-foreground mb-4">
                Ethiopian traditional clothing is rich in history and cultural significance. The kemis, 
                a traditional white cotton dress, is often worn during special occasions and celebrations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded p-4">
                  <h3 className="font-semibold mb-2">Kemis</h3>
                  <p className="text-sm text-muted-foreground">
                    A traditional white cotton dress with colorful borders, worn by Ethiopian women.
                  </p>
                </div>
                <div className="bg-muted rounded p-4">
                  <h3 className="font-semibold mb-2">Netela</h3>
                  <p className="text-sm text-muted-foreground">
                    A light cotton scarf with beautiful embroidered borders, often paired with kemis.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Care Instructions</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  • Traditional cotton garments should be hand-washed in cold water
                </p>
                <p className="text-muted-foreground">
                  • Avoid harsh detergents that may damage delicate embroidery
                </p>
                <p className="text-muted-foreground">
                  • Air dry in shade to preserve colors and fabric integrity
                </p>
                <p className="text-muted-foreground">
                  • Store in breathable garment bags to prevent damage
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default CulturalGuidePage;
