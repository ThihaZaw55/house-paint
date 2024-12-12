import { Link } from "react-router-dom";

export default function Error() {
  return (
    <section className="container-fluid my-5 text-warning text-center">
      <h1>404 Error Page</h1>
      <h2>Wrong URL</h2>
      <Link to="/">Back to home page</Link>
    </section>
  );
}
