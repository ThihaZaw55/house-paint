import ProductCard from "../components/ProductCart";
import room2 from "../assets/room2.jpg";
import room3 from "../assets/room3.jpg";
import room4 from "../assets/room4.jpg";
import room5 from "../assets/room5.jpg";
const products = [
  {
    id: 1,
    name: "Premium Wall Paint",
    price: 3500,
    colour: "Orange",
    sale: true,
    image: room4,
  },
  {
    id: 2,
    name: "Interior White Paint",
    price: 2800,
    colour: "milk white",
    image: room2,
  },
  {
    id: 3,
    name: "Exterior Weather Paint",
    price: 4500,
    colour: "green",
    sale: true,
    image: room3,
  },
  {
    id: 4,
    name: "Premium Wall Paint",
    price: 3500,
    colour: "white",
    sale: true,
    image: room4,
  },
  {
    id: 2,
    name: "Interior White Paint",
    price: 2800,
    colour: "light gray",
    image: room5,
  },
  {
    id: 3,
    name: "Exterior Weather Paint",
    price: 4500,
    colour: "milk white",
    sale: true,
    image: room2,
  },
];

export default function ProductList() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold text-center mb-10">Paint Products</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
