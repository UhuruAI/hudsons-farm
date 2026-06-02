import assert from "node:assert/strict";
import test from "node:test";
import { getProductImage } from "./productImage.js";

test("uses resolved storage imageUrl before raw image field", () => {
  assert.equal(
    getProductImage({ image: undefined, imageUrl: "https://convex.cloud/storage/generated.png" }),
    "https://convex.cloud/storage/generated.png"
  );
});

test("falls back to raw image path for seeded products", () => {
  assert.equal(
    getProductImage({ image: "/products/seeded.jpg", imageUrl: null }),
    "/products/seeded.jpg"
  );
});

test("returns undefined when product has no image", () => {
  assert.equal(getProductImage({ image: undefined, imageUrl: null }), undefined);
});
