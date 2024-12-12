export default function Contact() {
  return (
    <section className="container-fluid">
      <h1 className="pt-4">Contact Us</h1>
      <hr />
      <div className="row g-2 mt-4">
        <div className="col col-md-6">
          <div className="container">
            <form className="mx-auto">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                />
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleFormControlInput1"
                />
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Description
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Eg.အိမ်သုတ်ဆေးဝယ်ခြင်းနှင့် စုံစမ်းမေးမြန်ရန်"
                />
              </div>
              <div class="mb-3">
                <button type="submit" id="" class="btn btn-dark">
                  Contact
                </button>
              </div>
            </form>
          </div>

          <div class="nav d-flex text-center">
            <a
              class="nav-link text-orange"
              id="phone"
              href="tel:+959 250681464"
            >
              <i class="bi bi-phone-fill me-2 text-orange"></i>
              +959 250681464
            </a>
            <a class="nav-link rounded-4" href="#">
              <i class="bi bi-envelope-at-fill text-orange"></i>
            </a>
            <a class="nav-link rounded-4" href="#">
              <i class="bi bi-facebook text-orange"></i>
            </a>
            <a class="nav-link rounded-4" href="#">
              <i class="bi bi-messenger text-orange"></i>
            </a>
            <a class="nav-link rounded-4" href="#">
              <i class="bi bi-telegram text-orange"></i>
            </a>
          </div>
        </div>
        <div className="col col-md-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d209.6395594885036!2d96.08014030175214!3d16.956256607912017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2smm!4v1734015097925!5m2!1sen!2smm"
            width="600"
            height="450"
            // style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
