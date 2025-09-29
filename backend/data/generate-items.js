import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing items
const existingItems = JSON.parse(fs.readFileSync('./items.json', 'utf-8'));

const categories = ['grocery', 'household', 'stationery', 'electronics', 'clothing', 'beauty'];
const taxCategories = {
  grocery: 'reduced',
  household: 'standard',
  stationery: 'exempt',
  electronics: 'standard',
  clothing: 'standard',
  beauty: 'standard'
};

const itemTemplates = {
  grocery: [
    { name: 'Organic {fruit} ({weight})', desc: 'Fresh {adjective} {fruit} from local farms.', price: [1.99, 5.99] },
    { name: '{vegetable} ({weight})', desc: '{adjective} {vegetable}, perfect for cooking.', price: [1.49, 4.99] },
    { name: '{grain} Bread (loaf)', desc: 'Freshly baked {adjective} bread.', price: [2.49, 4.99] },
    { name: '{dairy} 1L', desc: '{adjective} dairy product.', price: [1.99, 5.49] },
    { name: '{snack} ({weight})', desc: '{adjective} snack for any occasion.', price: [2.99, 7.99] },
    { name: '{beverage} 1L', desc: '{adjective} refreshing drink.', price: [1.99, 4.99] },
    { name: 'Organic {meat} ({weight})', desc: 'Premium quality {adjective} {meat}.', price: [5.99, 15.99] },
    { name: '{frozen} (frozen, {weight})', desc: 'Convenient frozen {frozen}.', price: [3.99, 9.99] }
  ],
  household: [
    { name: '{cleaner} – {variant} {size}', desc: '{adjective} cleaning solution.', price: [2.49, 8.99] },
    { name: '{tool} – {variant}', desc: '{adjective} household tool.', price: [5.99, 49.99] },
    { name: '{storage} Container Set', desc: '{adjective} storage solution.', price: [9.99, 29.99] },
    { name: '{textile} – {count} pack', desc: '{adjective} household textiles.', price: [4.99, 19.99] },
    { name: '{appliance} – {variant}', desc: '{adjective} home appliance.', price: [19.99, 199.99] }
  ],
  stationery: [
    { name: '{writing} – {variant} ({count})', desc: '{adjective} writing instrument.', price: [0.99, 9.99] },
    { name: '{paper} – {size} ({count} {unit})', desc: '{adjective} paper product.', price: [2.99, 12.99] },
    { name: '{organizer} – {variant}', desc: '{adjective} desk organizer.', price: [3.99, 19.99] },
    { name: '{art} – {count} pack', desc: '{adjective} art supplies.', price: [4.99, 29.99] }
  ],
  electronics: [
    { name: '{device} – {variant}', desc: '{adjective} electronic device.', price: [9.99, 199.99] },
    { name: '{accessory} – {variant}', desc: '{adjective} electronic accessory.', price: [5.99, 49.99] },
    { name: '{cable} Cable {length}', desc: '{adjective} connectivity cable.', price: [4.99, 19.99] },
    { name: '{audio} – {variant}', desc: '{adjective} audio device.', price: [19.99, 149.99] }
  ],
  clothing: [
    { name: '{garment} – {color} ({size})', desc: '{adjective} {garment}.', price: [9.99, 79.99] },
    { name: '{footwear} – {color} ({size})', desc: '{adjective} footwear.', price: [19.99, 89.99] },
    { name: '{accessory} – {variant}', desc: '{adjective} clothing accessory.', price: [4.99, 39.99] },
    { name: '{outerwear} – {color} ({size})', desc: '{adjective} outerwear.', price: [39.99, 149.99] }
  ],
  beauty: [
    { name: '{skincare} – {variant} {size}', desc: '{adjective} skincare product.', price: [3.99, 24.99] },
    { name: '{haircare} – {variant} {size}', desc: '{adjective} hair care product.', price: [4.99, 19.99] },
    { name: '{makeup} – {variant}', desc: '{adjective} makeup product.', price: [5.99, 29.99] },
    { name: '{fragrance} – {variant} {size}', desc: '{adjective} fragrance.', price: [14.99, 79.99] }
  ]
};

