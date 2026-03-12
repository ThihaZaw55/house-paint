import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import type { ChangeEvent } from "react";
import type { FormEvent } from "react";
import { login } from "../api/authApi";
import type { LoginData } from "../api/authApi";

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }
    try {
      const result = await login(formData);
      console.log("Login successful:", result);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials and try again.");
    }

    // Clear form after submission
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="bg-blue-700  h-screen">
      <div className="pt-2 m-0 flex justify-center px-4 ">
        <div className="w-full max-w-md">
          <h1 className="text-white font-bold text-2xl text-center">
            Stay Stay
          </h1>
          <h2 className="text-white font-medium text-2xl text-center">
            Welcome Back
          </h2>
          <p className="text-white text-sm text-center">
            Sign in to access your account
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
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your phone"
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
              <div className="flex justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                  Remember me
                </label>
                <NavLink
                  to="/"
                  className="text-blue-600 hover:text-blue-700 text-bold transition"
                >
                  Forgot password?
                </NavLink>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-85 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Login
                </button>
              </div>
              <div className="flex justify-center">
                <p>
                  Don't have an account ?
                  <NavLink to="/signin" className="text-blue-600 ps-2">
                    Sign In
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

export default LoginForm;
