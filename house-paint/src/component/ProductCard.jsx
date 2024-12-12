export default function ProductCard({ img, title, description, price }) {
  return (
    <div className="col">
      <div className="card h-100 bg-dark">
        <img src={img} className="card-img-top" alt={img} />
        <div className="card-body text-white">
          <h6 className="card-title">{title}</h6>
          <p className="card-text">{description}</p>
          <p className="card-text">{price} K</p>
        </div>
      </div>
    </div>
  );
}