const replacements = {
  fruit: ['Apples', 'Oranges', 'Pears', 'Peaches', 'Plums', 'Cherries', 'Blueberries', 'Raspberries', 'Blackberries', 'Mangoes', 'Pineapples', 'Kiwis', 'Avocados', 'Lemons', 'Limes'],
  vegetable: ['Broccoli', 'Cauliflower', 'Spinach', 'Kale', 'Peppers', 'Zucchini', 'Eggplant', 'Onions', 'Garlic', 'Mushrooms', 'Asparagus', 'Brussels Sprouts', 'Cabbage', 'Celery', 'Radishes'],
  grain: ['Whole Wheat', 'Rye', 'Sourdough', 'Multigrain', 'Oat', 'Spelt', 'Gluten-Free', 'Seed', 'Artisan'],
  dairy: ['Milk', 'Yogurt Drink', 'Kefir', 'Oat Milk', 'Soy Milk', 'Coconut Milk', 'Rice Milk'],
  snack: ['Granola Bars', 'Trail Mix', 'Protein Bars', 'Rice Cakes', 'Crackers', 'Pretzels', 'Popcorn', 'Nuts Mix', 'Dried Fruit'],
  beverage: ['Apple Juice', 'Cranberry Juice', 'Grape Juice', 'Iced Tea', 'Lemonade', 'Sparkling Water', 'Coconut Water'],
  meat: ['Chicken Breast', 'Ground Beef', 'Pork Chops', 'Salmon Fillet', 'Turkey Breast', 'Lamb Chops'],
  frozen: ['Vegetables', 'Berries', 'Pizza', 'Chicken Nuggets', 'Fish Sticks', 'French Fries', 'Ice Cream'],
  cleaner: ['All-Purpose Cleaner', 'Bathroom Cleaner', 'Floor Cleaner', 'Window Cleaner', 'Furniture Polish', 'Disinfectant Spray'],
  tool: ['Screwdriver Set', 'Hammer', 'Pliers', 'Utility Knife', 'Tape Measure', 'Flashlight', 'Scissors', 'Can Opener'],
  storage: ['Plastic', 'Glass', 'Stackable', 'Airtight', 'Modular'],
  textile: ['Dish Cloths', 'Hand Towels', 'Bath Towels', 'Bed Sheets', 'Pillow Cases', 'Tablecloth'],
  appliance: ['Coffee Maker', 'Toaster', 'Kettle', 'Blender', 'Iron', 'Hair Dryer', 'Fan', 'Heater'],
  writing: ['Pens', 'Pencils', 'Markers', 'Highlighters', 'Crayons', 'Chalk'],
  paper: ['Notebook', 'Binder', 'File Folders', 'Index Cards', 'Envelopes', 'Printer Paper'],
  organizer: ['Pencil Case', 'Desk Tray', 'Magazine Holder', 'File Box', 'Drawer Divider'],
  art: ['Watercolors', 'Acrylic Paints', 'Paint Brushes', 'Canvas Boards', 'Charcoal Sticks', 'Oil Pastels'],
  device: ['Wireless Keyboard', 'Gaming Mouse', 'Tablet', 'E-Reader', 'Digital Camera', 'Webcam', 'USB Hub'],
  accessory: ['Phone Stand', 'Laptop Sleeve', 'Screen Protector', 'Cable Organizer', 'Cooling Pad', 'Mouse Pad'],
  cable: ['HDMI', 'USB-C', 'Lightning', 'Ethernet', 'Audio Jack', 'DisplayPort'],
  audio: ['Earbuds', 'Speakers', 'Microphone', 'Sound Bar', 'Headset'],
  garment: ['T-Shirt', 'Polo Shirt', 'Dress Shirt', 'Blouse', 'Cardigan', 'Hoodie', 'Tank Top'],
  footwear: ['Boots', 'Sandals', 'Loafers', 'Slippers', 'Running Shoes', 'Dress Shoes'],
  outerwear: ['Raincoat', 'Blazer', 'Vest', 'Parka', 'Windbreaker', 'Trench Coat'],
  skincare: ['Face Cream', 'Serum', 'Toner', 'Cleanser', 'Sunscreen', 'Eye Cream', 'Night Cream'],
  haircare: ['Shampoo', 'Conditioner', 'Hair Mask', 'Hair Oil', 'Styling Gel', 'Hair Spray'],
  makeup: ['Lipstick', 'Foundation', 'Mascara', 'Eyeliner', 'Blush', 'Eyeshadow Palette', 'Concealer'],
  fragrance: ['Perfume', 'Cologne', 'Body Spray', 'Reed Diffuser'],
  adjective: ['Premium', 'Eco-friendly', 'Professional', 'Durable', 'Ergonomic', 'Compact', 'Luxurious', 'Organic', 'Natural', 'Modern', 'Classic', 'Versatile', 'High-quality', 'Gentle', 'Powerful'],
  variant: ['Black', 'White', 'Blue', 'Red', 'Green', 'Silver', 'Gold', 'Navy', 'Grey', 'Brown', 'Purple', 'Pink', 'Orange', 'Beige', 'Charcoal'],
  color: ['Black', 'White', 'Blue', 'Red', 'Green', 'Navy', 'Grey', 'Brown', 'Purple', 'Pink', 'Orange', 'Beige', 'Burgundy', 'Khaki', 'Olive'],
  size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38 EU', '40 EU', '42 EU', '44 EU'],
  weight: ['250g', '500g', '1kg', '2kg', '300g', '750g', '1.5kg'],
  count: ['2', '3', '4', '5', '6', '8', '10', '12', '20', '24', '30', '50'],
  unit: ['pages', 'sheets', 'pieces', 'items'],
  length: ['0.5m', '1m', '1.5m', '2m', '3m']
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(range) {
  const min = range[0];
  const max = range[1];
  return +(min + Math.random() * (max - min)).toFixed(2);
}

function getRandomSold() {
  return Math.floor(Math.random() * 700) + 50;
}

function getRandomInStock() {
  return Math.random() > 0.15; // 85% in stock
}

function getRandomDate() {
  const start = new Date('2025-01-14T06:00:00.000Z');
  const end = new Date('2025-03-20T18:00:00.000Z');
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

function fillTemplate(template, category) {
  let result = template;
  const placeholders = result.match(/\{(\w+)\}/g);
  
  if (placeholders) {
    placeholders.forEach(placeholder => {
      const key = placeholder.slice(1, -1);
      if (replacements[key]) {
        const value = getRandom(replacements[key]);
        result = result.replace(placeholder, value);
      }
    });
  }
  
  return result;
}

function generateItem(id, category) {
  const templates = itemTemplates[category];
  const template = getRandom(templates);
  
  const name = fillTemplate(template.name, category);
  const description = fillTemplate(template.desc, category);
  const price = getRandomPrice(template.price);
  const sold = getRandomSold();
  const inStock = getRandomInStock();
  const createdAt = getRandomDate();
  const taxCategory = taxCategories[category];
  
  return {
    id,
    name,
    description,
    category,
    taxCategory,
    price,
    sold,
    inStock,
    createdAt
  };
}

// Generate items to reach ~1000 total
const targetCount = 1000;
const itemsToGenerate = targetCount - existingItems.length;
const allItems = [...existingItems];
let currentId = existingItems.length + 1;

console.log(`Generating ${itemsToGenerate} items...`);

for (let i = 0; i < itemsToGenerate; i++) {
  const category = getRandom(categories);
  const item = generateItem(currentId, category);
  allItems.push(item);
  currentId++;
  
  if ((i + 1) % 100 === 0) {
    console.log(`Generated ${i + 1}/${itemsToGenerate} items...`);
  }
}

// Write to file
const outputPath = path.join(__dirname, 'items.json');
fs.writeFileSync(outputPath, JSON.stringify(allItems, null, 2));

console.log(`\nDone! Generated ${allItems.length} total items in items.json`);
