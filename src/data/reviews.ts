export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  helpful: number;
}

export const reviews: Review[] = [
  // Pour-Over Carafe Set
  { id: "r-001", productId: "brew-001", author: "Marina K.", rating: 5, title: "Gorgeous and functional", body: "The glass is beautifully made and the steel filter produces a remarkably clean cup. I've replaced all my paper filters.", date: "2025-12-14", helpful: 23 },
  { id: "r-002", productId: "brew-001", author: "Tom H.", rating: 4, title: "Great carafe, small filter issue", body: "Love the carafe itself. The filter can be a bit slow if you grind too fine, but once I adjusted my grind size it works perfectly.", date: "2025-11-28", helpful: 11 },
  { id: "r-003", productId: "brew-001", author: "Priya S.", rating: 5, title: "My morning ritual", body: "This has completely changed how I make coffee. The bamboo collar stays cool to the touch and the whole set looks stunning on my counter.", date: "2025-10-05", helpful: 8 },

  // French Press Pro
  { id: "r-004", productId: "brew-002", author: "Daniel W.", rating: 5, title: "Keeps coffee hot for hours", body: "The double-wall insulation is no joke. Coffee stays piping hot way longer than my old glass French press. The filtration is excellent too.", date: "2025-12-01", helpful: 15 },
  { id: "r-005", productId: "brew-002", author: "Lydia M.", rating: 4, title: "Heavy but worth it", body: "It's heavier than expected due to the stainless steel construction, but the quality is undeniable. Almost zero sediment in every cup.", date: "2025-11-15", helpful: 7 },

  // AeroPress Travel Kit
  { id: "r-006", productId: "brew-003", author: "Jake R.", rating: 5, title: "Perfect travel companion", body: "Took this camping and it made the best coffee I've ever had outdoors. The carrying case fits everything snugly.", date: "2025-12-20", helpful: 31 },
  { id: "r-007", productId: "brew-003", author: "Sonia L.", rating: 5, title: "Office game changer", body: "I keep this at my desk and brew fresh cups throughout the day. Cleanup takes 30 seconds. Colleagues are jealous.", date: "2025-11-22", helpful: 19 },
  { id: "r-008", productId: "brew-003", author: "Chris B.", rating: 4, title: "Great but wish it was bigger", body: "Makes an amazing cup but the single-serve capacity means I'm brewing twice when my partner wants one too.", date: "2025-10-18", helpful: 6 },

  // Conical Burr Grinder
  { id: "r-009", productId: "grind-001", author: "Anika P.", rating: 5, title: "Consistency is king", body: "The grind uniformity across all settings is impressive. I've tested it with pour-over, French press, and espresso — excellent results each time.", date: "2025-12-08", helpful: 22 },
  { id: "r-010", productId: "grind-001", author: "Marcus J.", rating: 4, title: "Solid mid-range grinder", body: "Does everything I need. The low-speed motor is noticeably quieter than my old blade grinder. Minor static on finer settings.", date: "2025-11-03", helpful: 9 },

  // Hand Mill Ceramic
  { id: "r-011", productId: "grind-002", author: "Yuki T.", rating: 5, title: "Beautiful and meditative", body: "Grinding by hand has become part of my morning meditation. The walnut accents are gorgeous and the ceramic burrs produce a wonderful grind.", date: "2025-12-12", helpful: 14 },
  { id: "r-012", productId: "grind-002", author: "Rachel G.", rating: 3, title: "Arm workout included", body: "The grind quality is excellent but grinding 30g of light roast beans takes real effort. Great for occasional use, tiring for daily.", date: "2025-10-29", helpful: 18 },

  // Electric Flat Burr Elite
  { id: "r-013", productId: "grind-003", author: "Vincent C.", rating: 5, title: "Professional quality at home", body: "The digital profiles are a game changer. I have one set for espresso, one for pour-over, and switch instantly. Grind quality rivals café equipment.", date: "2025-12-18", helpful: 27 },

  // Gooseneck Kettle
  { id: "r-014", productId: "acc-001", author: "Emma D.", rating: 5, title: "Precision pouring perfected", body: "The temperature control is spot-on and the spout gives me complete control over pour rate. My pour-over technique has improved dramatically.", date: "2025-12-22", helpful: 20 },
  { id: "r-015", productId: "acc-001", author: "Raj N.", rating: 5, title: "Worth every penny", body: "I debated between this and cheaper options. So glad I went premium — the hold mode alone is worth it when I get distracted in the morning.", date: "2025-11-30", helpful: 16 },
  { id: "r-016", productId: "acc-001", author: "Lisa F.", rating: 4, title: "Almost perfect", body: "Beautiful kettle with great temperature accuracy. Only wish it had a slightly larger capacity for when I'm making coffee for guests.", date: "2025-10-14", helpful: 5 },

  // Precision Brew Scale
  { id: "r-017", productId: "acc-002", author: "Omar S.", rating: 4, title: "Essential brewing tool", body: "The built-in timer is incredibly convenient. The 0.1g accuracy is perfect for dialing in recipes. Battery life is as advertised.", date: "2025-12-05", helpful: 12 },
  { id: "r-018", productId: "acc-002", author: "Helen W.", rating: 5, title: "Compact and accurate", body: "Fits perfectly under my V60 dripper. The auto-tare feature saves so much time. USB-C charging is a nice modern touch.", date: "2025-11-18", helpful: 10 },

  // Double-Wall Tasting Cups
  { id: "r-019", productId: "acc-003", author: "Ben A.", rating: 5, title: "Elegant and practical", body: "These cups are stunning. The floating drink effect impresses every guest. They keep espresso warm much longer than regular cups.", date: "2025-12-10", helpful: 13 },
  { id: "r-020", productId: "acc-003", author: "Carla M.", rating: 4, title: "Lovely but fragile", body: "Beautiful cups that enhance the drinking experience. Handle with care during washing — the double wall glass is delicate.", date: "2025-11-07", helpful: 8 },

  // Ethiopian Yirgacheffe
  { id: "r-021", productId: "bean-001", author: "Nadia Z.", rating: 5, title: "Extraordinary complexity", body: "The floral notes are unlike anything I've tasted. Brewed as a pour-over, the blueberry finish is absolutely real and stunning.", date: "2025-12-19", helpful: 25 },
  { id: "r-022", productId: "bean-001", author: "James P.", rating: 5, title: "Coffee revelation", body: "If you think all coffee tastes the same, try this. The jasmine aroma alone is worth the price. Best light roast I've ever had.", date: "2025-11-25", helpful: 21 },
  { id: "r-023", productId: "bean-001", author: "Mei L.", rating: 4, title: "Exceptional but specific", body: "Incredible in a pour-over but doesn't shine as much in a French press. Know your brew method before buying.", date: "2025-10-22", helpful: 14 },

  // Colombian Supremo
  { id: "r-024", productId: "bean-002", author: "Alex K.", rating: 5, title: "Everyday perfection", body: "This is my go-to daily bean. Chocolate and caramel notes come through in every method. Great value for specialty coffee.", date: "2025-12-15", helpful: 17 },
  { id: "r-025", productId: "bean-002", author: "Sarah T.", rating: 4, title: "Solid and reliable", body: "Not the most exciting coffee but incredibly consistent and crowd-pleasing. Everyone in our office loves it.", date: "2025-11-09", helpful: 9 },

  // Espresso Signature Blend
  { id: "r-026", productId: "bean-003", author: "Franco R.", rating: 5, title: "Crema for days", body: "This blend produces the most beautiful crema I've seen from home espresso. Dark chocolate notes are rich without being bitter.", date: "2025-12-11", helpful: 19 },
  { id: "r-027", productId: "bean-003", author: "Tina H.", rating: 4, title: "Great in lattes", body: "The bold flavor cuts through milk perfectly. My flat whites have never tasted better. A bit intense for black coffee drinkers.", date: "2025-11-20", helpful: 11 },
];

export function getProductReviews(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}
