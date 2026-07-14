export type Language = "en" | "am" | "ti";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "am", label: "አማ" },
  { code: "ti", label: "ትግ" },
];

export const translations = {
  en: {
    // Navigation
    "nav.shop": "Shop",
    "nav.sell": "Sell",
    "nav.feed": "Feed",
    "nav.cultural_guide": "Cultural Guide",
    "nav.find_it": "Find it",
    "nav.search": "Search",
    "nav.sign_in": "Sign in",
    "nav.my_account": "My account",
    "nav.storefronts": "Storefronts",
    "nav.community": "Community",
    "nav.enter": "Enter OneTribe",
    "nav.get_started": "Get started",

    // Marketplace categories
    "cat.all": "All categories",
    "cat.traditional": "Traditional Wear",
    "cat.coffee": "Coffee & Spices",
    "cat.home": "Home & Decor",
    "cat.jewelry": "Jewelry & Accessories",
    "cat.art": "Art & Iconography",
    "cat.music": "Music & Instruments",
    "cat.beauty": "Beauty & Personal Care",
    "cat.religious": "Religious Items",

    // Actions
    "action.buy_now": "Buy now",
    "action.add_to_cart": "Add to cart",
    "action.add_to_wishlist": "Add to wishlist",
    "action.contact_seller": "Contact seller",
    "action.join_waitlist": "Join waitlist",

    // Find it for me
    "find.title": "Find it for me",
    "find.describe": "Describe what you're looking for",
    "find.button": "Find it",

    // Community feed
    "feed.title": "Voices of the tribe",
    "feed.share": "Share a story",
    "feed.latest": "Latest",

    // Simple mode
    "simple.need_help": "Need help?",
    "simple.help.how_buy": "How to buy",
    "simple.help.how_sell": "How to sell",
    "simple.help.contact": "Contact us",
    "simple.confirm_purchase": "Are you sure you want to buy {item} for {price}?",
    "simple.mode_label": "Simple mode",
    "confirm.title": "Confirm your purchase",
    "confirm.body": "Are you sure you want to buy {item} for {price}?",
    "confirm.confirm": "Confirm purchase",
    "confirm.cancel": "Cancel",
  },
  am: {
    "nav.shop": "ሱቅ",
    "nav.sell": "ሽጥ",
    "nav.feed": "ፍሰት",
    "nav.cultural_guide": "የባህል መመሪያ",
    "nav.find_it": "ፈልግልኝ",
    "nav.search": "ፈልግ",
    "nav.sign_in": "ግባ",
    "nav.my_account": "መለያዬ",
    "nav.storefronts": "ሱቆች",
    "nav.community": "ማህበረሰብ",
    "nav.enter": "ወደ OneTribe ግባ",
    "nav.get_started": "ጀምር",

    "cat.all": "ሁሉም",
    "cat.traditional": "ባህላዊ ልብስ",
    "cat.coffee": "ቡና እና ቅመም",
    "cat.home": "ቤት እና ዕቃ",
    "cat.jewelry": "ጌጣጌጥ",
    "cat.art": "ጥበብ",
    "cat.music": "ሙዚቃ",
    "cat.beauty": "ውበት",
    "cat.religious": "ሃይማኖታዊ ዕቃ",

    "action.buy_now": "አሁን ግዛ",
    "action.add_to_cart": "ወደ ጋሪ ጨምር",
    "action.add_to_wishlist": "ወደ ምኞት ዝርዝር ጨምር",
    "action.contact_seller": "ሻጩን አግኙ",
    "action.join_waitlist": "ወረፋ ተቀላቀሉ",

    "find.title": "ፈልግልኝ",
    "find.describe": "የምትፈልገውን ግለጽ",
    "find.button": "ፈልግ",

    "feed.title": "የጎሳው ድምፆች",
    "feed.share": "ታሪክ አጋራ",
    "feed.latest": "የቅርቡ",

    "simple.need_help": "እርዳታ ይፈልጋሉ?",
    "simple.help.how_buy": "እንዴት እንደሚገዙ",
    "simple.help.how_sell": "እንዴት እንደሚሸጡ",
    "simple.help.contact": "ያግኙን",
    "simple.confirm_purchase": "{item}ን በ{price} መግዛት እርግጠኛ ነዎት?",
    "simple.mode_label": "ቀላል ሁነታ",
    "confirm.title": "ግዢዎን ያረጋግጡ",
    "confirm.body": "{price} ለ{item} መግዛት ይፈልጋሉ?",
    "confirm.confirm": "ግዢን አረጋግጥ",
    "confirm.cancel": "ሰርዝ",
  },
  ti: {
    "nav.shop": "ዕዳጋ",
    "nav.sell": "ሸይጥ",
    "nav.feed": "መዓልቲ",
    "nav.cultural_guide": "ባህላዊ መምርሒ",
    "nav.find_it": "ረኽቦ",
    "nav.search": "ደልዩ",
    "nav.sign_in": "እቶ",
    "nav.my_account": "ሕሳበይ",
    "nav.storefronts": "ዱካናት",
    "nav.community": "ማሕበረሰብ",
    "nav.enter": "ናብ OneTribe እቶ",
    "nav.get_started": "ጀምር",

    "cat.all": "ኩሉ",
    "cat.traditional": "ባህላዊ ክዳን",
    "cat.coffee": "ቡን ምቅዋማት",
    "cat.home": "ገዛ ስቃያት",
    "cat.jewelry": "ጌጥን ተወሳኺን",
    "cat.art": "ስነ ጥበብ",
    "cat.music": "ሙዚቃ",
    "cat.beauty": "ጽባቐ",
    "cat.religious": "ሃይማኖታዊ ነገራት",

    "action.buy_now": "ሕጂ ዕደጎ",
    "action.add_to_cart": "ናብ ጋሪ ወስኽ",
    "action.add_to_wishlist": "ናብ ድላይ ወስኽ",
    "action.contact_seller": "ሸያጢ ተወከሱ",
    "action.join_waitlist": "ተሰርዓ ተጸበዩ",

    "find.title": "ረኽቦ",
    "find.describe": "እንታይ ትደሊ ግለጽ",
    "find.button": "ረኽቦ",

    "feed.title": "ድምጺ ጎሳ",
    "feed.share": "ዛንታ ኣካፍል",
    "feed.latest": "ናይ ቀረባ",

    "simple.need_help": "ሓገዝ ትደሊ ዲኻ?",
    "simple.help.how_buy": "ብኸመይ ትዕድግ",
    "simple.help.how_sell": "ብኸመይ ትሸይጥ",
    "simple.help.contact": "ተወከሱና",
    "simple.confirm_purchase": "{item} ብ{price} ክትዕድግ ትደሊ ዲኻ?",
    "simple.mode_label": "ቀሊል ኩነታት",
    "confirm.title": "ዕድጊኻ ኣረጋግጽ",
    "confirm.body": "{price} ንምዕዳግ {item} ትደሊ ዶ?",
    "confirm.confirm": "ዕድጊ ኣረጋግጽ",
    "confirm.cancel": "ሰርዝ",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
