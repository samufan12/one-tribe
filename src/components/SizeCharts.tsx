import { Ruler, Users, Shirt, Info } from "lucide-react";

export const SizeCharts = () => {
  const kemisSize = [
    { size: "XS", bust: "32-34", waist: "24-26", hips: "34-36", length: "54-56" },
    { size: "S", bust: "34-36", waist: "26-28", hips: "36-38", length: "56-58" },
    { size: "M", bust: "36-38", waist: "28-30", hips: "38-40", length: "58-60" },
    { size: "L", bust: "38-40", waist: "30-32", hips: "40-42", length: "60-62" },
    { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44", length: "62-64" },
    { size: "XXL", bust: "42-44", waist: "34-36", hips: "44-46", length: "64-66" }
  ];

  const netelaSizes = [
    { size: "Standard", width: "60", length: "90", description: "Traditional church/prayer shawl" },
    { size: "Large", width: "70", length: "100", description: "Ceremonial occasions" },
    { size: "Extra Large", width: "80", length: "110", description: "Special events and weddings" }
  ];

  const mensTraditional = [
    { size: "S", chest: "36-38", waist: "30-32", neck: "14.5-15", sleeve: "32-33" },
    { size: "M", chest: "38-40", waist: "32-34", neck: "15-15.5", sleeve: "33-34" },
    { size: "L", chest: "40-42", waist: "34-36", neck: "15.5-16", sleeve: "34-35" },
    { size: "XL", chest: "42-44", waist: "36-38", neck: "16-16.5", sleeve: "35-36" },
    { size: "XXL", chest: "44-46", waist: "38-40", neck: "16.5-17", sleeve: "36-37" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Size Charts</h1>
        <p className="text-muted-foreground">
          Find your perfect fit for traditional clothing with our comprehensive size guides
        </p>
      </div>

      {/* How to Measure */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5" />
          How to Measure
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold">For Women's Traditional Wear:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><strong>Bust:</strong> Measure around the fullest part of your chest</li>
              <li><strong>Waist:</strong> Measure around your natural waistline</li>
              <li><strong>Hips:</strong> Measure around the fullest part of your hips</li>
              <li><strong>Length:</strong> From shoulder to desired hemline</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">For Men's Traditional Wear:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
              <li><strong>Waist:</strong> Measure around your natural waistline</li>
              <li><strong>Neck:</strong> Measure around the base of your neck</li>
              <li><strong>Sleeve:</strong> From shoulder point to wrist</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Women's Kemis Size Chart */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shirt className="w-5 h-5" />
          Women's Traditional Kemis Sizes
        </h2>
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Size</th>
                  <th className="text-left p-4 font-semibold">Bust (inches)</th>
                  <th className="text-left p-4 font-semibold">Waist (inches)</th>
                  <th className="text-left p-4 font-semibold">Hips (inches)</th>
                  <th className="text-left p-4 font-semibold">Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                {kemisSize.map((size, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4 font-medium">{size.size}</td>
                    <td className="p-4 text-muted-foreground">{size.bust}</td>
                    <td className="p-4 text-muted-foreground">{size.waist}</td>
                    <td className="p-4 text-muted-foreground">{size.hips}</td>
                    <td className="p-4 text-muted-foreground">{size.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Men's Traditional Wear */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Men's Traditional Wear Sizes
        </h2>
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Size</th>
                  <th className="text-left p-4 font-semibold">Chest (inches)</th>
                  <th className="text-left p-4 font-semibold">Waist (inches)</th>
                  <th className="text-left p-4 font-semibold">Neck (inches)</th>
                  <th className="text-left p-4 font-semibold">Sleeve (inches)</th>
                </tr>
              </thead>
              <tbody>
                {mensTraditional.map((size, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4 font-medium">{size.size}</td>
                    <td className="p-4 text-muted-foreground">{size.chest}</td>
                    <td className="p-4 text-muted-foreground">{size.waist}</td>
                    <td className="p-4 text-muted-foreground">{size.neck}</td>
                    <td className="p-4 text-muted-foreground">{size.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Netela Sizes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Traditional Netela Sizes</h2>
        <div className="grid gap-4">
          {netelaSizes.map((netela, index) => (
            <div key={index} className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{netela.size}</h3>
                  <p className="text-sm text-muted-foreground">{netela.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm"><span className="font-medium">Width:</span> {netela.width}"</p>
                  <p className="text-sm"><span className="font-medium">Length:</span> {netela.length}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sizing Tips */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Sizing Tips
        </h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Traditional Fit Guidelines:</h3>
            <ul className="space-y-1 ml-4">
              <li>• Traditional kemis should have a comfortable, modest fit</li>
              <li>• Allow for layering with undergarments as culturally appropriate</li>
              <li>• Length should be floor-length or slightly above for traditional styling</li>
              <li>• Netela shawls can be draped in various traditional styles</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">When in Doubt:</h3>
            <ul className="space-y-1 ml-4">
              <li>• Contact the seller for specific measurements</li>
              <li>• Ask about the garment's traditional fit style</li>
              <li>• Consider the fabric stretch and construction</li>
              <li>• Check if alterations are possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};