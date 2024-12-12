import ProductCard from "./ProductCard";
import { premier } from "../data";
export default function Premier() {
  return (
    <section className="container mt-5" id="unilac">
      <div className="row g-4" id="Unilc">
        <h1>Premier</h1>

        {premier.map((product) => {
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
