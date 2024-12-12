import { useParams } from "react-router-dom";

export default function Upg() {
  const { unilac } = useParams(); // Get dynamic route parameter
  const products = fetchProductsByCategory(unilac); // Fetch products based on the category

  return (
    <section className="container mt-5" id="product-card">
      <h2>{unilac} Products</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col col-6 col-lg-3">
            <ProductCard
              img={product.img}
              title={product.title}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// Example function to fetch products based on the category (this can be API call in real scenario)
function fetchProductsByCategory(category) {
  const allProducts = [
    { id: 1, img: upg, title: "UPG", price: 1000 },
    { id: 2, img: upg, title: "UPG", price: 1000 },
    // More products...
  ];

  return allProducts.filter((product) => product.title === category);
}
