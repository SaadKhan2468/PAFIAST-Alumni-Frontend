import React, { useState } from "react";
import About1 from "./images/about1.jpg";
import About2 from "./images/about2.jpg";
import { Link } from "react-router-dom";
import pafiast from "./images/pafiast.png";
import AppBar from "./AppBar";

const AboutPage = () => {
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Query:", query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />

      {/* Content Section */}
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <section className="flex flex-col md:flex-row items-center my-12">
          <div className="md:w-1/2 mb-6 md:mb-0 pr-4">
            <img
              src={About1}
              alt="Alumni Together"
              className="w-full h-auto object-cover rounded-lg shadow-xl"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Why We Want Alumni Together
            </h2>
            <p className="text-lg text-gray-700">
              Alumni connections create a strong network for sharing knowledge, job opportunities,
              and mentorship, fostering lifelong relationships.
            </p>
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center my-12">
          <div className="md:w-1/2 text-center md:text-left pr-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700">
              Our mission is to provide a platform for PAF-IAST alumni to connect, share resources,
              and support each other's personal and professional growth.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src={About2} alt="Mission" className="w-full h-auto object-cover rounded-lg shadow-xl" />
          </div>
        </section>

        <section className="my-12" id="contact">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg border">
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-semibold text-gray-800">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="query" className="block text-lg font-semibold text-gray-800">
                Your Query
              </label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                rows="4"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-400 transition duration-300"
            >
              Submit
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center w-full">
        <p>&copy; 2025 PAF-IAST Alumni Network. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;


