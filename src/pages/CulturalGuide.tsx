import { Link } from "react-router-dom";
import GrailedLayout from "@/components/GrailedLayout";
import { Button } from "@/components/ui/button";

type Article = {
  title: string;
  tag: string;
  readTime: string;
  body: string;
  shopCategory: string;
};

const articles: Article[] = [
  {
    title: "The Art of the Kemis",
    tag: "Clothing",
    readTime: "2 min read",
    shopCategory: "Traditional Wear",
    body: "The habesha kemis is Ethiopia and Eritrea's most iconic garment — a flowing white dress with intricate embroidery called tilet along the hem, collar, and cuffs. Worn for holidays like Timkat and Enkutatash, weddings, and Sunday church, the kemis is hand-embroidered by skilled artisans, often passed down through generations. The gold or colored tilet patterns vary by region — Gondar, Tigray, and Harar each have distinct styles. Finding an authentic kemis outside of East Africa is rare, which is why OneTribe exists.",
  },
  {
    title: "Coffee Is Not a Drink. It's a Ceremony.",
    tag: "Food & Drink",
    readTime: "2 min read",
    shopCategory: "Coffee & Spices",
    body: "The Ethiopian coffee ceremony — known as \"Buna\" — is one of the oldest and most meaningful cultural rituals in the world. Green coffee beans are roasted fresh over charcoal, ground by hand with a mukecha and zenezena, then brewed in a clay jebena pot. Three rounds are served: Abol, Tona, and Baraka — each progressively lighter, each with meaning. The ceremony can last hours. It is an act of hospitality, community, and peace. A proper coffee ceremony set includes the jebena, small ceramic cups (cini), a tray, and incense.",
  },
  {
    title: "Netela: The Shawl That Carries Everything",
    tag: "Clothing",
    readTime: "2 min read",
    shopCategory: "Traditional Wear",
    body: "The netela is a lightweight white cotton shawl worn by Ethiopian and Eritrean women — draped over the head and shoulders for church, wrapped around the body for warmth, used to carry children, and laid out as a welcome cloth for guests. It is one of the most versatile garments in the world. Handwoven on traditional looms, authentic netelas have a colored border — the thickness and pattern of which signals the occasion. A thin border for daily wear, a wide embroidered border for holidays and ceremonies.",
  },
  {
    title: "Berbere: The Spice Blend Behind Every Habesha Kitchen",
    tag: "Food & Drink",
    readTime: "2 min read",
    shopCategory: "Coffee & Spices",
    body: "Berbere is the foundation of Ethiopian and Eritrean cooking — a complex, aromatic spice blend of chili peppers, fenugreek, coriander, korarima (Ethiopian cardamom), rue, ajwain, and dozens of other spices depending on the family recipe. No two berbere blends are identical. It is the base of tibs, doro wat, and most key wot dishes. Authentic berbere made by diaspora cooks from imported Ethiopian spices is impossible to find in mainstream grocery stores — and is one of the most requested items in the Habesha diaspora community.",
  },
  {
    title: "The Mesob: Ethiopia's Living Dining Table",
    tag: "Home & Decor",
    readTime: "2 min read",
    shopCategory: "Home & Decor",
    body: "The mesob is a large, hand-woven basket table used throughout Ethiopia and Eritrea as the centerpiece of communal eating. Made from dried grass and straw, dyed in vibrant patterns, the mesob holds the injera tray and serves as both furniture and art. Families gather around it — eating from a shared plate, a practice called gursha. An authentic mesob takes weeks to weave and is one of the most distinctive and meaningful pieces of Habesha home decor. Each one is unique.",
  },
];

const CulturalGuidePage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-20 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            The Cultural Guide
          </p>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
            Stories behind the goods
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Short essays on the clothing, food, and craft traditions of Ethiopia and Eritrea.
          </p>
        </header>

        <div className="space-y-24">
          {articles.map((a) => (
            <article key={a.title} className="space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                {a.tag}
              </span>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif tracking-tight leading-tight">
                  {a.title}
                </h2>
                <p className="text-sm text-muted-foreground">{a.readTime}</p>
              </div>

              <p className="text-lg leading-relaxed text-foreground/85">
                {a.body}
              </p>

              <div className="pt-4">
                <Button asChild variant="outline" size="lg">
                  <Link to={`/marketplace?category=${encodeURIComponent(a.shopCategory)}`}>
                    Shop {a.shopCategory} →
                  </Link>
                </Button>
              </div>

              <div className="pt-12 border-b border-border/60" />
            </article>
          ))}
        </div>
      </div>
    </GrailedLayout>
  );
};

export default CulturalGuidePage;
