import ProductCard from "./ProductCard";
import upg from "../assets/images/upg.jpg";
import { orient } from "../data";
export default function Orient() {
  return (
    <section className="container mt-5" id="product-ProductCard">
      <h1>ORIENTC</h1>
      <div className="row g-4" id="Unilc">
        {orient.map((product) => {
          const { id, image, title, description, price } = product;
          return (
            <div key={id} className="col col-6 col-lg-3">
              <ProductCard
                img={image}
                title={title}
                description={description}
                price={price}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
