import ProductCard from "../components/ProductCart";
import room5 from "../assets/room5.jpg";
const products = [
  {
    id: 1,
    name: "Premium Wall Paint",
    price: 3500,
    colour: "Orange",
    sale: true,
    image:
      "https://media.istockphoto.com/id/2192254113/photo/modern-beige-room-with-an-empty-wall-and-beige-sofa.jpg?s=1024x1024&w=is&k=20&c=i8DOEeKq533SzYDIV5o6Jv95ef9gadvKHkGpysl9egA=",
  },
  {
    id: 2,
    name: "Interior White Paint",
    price: 2800,
    colour: "milk white",
    image:
      "https://media.istockphoto.com/id/861306160/photo/3d-interior-rendering-living-space-and-wall-decoration.jpg?s=1024x1024&w=is&k=20&c=evSFj9d6yJFF1LSJtXZEeQgB7-uTjVYJR3wpNgIyRIY=",
  },
  {
    id: 3,
    name: "Exterior Weather Paint",
    price: 4500,
    colour: "green",
    sale: true,
    image:
      "https://media.istockphoto.com/id/1438032972/photo/yellow-armchair-on-empty-white-wall-background.jpg?s=1024x1024&w=is&k=20&c=Wcz9F6FRo0C-kcRSuniYkvlZ04N_bdhAplVq7QlJitU=",
  },
  {
    id: 4,
    name: "Premium Wall Paint",
    price: 3500,
    colour: "white",
    sale: true,
    image:
      "https://media.istockphoto.com/id/2193624020/photo/scandinavian-home-living-room-interior-with-sofa-and-decor-accessories-on-concrete-wall-3d.jpg?s=1024x1024&w=is&k=20&c=vTVP4wetdnv-vNiobhhyI34czTUHIU5vJ43EVI1RNiM=",
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
    image:
      "https://media.istockphoto.com/id/1324966036/photo/yellow-armchair-and-a-wooden-table-in-living-room-interior-with-plant-dark-blue-wall.jpg?s=1024x1024&w=is&k=20&c=nBmPot_DCkPFAHzdkxrNwcGR503i8rqmEQttRK1ECuQ=",
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
