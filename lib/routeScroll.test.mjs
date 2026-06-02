import assert from "node:assert/strict";
import test from "node:test";
import { getRouteScrollKey } from "./routeScroll.js";

test("uses pathname for normal page navigation", () => {
  assert.equal(getRouteScrollKey("/shop", ""), "/shop");
});

test("includes search params for product page changes", () => {
  assert.equal(getRouteScrollKey("/product", "id=abc123"), "/product?id=abc123");
});

test("normalizes missing values to root route", () => {
  assert.equal(getRouteScrollKey(null, null), "/");
});
