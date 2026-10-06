import ProductCard from "../components/ui/ProductCart";
import PageTitle from "../components/ui/PageTitle";
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { ProductService } from "@/services/product.service";
import type { ApiResponse } from "@/services/apiResponse";
import type { Product } from "@/types/product";

type ProductListItem = Product & {
  itemName?: string;
  unitName?: string;
  color?: string;
  colour?: string;
  image?: string;
  sale?: boolean;
  productName?: string;
  stockQuantity?: number | string;
  salePrice?: number | string;
};

const getApiErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<ApiResponse<unknown>>;

  return (
    axiosError.response?.data?.message ||
    axiosError.message ||
    "Unable to load products right now. Please try again later."
  );
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await ProductService.getAll();
        setProducts(response.data || []);
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const normalizedProducts = products.map((product) => {
    const productData = product as ProductListItem;
    const stockQuantity = Number(productData.stockQuantity ?? product.stockQuantity ?? 0);

    return {
      ...product,
      productId: product.productId,
      itemName: productData.itemName ?? productData.productName ?? `Paint Product ${product.productId}`,
      unitName: productData.unitName ?? "Unit",
      stockQuantity,
      color: productData.color ?? productData.colour ?? product.category ?? "Classic",
      colour: productData.colour ?? productData.color ?? product.category ?? "Classic",
      imagePath: product.imagePath ?? productData.image ?? "",
      image: product.imagePath ?? productData.image ?? "",
      description: product.description ?? "Premium finish for your space.",
      sale: Boolean(productData.sale ?? stockQuantity <= 0),
      salePrice: Number(product.salePrice ?? 0),
    };
  });

  const availableCount = normalizedProducts.filter((product) => Number(product.stockQuantity ?? 0) > 0).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <PageTitle title="Product List" />
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {availableCount} items available
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="h-40 rounded-2xl bg-slate-200" />
                <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-5 h-10 rounded-2xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
            <p className="text-lg font-semibold">Something went wrong</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : normalizedProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-700">No products found</p>
            <p className="mt-2 text-sm text-slate-500">Try refreshing the page or add a new product.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {normalizedProducts.map((product) => (
              <ProductCard key={product.productId} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
