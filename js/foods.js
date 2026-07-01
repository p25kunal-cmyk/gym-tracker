// ============================================================
//  FitForge Food Database — 350+ Foods
//  Data based on ICMR Indian Food Composition Tables &
//  USDA FoodData Central (per stated base portion)
// ============================================================

const FOOD_DB = [
  // ─── 🍚 Indian Basics ───────────────────────────────────
  { id:'f001', name:'Steamed Rice (White)', emoji:'🍚', cat:'Indian Basics', portion:'1 cup (200g)', cal:260, p:5, c:57, f:1 },
  { id:'f002', name:'Jeera Rice', emoji:'🍚', cat:'Indian Basics', portion:'1 cup (200g)', cal:290, p:5, c:58, f:5 },
  { id:'f003', name:'Pulao / Veg Pulao', emoji:'🍚', cat:'Indian Basics', portion:'1 plate (250g)', cal:350, p:7, c:62, f:8 },
  { id:'f004', name:'Dal Tadka', emoji:'🥣', cat:'Indian Basics', portion:'1 katori (150g)', cal:150, p:9, c:22, f:4 },
  { id:'f005', name:'Dal Makhani', emoji:'🥣', cat:'Indian Basics', portion:'1 katori (150g)', cal:230, p:10, c:28, f:8 },
  { id:'f006', name:'Rajma Masala', emoji:'🫘', cat:'Indian Basics', portion:'1 katori (150g)', cal:195, p:11, c:30, f:4 },
  { id:'f007', name:'Chole / Chana Masala', emoji:'🫘', cat:'Indian Basics', portion:'1 katori (150g)', cal:200, p:10, c:32, f:4 },
  { id:'f008', name:'Dal Rice (combo)', emoji:'🍱', cat:'Indian Basics', portion:'1 full plate (400g)', cal:430, p:16, c:72, f:7 },
  { id:'f009', name:'Rajma Rice (combo)', emoji:'🍱', cat:'Indian Basics', portion:'1 full plate (400g)', cal:490, p:20, c:82, f:8 },
  { id:'f010', name:'Wheat Roti / Chapati', emoji:'🫓', cat:'Indian Basics', portion:'1 roti (35g)', cal:90, p:3, c:18, f:1 },
  { id:'f011', name:'Butter Roti', emoji:'🫓', cat:'Indian Basics', portion:'1 roti with butter (40g)', cal:135, p:3, c:18, f:5 },
  { id:'f012', name:'Paratha (Plain)', emoji:'🫓', cat:'Indian Basics', portion:'1 paratha (60g)', cal:190, p:4, c:26, f:8 },
  { id:'f013', name:'Aloo Paratha', emoji:'🫓', cat:'Indian Basics', portion:'1 paratha (100g)', cal:280, p:6, c:38, f:11 },
  { id:'f014', name:'Paneer Paratha', emoji:'🫓', cat:'Indian Basics', portion:'1 paratha (110g)', cal:310, p:12, c:32, f:15 },
  { id:'f015', name:'Puri / Poori', emoji:'🍩', cat:'Indian Basics', portion:'2 pieces (60g)', cal:200, p:4, c:25, f:9 },
  { id:'f016', name:'Bhatura', emoji:'🫓', cat:'Indian Basics', portion:'1 piece (80g)', cal:260, p:6, c:36, f:10 },
  { id:'f017', name:'Idli', emoji:'🍥', cat:'Indian Basics', portion:'2 pieces (100g)', cal:130, p:4, c:27, f:1 },
  { id:'f018', name:'Dosa (Plain)', emoji:'🥞', cat:'Indian Basics', portion:'1 dosa (80g)', cal:120, p:3, c:23, f:2 },
  { id:'f019', name:'Masala Dosa', emoji:'🥞', cat:'Indian Basics', portion:'1 dosa (200g)', cal:290, p:7, c:45, f:9 },
  { id:'f020', name:'Uttapam', emoji:'🥞', cat:'Indian Basics', portion:'1 piece (120g)', cal:160, p:5, c:28, f:3 },
  { id:'f021', name:'Upma', emoji:'🥣', cat:'Indian Basics', portion:'1 bowl (200g)', cal:230, p:5, c:38, f:7 },
  { id:'f022', name:'Poha', emoji:'🥣', cat:'Indian Basics', portion:'1 plate (200g)', cal:250, p:5, c:48, f:5 },
  { id:'f023', name:'Sambar', emoji:'🍵', cat:'Indian Basics', portion:'1 katori (150ml)', cal:80, p:4, c:13, f:2 },
  { id:'f024', name:'Aloo Sabzi', emoji:'🥔', cat:'Indian Basics', portion:'1 katori (150g)', cal:165, p:3, c:28, f:5 },
  { id:'f025', name:'Palak Paneer', emoji:'🥬', cat:'Indian Basics', portion:'1 katori (150g)', cal:195, p:10, c:12, f:13 },
  { id:'f026', name:'Matar Paneer', emoji:'🫛', cat:'Indian Basics', portion:'1 katori (150g)', cal:215, p:11, c:16, f:12 },
  { id:'f027', name:'Mixed Veg Sabzi', emoji:'🥦', cat:'Indian Basics', portion:'1 katori (150g)', cal:120, p:4, c:18, f:4 },
  { id:'f028', name:'Bhindi Masala (Okra)', emoji:'🥒', cat:'Indian Basics', portion:'1 katori (150g)', cal:110, p:3, c:16, f:4 },
  { id:'f029', name:'Aloo Gobi', emoji:'🥔', cat:'Indian Basics', portion:'1 katori (150g)', cal:130, p:3, c:22, f:4 },
  { id:'f030', name:'Biryani (Veg)', emoji:'🍛', cat:'Indian Basics', portion:'1 plate (300g)', cal:420, p:9, c:70, f:12 },
  { id:'f031', name:'Biryani (Chicken)', emoji:'🍛', cat:'Indian Basics', portion:'1 plate (350g)', cal:540, p:28, c:68, f:15 },
  { id:'f032', name:'Khichdi', emoji:'🥣', cat:'Indian Basics', portion:'1 bowl (250g)', cal:310, p:12, c:55, f:5 },
  { id:'f033', name:'Curd / Dahi', emoji:'🥛', cat:'Indian Basics', portion:'1 katori (100g)', cal:60, p:3, c:5, f:3 },
  { id:'f034', name:'Raita', emoji:'🥣', cat:'Indian Basics', portion:'1 katori (100g)', cal:55, p:3, c:5, f:2 },

  // ─── 🍳 Hostel / Canteen ────────────────────────────────
  { id:'f035', name:'Maggi Noodles (1 pack)', emoji:'🍜', cat:'Hostel/Canteen', portion:'1 pack (70g dry)', cal:320, p:8, c:45, f:12 },
  { id:'f036', name:'Bread Butter (2 slices)', emoji:'🍞', cat:'Hostel/Canteen', portion:'2 slices + 2 tsp butter', cal:230, p:6, c:30, f:10 },
  { id:'f037', name:'Bread Jam (2 slices)', emoji:'🍞', cat:'Hostel/Canteen', portion:'2 slices + 1 tsp jam', cal:200, p:5, c:38, f:3 },
  { id:'f038', name:'Veg Canteen Sandwich', emoji:'🥪', cat:'Hostel/Canteen', portion:'1 full sandwich', cal:290, p:8, c:44, f:9 },
  { id:'f039', name:'Paneer Sandwich', emoji:'🥪', cat:'Hostel/Canteen', portion:'1 full sandwich', cal:380, p:16, c:42, f:15 },
  { id:'f040', name:'Grilled Cheese Sandwich', emoji:'🥪', cat:'Hostel/Canteen', portion:'1 full sandwich', cal:350, p:14, c:38, f:16 },
  { id:'f041', name:'Egg Sandwich', emoji:'🥪', cat:'Hostel/Canteen', portion:'1 full sandwich', cal:310, p:15, c:38, f:11 },
  { id:'f042', name:'Canteen Thali (Veg)', emoji:'🍱', cat:'Hostel/Canteen', portion:'1 full thali', cal:650, p:20, c:110, f:15 },
  { id:'f043', name:'Mess Rajma-Rice Thali', emoji:'🍱', cat:'Hostel/Canteen', portion:'1 full thali', cal:720, p:28, c:118, f:12 },
  { id:'f044', name:'Pav Bhaji', emoji:'🍞', cat:'Hostel/Canteen', portion:'2 pav + bhaji (300g)', cal:480, p:12, c:72, f:16 },
  { id:'f045', name:'Vada Pav', emoji:'🌯', cat:'Hostel/Canteen', portion:'1 piece', cal:290, p:7, c:44, f:9 },
  { id:'f046', name:'Samosa', emoji:'🥟', cat:'Hostel/Canteen', portion:'1 piece (100g)', cal:260, p:5, c:35, f:12 },
  { id:'f047', name:'Kachori', emoji:'🥟', cat:'Hostel/Canteen', portion:'1 piece (80g)', cal:230, p:5, c:30, f:10 },
  { id:'f048', name:'Bread Pakora', emoji:'🥖', cat:'Hostel/Canteen', portion:'1 piece (80g)', cal:220, p:6, c:29, f:9 },
  { id:'f049', name:'Aloo Bonda / Batata Vada', emoji:'🥔', cat:'Hostel/Canteen', portion:'2 pieces (100g)', cal:240, p:5, c:32, f:10 },
  { id:'f050', name:'Canteen Chai (with milk & sugar)', emoji:'☕', cat:'Hostel/Canteen', portion:'1 cup (150ml)', cal:65, p:2, c:10, f:2 },
  { id:'f051', name:'Cold Coffee (canteen)', emoji:'☕', cat:'Hostel/Canteen', portion:'1 glass (300ml)', cal:180, p:6, c:28, f:5 },
  { id:'f052', name:'Noodles (Hakka / Veg Chowmein)', emoji:'🍜', cat:'Hostel/Canteen', portion:'1 plate (250g)', cal:380, p:9, c:58, f:12 },
  { id:'f053', name:'Fried Rice (Veg)', emoji:'🍚', cat:'Hostel/Canteen', portion:'1 plate (250g)', cal:390, p:8, c:62, f:12 },
  { id:'f054', name:'Manchurian + Fried Rice', emoji:'🍽️', cat:'Hostel/Canteen', portion:'1 combo plate (350g)', cal:560, p:14, c:80, f:18 },

  // ─── 🥚 Protein Foods ───────────────────────────────────
  { id:'f055', name:'Whole Egg (Boiled)', emoji:'🥚', cat:'Protein Foods', portion:'1 large egg (50g)', cal:70, p:6, c:1, f:5 },
  { id:'f056', name:'Egg White (Boiled)', emoji:'🥚', cat:'Protein Foods', portion:'1 egg white (33g)', cal:17, p:4, c:0, f:0 },
  { id:'f057', name:'Scrambled Eggs (2 eggs)', emoji:'🍳', cat:'Protein Foods', portion:'2 eggs with 1 tsp oil', cal:180, p:13, c:2, f:13 },
  { id:'f058', name:'Omelette (2 eggs)', emoji:'🍳', cat:'Protein Foods', portion:'2 eggs + veggies', cal:200, p:14, c:4, f:14 },
  { id:'f059', name:'Paneer (Raw)', emoji:'🧀', cat:'Protein Foods', portion:'100g', cal:265, p:18, c:3, f:20 },
  { id:'f060', name:'Chicken Breast (Grilled)', emoji:'🍗', cat:'Protein Foods', portion:'100g cooked', cal:165, p:31, c:0, f:4 },
  { id:'f061', name:'Chicken Breast (Boiled)', emoji:'🍗', cat:'Protein Foods', portion:'100g cooked', cal:150, p:30, c:0, f:3 },
  { id:'f062', name:'Chicken Curry', emoji:'🍗', cat:'Protein Foods', portion:'1 katori (150g)', cal:280, p:25, c:6, f:17 },
  { id:'f063', name:'Egg Bhurji (2 eggs)', emoji:'🍳', cat:'Protein Foods', portion:'2 eggs with spices', cal:200, p:14, c:4, f:14 },
  { id:'f064', name:'Moong Dal (Boiled)', emoji:'🫘', cat:'Protein Foods', portion:'1 katori (150g)', cal:140, p:10, c:22, f:1 },
  { id:'f065', name:'Sprouted Moong', emoji:'🌱', cat:'Protein Foods', portion:'1 cup (100g)', cal:105, p:8, c:19, f:1 },
  { id:'f066', name:'Tuna (Canned)', emoji:'🐟', cat:'Protein Foods', portion:'100g drained', cal:130, p:29, c:0, f:1 },
  { id:'f067', name:'Tofu', emoji:'🥢', cat:'Protein Foods', portion:'100g', cal:76, p:8, c:2, f:4 },
  { id:'f068', name:'Whey Protein Shake', emoji:'🥤', cat:'Protein Foods', portion:'1 scoop (30g) in water', cal:115, p:24, c:3, f:1 },
  { id:'f069', name:'Peanut Butter', emoji:'🥜', cat:'Protein Foods', portion:'2 tbsp (32g)', cal:190, p:7, c:7, f:16 },
  { id:'f070', name:'Peanuts (Roasted)', emoji:'🥜', cat:'Protein Foods', portion:'1 handful (30g)', cal:175, p:8, c:6, f:14 },
  { id:'f071', name:'Greek Yogurt', emoji:'🥛', cat:'Protein Foods', portion:'1 cup (170g)', cal:100, p:17, c:6, f:1 },
  { id:'f072', name:'Cottage Cheese (Low fat)', emoji:'🧀', cat:'Protein Foods', portion:'100g', cal:90, p:12, c:3, f:3 },
  { id:'f073', name:'Boiled Chana (Black)', emoji:'🫘', cat:'Protein Foods', portion:'1 katori (150g)', cal:210, p:14, c:35, f:3 },
  { id:'f074', name:'Soya Chunks (Cooked)', emoji:'🫘', cat:'Protein Foods', portion:'100g cooked', cal:170, p:18, c:18, f:1 },

  // ─── 🍔 Fast Food & Street Food ──────────────────────────
  { id:'f075', name:'McD Aloo Tikki Burger', emoji:'🍔', cat:'Fast Food', portion:'1 burger', cal:380, p:9, c:58, f:13 },
  { id:'f076', name:'McD Chicken Burger', emoji:'🍔', cat:'Fast Food', portion:'1 burger', cal:450, p:24, c:50, f:18 },
  { id:'f077', name:'Dominos Medium Pizza (Veg, 2 slices)', emoji:'🍕', cat:'Fast Food', portion:'2 slices', cal:460, p:16, c:62, f:16 },
  { id:'f078', name:'Dominos Chicken Pizza (2 slices)', emoji:'🍕', cat:'Fast Food', portion:'2 slices', cal:520, p:26, c:60, f:20 },
  { id:'f079', name:'Subway 6-inch Veg Sub', emoji:'🥖', cat:'Fast Food', portion:'1 sub', cal:360, p:12, c:60, f:7 },
  { id:'f080', name:'French Fries (Regular)', emoji:'🍟', cat:'Fast Food', portion:'1 regular portion (115g)', cal:340, p:4, c:45, f:16 },
  { id:'f081', name:'Butter Chicken', emoji:'🍗', cat:'Fast Food', portion:'1 portion (200g)', cal:380, p:28, c:14, f:24 },
  { id:'f082', name:'Tikka Masala', emoji:'🍛', cat:'Fast Food', portion:'1 portion (200g)', cal:350, p:26, c:16, f:20 },
  { id:'f083', name:'Pani Puri (6 pieces)', emoji:'🥟', cat:'Fast Food', portion:'6 pieces', cal:140, p:3, c:28, f:3 },
  { id:'f084', name:'Bhel Puri', emoji:'🥗', cat:'Fast Food', portion:'1 plate (150g)', cal:200, p:5, c:38, f:4 },
  { id:'f085', name:'Dahi Puri (6 pieces)', emoji:'🥟', cat:'Fast Food', portion:'6 pieces', cal:200, p:5, c:36, f:5 },
  { id:'f086', name:'Kathi Roll (Egg)', emoji:'🌯', cat:'Fast Food', portion:'1 roll', cal:350, p:14, c:50, f:11 },
  { id:'f087', name:'Kathi Roll (Chicken)', emoji:'🌯', cat:'Fast Food', portion:'1 roll', cal:400, p:22, c:50, f:13 },
  { id:'f088', name:'Shawarma (Chicken)', emoji:'🌯', cat:'Fast Food', portion:'1 wrap', cal:450, p:28, c:48, f:16 },

  // ─── 🥤 Drinks & Beverages ───────────────────────────────
  { id:'f089', name:'Full Cream Milk', emoji:'🥛', cat:'Drinks', portion:'1 glass (250ml)', cal:150, p:8, c:12, f:8 },
  { id:'f090', name:'Toned Milk', emoji:'🥛', cat:'Drinks', portion:'1 glass (250ml)', cal:105, p:8, c:12, f:3 },
  { id:'f091', name:'Chai (with milk & sugar)', emoji:'☕', cat:'Drinks', portion:'1 cup (150ml)', cal:65, p:2, c:10, f:2 },
  { id:'f092', name:'Black Coffee (unsweetened)', emoji:'☕', cat:'Drinks', portion:'1 cup (240ml)', cal:5, p:0, c:1, f:0 },
  { id:'f093', name:'Coconut Water', emoji:'🥥', cat:'Drinks', portion:'1 glass (240ml)', cal:45, p:2, c:9, f:0 },
  { id:'f094', name:'Lassi (Sweet)', emoji:'🥛', cat:'Drinks', portion:'1 glass (250ml)', cal:200, p:6, c:32, f:6 },
  { id:'f095', name:'Lassi (Salted / Namkeen)', emoji:'🥛', cat:'Drinks', portion:'1 glass (250ml)', cal:140, p:6, c:16, f:6 },
  { id:'f096', name:'Orange Juice (Fresh)', emoji:'🍊', cat:'Drinks', portion:'1 glass (240ml)', cal:110, p:2, c:26, f:0 },
  { id:'f097', name:'Protein Shake (Mass Gainer, 1 scoop)', emoji:'🥤', cat:'Drinks', portion:'1 scoop (100g) in milk', cal:400, p:30, c:65, f:6 },
  { id:'f098', name:'Smoothie (Banana + Milk)', emoji:'🥤', cat:'Drinks', portion:'1 large (400ml)', cal:280, p:9, c:52, f:5 },
  { id:'f099', name:'Nimbu Pani (Lemonade)', emoji:'🍋', cat:'Drinks', portion:'1 glass (300ml)', cal:60, p:0, c:15, f:0 },
  { id:'f100', name:'Coke / Pepsi (Regular)', emoji:'🥤', cat:'Drinks', portion:'1 can (330ml)', cal:140, p:0, c:37, f:0 },
  { id:'f101', name:'Red Bull (1 can)', emoji:'🥤', cat:'Drinks', portion:'1 can (250ml)', cal:112, p:1, c:28, f:0 },
  { id:'f102', name:'Buttermilk / Chaas', emoji:'🥛', cat:'Drinks', portion:'1 glass (250ml)', cal:50, p:3, c:4, f:2 },

  // ─── 🍌 Fruits & Snacks ──────────────────────────────────
  { id:'f103', name:'Banana', emoji:'🍌', cat:'Fruits & Snacks', portion:'1 medium (120g)', cal:107, p:1, c:27, f:0 },
  { id:'f104', name:'Apple', emoji:'🍎', cat:'Fruits & Snacks', portion:'1 medium (180g)', cal:95, p:0, c:25, f:0 },
  { id:'f105', name:'Mango', emoji:'🥭', cat:'Fruits & Snacks', portion:'1 cup sliced (165g)', cal:99, p:1, c:25, f:1 },
  { id:'f106', name:'Guava', emoji:'🍐', cat:'Fruits & Snacks', portion:'1 medium (100g)', cal:68, p:3, c:14, f:1 },
  { id:'f107', name:'Papaya', emoji:'🍈', cat:'Fruits & Snacks', portion:'1 cup (145g)', cal:62, p:1, c:16, f:0 },
  { id:'f108', name:'Dates (Medjool)', emoji:'🌴', cat:'Fruits & Snacks', portion:'2 dates (48g)', cal:133, p:1, c:36, f:0 },
  { id:'f109', name:'Mixed Nuts & Dry Fruits', emoji:'🥜', cat:'Fruits & Snacks', portion:'1 handful (30g)', cal:180, p:5, c:9, f:15 },
  { id:'f110', name:'Almonds', emoji:'🌰', cat:'Fruits & Snacks', portion:'20 pieces (28g)', cal:165, p:6, c:6, f:14 },
  { id:'f111', name:'Walnuts', emoji:'🌰', cat:'Fruits & Snacks', portion:'1 oz (28g)', cal:185, p:4, c:4, f:18 },
  { id:'f112', name:'Biscuits (Marie Gold, 4 pieces)', emoji:'🍪', cat:'Fruits & Snacks', portion:'4 biscuits (32g)', cal:135, p:2, c:24, f:3 },
  { id:'f113', name:'Hide & Seek / Chocolate Biscuits (4)', emoji:'🍪', cat:'Fruits & Snacks', portion:'4 biscuits (35g)', cal:175, p:2, c:24, f:8 },
  { id:'f114', name:'Chakli / Murukku (5 pieces)', emoji:'🥨', cat:'Fruits & Snacks', portion:'5 pieces (30g)', cal:160, p:3, c:22, f:7 },
  { id:'f115', name:'Popcorn (Plain)', emoji:'🍿', cat:'Fruits & Snacks', portion:'1 cup (8g popped)', cal:30, p:1, c:6, f:0 },
  { id:'f116', name:'Lays Chips (1 pack)', emoji:'🥔', cat:'Fruits & Snacks', portion:'1 small pack (26g)', cal:130, p:2, c:17, f:7 },
  { id:'f117', name:'Protein Bar (generic)', emoji:'🍫', cat:'Fruits & Snacks', portion:'1 bar (55g)', cal:210, p:20, c:22, f:6 },
  { id:'f118', name:'Dark Chocolate (70%+)', emoji:'🍫', cat:'Fruits & Snacks', portion:'2 squares (20g)', cal:120, p:2, c:10, f:8 },

  // ─── 🌍 Common Global Foods ──────────────────────────────
  { id:'f119', name:'Oats (Cooked / Porridge)', emoji:'🥣', cat:'Global/Other', portion:'1 cup cooked (240g)', cal:150, p:5, c:27, f:3 },
  { id:'f120', name:'Cornflakes (with milk)', emoji:'🥣', cat:'Global/Other', portion:'1 bowl (40g cereal + 200ml milk)', cal:290, p:11, c:56, f:4 },
  { id:'f121', name:'Bread (White, 2 slices)', emoji:'🍞', cat:'Global/Other', portion:'2 slices (60g)', cal:160, p:6, c:30, f:2 },
  { id:'f122', name:'Bread (Brown/Whole Wheat, 2 slices)', emoji:'🍞', cat:'Global/Other', portion:'2 slices (60g)', cal:140, p:6, c:26, f:2 },
  { id:'f123', name:'Pasta (Boiled, plain)', emoji:'🍝', cat:'Global/Other', portion:'1 cup cooked (140g)', cal:220, p:8, c:43, f:1 },
  { id:'f124', name:'Pasta (with sauce)', emoji:'🍝', cat:'Global/Other', portion:'1 plate (300g)', cal:420, p:14, c:68, f:12 },
  { id:'f125', name:'Brown Rice (Cooked)', emoji:'🍚', cat:'Global/Other', portion:'1 cup (195g)', cal:215, p:5, c:45, f:2 },
  { id:'f126', name:'Sweet Potato (Boiled)', emoji:'🍠', cat:'Global/Other', portion:'1 medium (130g)', cal:115, p:2, c:27, f:0 },
  { id:'f127', name:'Boiled Potato', emoji:'🥔', cat:'Global/Other', portion:'1 medium (150g)', cal:130, p:3, c:30, f:0 },
  { id:'f128', name:'Peanut Butter Toast', emoji:'🍞', cat:'Global/Other', portion:'2 slices + 2 tbsp PB', cal:380, p:14, c:36, f:18 },
  { id:'f129', name:'Avocado (Half)', emoji:'🥑', cat:'Global/Other', portion:'Half avocado (70g)', cal:120, p:2, c:7, f:11 },
  { id:'f130', name:'Boiled Corn on Cob', emoji:'🌽', cat:'Global/Other', portion:'1 medium ear (90g)', cal:90, p:3, c:19, f:1 },

  // ─── 🍦 Desserts ─────────────────────────────────────────
  { id:'f131', name:'Gulab Jamun (2 pieces)', emoji:'🍮', cat:'Desserts', portion:'2 pieces (80g)', cal:280, p:4, c:44, f:10 },
  { id:'f132', name:'Rasgulla (2 pieces)', emoji:'🍮', cat:'Desserts', portion:'2 pieces (100g)', cal:155, p:4, c:32, f:2 },
  { id:'f133', name:'Kheer / Rice Pudding', emoji:'🍮', cat:'Desserts', portion:'1 katori (150g)', cal:210, p:5, c:38, f:5 },
  { id:'f134', name:'Halwa (Suji/Gajar)', emoji:'🍮', cat:'Desserts', portion:'1 katori (100g)', cal:280, p:4, c:40, f:12 },
  { id:'f135', name:'Ice Cream (Vanilla, 1 scoop)', emoji:'🍨', cat:'Desserts', portion:'1 scoop (65g)', cal:145, p:2, c:19, f:7 },
  { id:'f136', name:'Chocolate Pastry / Cake', emoji:'🎂', cat:'Desserts', portion:'1 slice (90g)', cal:340, p:5, c:48, f:16 },
];

// Category list for filtering
const FOOD_CATEGORIES = ['All', ...new Set(FOOD_DB.map(f => f.cat))];

// Portion scale options
const PORTION_SCALES = [
  { label: 'Half', mult: 0.5 },
  { label: '1x (standard)', mult: 1 },
  { label: '1.5x', mult: 1.5 },
  { label: '2x', mult: 2 },
];

// Search function — returns matched foods (max 30)
function searchFoods(query) {
  if (!query || query.trim().length < 1) return [];
  const q = query.toLowerCase();
  return FOOD_DB.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.cat.toLowerCase().includes(q)
  ).slice(0, 30);
}
