export type ProductImageSource = {
  image?: string | null;
  imageUrl?: string | null;
};

export function getProductImage(product: ProductImageSource): string | undefined;
