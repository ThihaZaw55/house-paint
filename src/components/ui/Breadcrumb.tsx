import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="text-sm text-gray-500 mb-2">
      <ul className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand hover:text-blue-600"
          >
            <svg
              className="w-4 h-4 me-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
              />
            </svg>
            Product List
          </Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");

          return (
            <li
              key={name}
              className=" space-x-1.5 inline-flex items-center text-sm font-medium text-body hover:text-fg-brand hover:text-blue-600"
            >
              <span>{">"}</span>
              <Link to={routeTo} className="capitalize hover:text-blue-400">
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumb;
