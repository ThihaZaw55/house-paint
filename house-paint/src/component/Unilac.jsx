import ProductCard from "./ProductCard";
import { unilac } from "../data";
export default function Unilac() {
  return (
    <section className="container mt-5" id="unilac">
      <div className="row g-4" id="Unilc">
        <h1>Unilac</h1>

        {unilac.map((product) => {
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
