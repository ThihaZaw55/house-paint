import colorful from "../assets/images/colorful-paint.jpg";
import orange from "../assets/images/orange.jpg";
import room1 from "../assets/images/room1.jpg";
import room2 from "../assets/images/room2.jpg";
import room3 from "../assets/images/room3.jpg";

export default function Hero() {
  return (
    <section className="container-fluid m-0 p-0">
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide rounded-2"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={colorful}
              className="d-block w-100 object-fit-cover"
              height={700}
              alt="..."
            />
          </div>

          <div className="carousel-item">
            <img
              src={room1}
              className="d-block w-100 object-fit-cover"
              height={700}
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src={room2}
              className="d-block w-100 object-fit-cover"
              height={700}
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src={room3}
              className="d-block w-100 object-fit-cover"
              height={700}
              alt="..."
            />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
}
