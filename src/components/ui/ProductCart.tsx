import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  productId?: number;
  itemName?: string;
  productName?: string;
  unitName?: string;
  salePrice?: number | string;
  stockQuantity?: number | string;
  imagePath?: string;
  color?: string;
  colour?: string;
  category?: string;
  description?: string;
  sale?: boolean;
}

export default function ProductCard(props: ProductCardProps) {
  const productId = props.productId ?? props.productId ?? 0;
  const fallbackName = productId ? `Paint Product ${productId}` : "Paint Product";
  const name = props.itemName ?? props.productName ?? fallbackName;
  const unit = props.unitName ?? "Unit";
  const price = Number(props.salePrice ?? 0);
  const image = props.imagePath ?? "";
  const colour = props.color ?? props.colour ?? props.category ?? "Classic";
  const description = props.description ?? "Premium finish for your space.";
  const quantity = Number(props.stockQuantity ?? 0);
  const soldOut = Boolean(quantity <= 0);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
const BASE_URL = "http://localhost:8080";
  const increase = () => setQty((current) => current + 1);
  const decrease = () => setQty((current) => Math.max(1, current - 1));

  const handleCart = () => {
    addToCart({ id: productId, name, price, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="relative flex h-full flex-col rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {soldOut && (
        <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          Out of Stock
        </span>
      )}

      <div className="overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={`${BASE_URL}${image}`}
          alt={name}
          className="h-44 w-full object-cover"
        />
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{name}</h2>
            <p className="mt-1 text-sm text-slate-500">{unit}</p>
          </div>
          <span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-sky-700">
            {colour}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600">{description}</p>
        <p className="mt-3 text-2xl font-bold text-blue-600">{price.toLocaleString()} K</p>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <button
            type="button"
            onClick={decrease}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            -
          </button>

          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 rounded-lg border border-slate-200 bg-white p-2 text-center text-sm font-medium text-slate-700 outline-none ring-0"
          />

          <button
            type="button"
            onClick={increase}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleCart}
          disabled={soldOut}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingCart size={18} />
          {soldOut ? "Unavailable" : "Add to Cart"}
        </button>

        {added && (
          <div className="mt-3 rounded-full bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700 shadow-inner">
            Added {qty} item{qty > 1 ? "s" : ""} to cart!
          </div>
        )}
      </div>
    </div>
  );
}
