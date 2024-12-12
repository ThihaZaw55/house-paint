import room from "../assets/images/living-room.jpg";
import paint from "../assets/images/paint.jpg";
import gray from "../assets/images/gray.jpg";
import house from "../assets/images/house.jpg";
import house1 from "../assets/images/house1.jpg";
import house2 from "../assets/images/house2.jpg";

export default function Services() {
  return (
    <section className="container-fluid w-100 d-block m-0 p-0">
      <div className="position-relative w-100 text-center">
        <img
          src={gray}
          alt="room"
          className="img-fluid w-100 object-fit-contain m-0 p-0"
        />
        <h1 className="position-absolute" id="center">
          Our Services
        </h1>
      </div>
      <div className="container-fluid mt-5 text-center">
        <h1>House Paint</h1>
        <div className="container mx-auto">
          <div className="row mt-5">
            <div className="col col-12 col-md-4 my-auto">
              <p className="card-text">
                လူကြီးမင်းတို့စိတ်တိုင်းကျ
                အိမ်ဆေးသုတ်ခြင်းကိုဆောင်ရွက်ပေးနေပါသည်။
              </p>
              <a href="tel:+959250681464" className="btn btn-outline-dark">
                Call Us
              </a>
            </div>
            <div className="col col-12 col-md-8  mt-4 mt-md-0">
              <img
                src={paint}
                alt="house paint"
                className="img-fluid object-fit-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <h1 className="container-fluid my-5 bg-dark text-white text-center py-2">
        House Decoration Design
      </h1>

      <div className="container-fluid h-50 w-75">
        <div
          id="carouselExampleInterval"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            <div class="carousel-item active" data-bs-interval="10000">
              <img src={room} class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item" data-bs-interval="2000">
              <img src={house} class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src={house1} class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src={house2} class="d-block w-100" alt="..." />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <div className="container-fluid text-center bg-dark text-white py-3">
          လူကြီးမင်းတို့ စိတ်တိုင်းကျ အိပ်ဆောက်လုပ်ခြင်း နှင့် အိမ်၊ ဆိုင်ခန်း၊
          အလုပ် အခန်းဖွဲ့ခြင်း များကို ဆောင်ရွပ်ပေးနေပါသည်။
          <a href="tel:+959250681464" className="btn btn-outline-light ms-2">
            Call Us
          </a>
        </div>
      </div>
    </section>
  );
}
