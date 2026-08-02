import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
interface Props {
  id: number;
  name: string;
  price: number;
  image: string;
  colour: string;
  sale?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  colour,
  sale,
}: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const increase = () => setQty(qty + 1);
  const decrease = () => qty > 1 && setQty(qty - 1);

  const handleCart = () => {
    addToCart({ id, name, price, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="relative backdrop-blur-lg bg-white/40 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 p-4">
      {sale && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Out of Stock
        </span>
      )}
      <img
        src={image}
        alt={name}
        className="h-40 w-full object-cover rounded-xl"
      />
      <h2 className="mt-3 font-semibold text-lg">{name}</h2>
      <div className="flex mt-1 text-gray-500 text-sm">{colour}</div>
      <p className="text-blue-600 font-bold text-xl mt-2">{price} K</p>
      <div className="flex items-center justify-between gap-3 mt-3 rounded-2xl border border-gray-200 bg-slate-50 p-3 shadow-sm">
        <button
          onClick={decrease}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          -
        </button>

        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          className="w-16 rounded-lg border border-gray-200 bg-white p-2 text-center text-sm font-medium"
        />

        <button
          onClick={increase}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          +
        </button>
      </div>

      <button
        onClick={handleCart}
        className="flex items-center justify-center gap-2 mt-4 w-full rounded-2xl bg-linear-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] hover:from-blue-700 hover:to-sky-600 active:scale-95"
      >
        <ShoppingCart size={18} />
        Add to Cart
      </button>

      {added && (
        <div className="mt-3 rounded-full bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700 shadow-inner">
          Added {qty} item{qty > 1 ? "s" : ""} to cart!
        </div>
      )}
    </div>
  );
}
