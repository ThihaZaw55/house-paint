import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
const Register = () => {
  type RegisterFormData = {
    name: string;
    email: string;
    nrc: string;
    phone: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
  };
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    nrc: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.terms) {
      alert("You must agree to the terms");
      return;
    }

    console.log("Register data:", formData);
    alert("Registration successful 🎉");
  };
  const [error, setError] = useState<string>("");

  return (
    <div className="bg-blue-700 min-h-screen flex items-center justify-center">
      <div className="pt-2 m-0 flex justify-center px-4 ">
        <div className="w-full max-w-md">
          <h1 className="text-white font-bold text-2xl text-center">
            Stay Stay
          </h1>
          <h2 className="text-white font-medium text-2xl text-center">
            Create your account
          </h2>
          <p className="text-white text-sm text-center">
            Join us to find your perfect home in Myanmar
          </p>
          <div className="bg-white shadow-lg rounded-xl p-7 m-2">
            <div className="text-center">
              <Link className="text-2xl font-bold text-blue-600" to="/"></Link>
            </div>
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  type="username"
                  id="username"
                  name="username"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium mb-1"
                >
                  Full Name
                </label>
                <input
                  type="fullname"
                  id="fullname"
                  name="fullname"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="phone"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-85 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Sign In
                </button>
              </div>
              <div className="flex justify-center">
                <p>
                  Already have an account?
                  <NavLink to="/login" className="text-blue-600 ps-2">
                    Login
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
          <div className="text-white flex justify-center p-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4 accent-blue-600" />
              By continuing, you aree to Stay Stay's Terms of Service and
              Privact Policy
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
