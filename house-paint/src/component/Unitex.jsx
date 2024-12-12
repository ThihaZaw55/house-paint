import ProductCard from "./ProductCard";
import { unitex } from "../data";
export default function Unitex() {
  return (
    <section className="container mt-5" id="unilac">
      <div className="row g-4" id="Unilc">
        <h1>Unitex</h1>

        {unitex.map((product) => {
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
