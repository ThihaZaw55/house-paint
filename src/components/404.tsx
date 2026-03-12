import { Link } from "react-router-dom";

export default function Error() {
  return (
    <section className="mx-auto my-5 text-orange-700 text-center inline-block">
      <div>
        <h1>404 Error Page</h1>
        <h2>Wrong URL</h2>
        <Link to="/">Back to home page</Link>
      </div>
    </section>
  );
}
