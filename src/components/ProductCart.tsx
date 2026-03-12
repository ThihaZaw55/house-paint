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
  const { addToCart } = useCart();

  const increase = () => setQty(qty + 1);
  const decrease = () => qty > 1 && setQty(qty - 1);

  const handleCart = () => {
    addToCart({ id, name, price, qty });
  };

  return (
    <div className="relative backdrop-blur-lg bg-white/40 border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 p-4">
      {sale && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
          SALE
        </span>
      )}
      <img
        src={image}
        alt={name}
        className="h-48 w-full object-cover rounded-xl"
      />
      <h2 className="mt-3 font-semibold text-lg">{name}</h2>
      <div className="flex mt-1 text-gray-500 text-sm">{colour}</div>
      <p className="text-blue-600 font-bold text-xl mt-2">{price} K</p>
      <div className="flex items-center mt-3 space-x-2">
        <button
          onClick={decrease}
          className="bg-gray-200 px-3 py-1 rounded cursor-pointer"
        >
          -
        </button>

        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-12 text-center border rounded"
        />

        <button
          onClick={increase}
          className="bg-gray-200 px-3 py-1 rounded cursor-pointer"
        >
          +
        </button>
      </div>

      <button
        onClick={handleCart}
        className="flex items-center justify-center gap-2 mt-4 w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer active:bg-blue-500 hover:bg-blue-700 transition"
      >
        <ShoppingCart size={18} />
        Add to Cart
      </button>
    </div>
  );
}
