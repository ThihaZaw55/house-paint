export default function Footer() {
  return (
    <>
      <footer class="container-fluid bg-dark mt-5 p-4">
        <div class="row text-orange text-center g-4">
          <div class="col col-md-3">
            <h5 class="px-3">Page Links</h5>
            <nav class="nav flex-column">
              <a class="nav-link text-orange" href="/home">
                Home
              </a>
              <a class="nav-link text-orange" href="/products">
                Products
              </a>
              <a class="nav-link text-orange" href="/services">
                Services
              </a>
              <a class="nav-link text-orange" href="/about">
                About Us
              </a>
              <a class="nav-link text-orange" href="/contact">
                Contact Us
              </a>
            </nav>
          </div>

          <div class="col col-md-3">
            <h5 class="px-3">UPG Products</h5>
            <nav class="nav flex-column">
              <a class="nav-link text-orange" href="/products/unilac">
                UNILAC GLOSS ENAMEL PAINTS
              </a>
              <a class="nav-link text-orange" href="/products/orient">
                ORIENT EMULSION PAINTS
              </a>
              <a class="nav-link text-orange" href="/products/unitex">
                UNITEX EMULSION PAINTS
              </a>
              <a class="nav-link text-orange" href="/products/premier">
                PREMIUM PAINTS
              </a>
            </nav>
          </div>

          <div class="col col-md-3 col-sm-6">
            <h5 class="px-3 text-orange">Services</h5>
            <nav class="nav flex-column text-orange">
              <a class="nav-link text-orange" href="/services">
                House Painting Services
              </a>
              <a class="nav-link text-orange" href="/services">
                Decoration Services
              </a>
            </nav>
          </div>

          <div class="col col-md-3 col-sm-6 text-start">
            <h5 class="px-3">Contact Us</h5>
            <nav class="nav flex-column text-orange ">
              <a
                class="nav-link text-orange"
                id="home"
                href="https://maps.app.goo.gl/JY2dq1B9Bqdafjxk8"
              >
                <i class="bi bi-shop me-2 text-orange"></i>
                No.164, Bogyoke Road, Shwepyithar Township, Yangon.
              </a>
              <a
                class="nav-link text-orange"
                id="phone"
                href="tel:+959 250681464"
              >
                <i class="bi bi-phone-fill me-2 text-orange"></i>
                +959 250681464
              </a>

              <div class="nav d-flex text-center">
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
            </nav>
          </div>
        </div>

        <div class="container text-center text-secondary pt-3">
          &copy; 2024, All Right Reserved. Design by Thiha Zaw
        </div>
      </footer>
    </>
  );
}
