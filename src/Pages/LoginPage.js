import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import log1 from "./images/log1.jpg";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        navigate("/profilehome");
      }
    } catch (e) {
      localStorage.removeItem("token");
    }
  }
}, [navigate]);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors

  console.log("Attempting login with:", { email, password });

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {  
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token); // Store the JWT token in localStorage
      navigate("/profile"); // Redirect to profile page
    } else {
      setError(data.message || "Invalid credentials. Try again!");
    }
  } catch (error) {
    console.error("Login error:", error);
    setError("Something went wrong. Please try again.");
  }
};


  return (
    <div className="flex h-screen">
      {/* Left Half - Image with Text */}
      <div
        className="w-1/2 bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${log1})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="text-white z-10 text-center px-8">
          <h1 className="text-4xl font-bold mb-4">Welcome Back to PAF-IAST</h1>
          <p className="text-lg">
            Stay connected with your community and unlock exclusive benefits!
          </p>
        </div>
      </div>

      {/* Right Half - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter your username"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-gray-600 text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/signupform"
              className="relative px-6 py-2 text-black  font-semibold overflow-hidden group"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;