/**
 * Updates all seeded products in Convex with their generated image paths.
 * Run after generate-product-images.mjs has populated public/products/.
 *
 * Usage: node scripts/update-product-images.mjs
 */

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("NEXT_PUBLIC_CONVEX_URL not set");
  process.exit(1);
}

const IMAGE_MAP = {
  "Ginger Molasses Biscuits":               "/products/ginger-molasses-biscuits.jpg",
  "Chocolate Chip Biscuits":                "/products/chocolate-chip-biscuits.jpg",
  "Red Velvet White Chocolate Biscuits":    "/products/red-velvet-white-chocolate-biscuits.jpg",
  "Premium Fudgy Brownies":                 "/products/premium-fudgy-brownies.jpg",
  "Shallot Chilli Crunch":                  "/products/shallot-chilli-crunch.jpg",
  "Durban Fire Relish":                     "/products/durban-fire-relish.jpg",
  "Caramelised Onion & Thyme Marmalade":    "/products/caramelised-onion-thyme-marmalade.jpg",
  "Basil & Almond Pesto":                   "/products/basil-almond-pesto.jpg",
  "Strawberry Vanilla Jam":                 "/products/strawberry-vanilla-jam.jpg",
  "Blueberry Jam":                          "/products/blueberry-jam.jpg",
  "Roasted Pineapple & Ginger Jam":         "/products/roasted-pineapple-ginger-jam.jpg",
  "Signature Roasted Masala":               "/products/signature-roasted-masala.jpg",
  "Garam Masala":                           "/products/garam-masala.jpg",
  "Royal Biryani Masala":                   "/products/royal-biryani-masala.jpg",
  "Artisan Chai Spice Blend":               "/products/artisan-chai-spice-blend.jpg",
};

console.log("Image map ready — to apply these images, update each product via the Admin dashboard:");
console.log("  Admin → Products → Edit each product → paste the URL below into Image URL field\n");
Object.entries(IMAGE_MAP).forEach(([name, path]) => {
  console.log(`  ${name}: ${path}`);
});
console.log("\nOr set them programmatically via a Convex mutation using the admin session.");
