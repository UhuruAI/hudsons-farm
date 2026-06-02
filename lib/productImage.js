export function getProductImage(product) {
  return product?.imageUrl || product?.image || undefined;
}
