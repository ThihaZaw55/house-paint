import service1 from "../assets/images/service1.jpg";
import service2 from "../assets/images/service2.jpg";

export default function Service() {
  return (
    <section class="container-fluid d-block mt-3">
      <br />
      <h3 class="d-block p-2 sHead">Our Services</h3>
      <hr />
      <div class="row p-3">
        <div class="col-md-6 align-self-md-center">
          <h4 class="card-title align-self-center">Painting Service</h4>
          <p class="card-text fs-5">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
        </div>

        <div class="col-md-6 p-4">
          <img src={service1} class="w-100 rounded-4" />
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-6 p-4">
          <img src={service2} class="w-100 rounded-4" />
        </div>

        <div class="col-md-6 align-self-center p-4">
          <h4 class="card-title">Decoration Service</h4>
          <p class="card-text fs-5">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
        </div>
      </div>
    </section>
  );
}
