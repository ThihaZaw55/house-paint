import upg from "../assets/images/upg.jpg";
import upg1 from "../assets/images/upg1.jpeg";
import upg2 from "../assets/images/upg2.jpg";

export default function Card() {
  return (
    <section class="container-fluid bg-dark p-4 product">
      <br />
      <h3 class="p-2 text-white">UPG Painting Products</h3>
      <hr className="text-white" />
      <div class="row row-cols-1 row-cols-md-3 g-4 mt-3">
        <div class="col">
          <div class="card border-1">
            <img
              src={upg}
              class="card-img-top object-fit-cover"
              height={400}
              alt="upg"
            />
            <div class="card-body">
              <h5 class="card-title">UPG UNILAC Gloss Enamel Paint</h5>
              <p class="card-text">
                UNILAC Gloss Enamel is a market-leading, high quality alkyd
                enamel designed to decorate and protect surfaces of iron, metal,
                and wood. It offers attractive colors, excellent glossiness,
                strong adhesion, and long-lasting durability. With its superior
                finish and the widest range of top colors in its class, UNILAC
                Gloss Enamel is an all-time favorite for both residential and
                commercial applications.
              </p>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card">
            <img
              src={upg2}
              class="card-img-top object-fit-cover"
              height={400}
              alt="upg"
            />
            <div class="card-body">
              <h5 class="card-title">UPG ORIENT Emulsion Paint</h5>
              <p class="card-text">
                ORIENT Emulsion is a market-leading, high quality acrylic
                emulsion designed for the decoration and protection of both
                interior and exterior masonry surfaces. It is an
                all-time-favorite paint among mid-end projects and individual
                home owners alike. It provides high quality at an affordable
                price point. With the widest range of market-leading colors in
                its class, ORIENT Emulsion provides versatility and style for
                any projects.
              </p>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card">
            <img
              src={upg1}
              class="card-img-top object-fit-cover"
              height={400}
              alt="upg"
            />
            <div class="card-body">
              <h5 class="card-title">UPG UNITEX Emulsion Paint</h5>
              <p class="card-text">
                UNITEX Emulsion is a market-leading, economical interior
                emulsion for the decoration of cost-conscious housing,
                apartments, detached houses, schools, shops, and similar
                settings. Widely regarded as the best-selling and best-budget
                paint in Myanmar, this easy-to-apply paint offers decent quality
                with the widest spectrum of colors in its class.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
