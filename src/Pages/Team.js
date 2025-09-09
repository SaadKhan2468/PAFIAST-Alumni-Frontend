import React from "react";
import { Link } from "react-router-dom";
import education from "./images/education.jpg"; // Background image
import saad from "./images/saad.jpg";
import saud from "./images/saud.jpeg";
import siddique from "./images/siddique.jpeg";
import habab from "./images/habab.jpeg";
import furqan from "./images/furqan.png";
import pafiast from "./images/pafiast.png"; // Logo
import AppBar from "./AppBar";

const teamMembers = [
  {
    name: "M Saad Khan",
    role: "Lead Developer",
    description:
      "An experienced software engineer passionate about building scalable applications and leading development teams.",
    image: saad,
  },
  {
    name: "Muhammad Saud",
    role: "President",
    description:
      "A visionary leader with a strong background in strategic planning and organizational growth.",
    image: saud,
  },
  {
    name: "Saad Siddique",
    role: "VP Industrial Engagement",
    description:
      "Bridging the gap between industry and academia by fostering collaborations and partnerships.",
    image: siddique,
  },
  {
    name: "Habab Ali Ahmed",
    role: "General Secretary",
    description:
      "Dedicated to ensuring smooth operations and efficient communication within the organization.",
    image: habab,
  },
  {
    name: "Furqan Tanoli",
    role: "VP Finance",
    description:
      "Expert in financial management, budgeting, and resource allocation to drive growth.",
    image: furqan,
  },
];

const Team = () => {
  return (
    <div className="bg-gray-100">
      <AppBar />
      {/* Section 1: Background Image with Text Overlay */}
      <div
        className="relative flex items-center justify-center h-screen bg-center bg-cover"
        style={{ backgroundImage: `url(${education})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Dark overlay */}
        <div className="relative text-center text-white px-6 md:px-20">
          <h1 className="text-5xl font-bold">Meet Our Team</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Our team consists of highly skilled professionals dedicated to
            delivering top-notch solutions. We work together to bring innovation,
            creativity, and technical expertise to every project.
          </p>
        </div>
      </div>

      {/* Section 2: Team Members */}
      <div className="container mx-auto px-6 py-16">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-center mb-12 bg-white p-6 rounded-lg shadow-lg"
          >
            {/* Left Side: Circular Image */}
            <div className="w-40 h-40 flex-shrink-0 mr-8">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover rounded-full border-4 border-gray-300 shadow-md"
              />
            </div>

            {/* Right Side: Member Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">{member.name}</h2>
              <p className="text-gray-500 text-lg font-semibold">{member.role}</p>
              <p className="text-gray-600 mt-3 text-lg leading-relaxed">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
