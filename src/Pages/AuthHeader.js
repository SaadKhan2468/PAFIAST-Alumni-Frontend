import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from 'lucide-react';

const AuthHeader = ({ isLoggedIn, userProfile }) => {
  const [attestationOpen, setAttestationOpen] = useState(false);
  const [benefitsOpen, setBenefitsOpen] = useState(false);

  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-8" style={{ zIndex: 20 }}>
      {isLoggedIn ? (
        <nav className="flex items-center space-x-6">
          {/* Attestation Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAttestationOpen(!attestationOpen)}
              className="relative px-6 py-2 text-white font-semibold overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-yellow-400 group-hover:bg-blue-500 opacity-70"></span>
              <span className="relative flex items-center text-white group-hover:text-white">
                Attestation <ChevronDownIcon className="ml-1 h-4 w-4" />
              </span>
            </button>
            {attestationOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Degree Attestation
                </Link>
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Generate Transcript
                </Link>
              </div>
            )}
          </div>

          {/* Benefits Dropdown */}
          <div className="relative">
            <button
              onClick={() => setBenefitsOpen(!benefitsOpen)}
              className="relative px-6 py-2 text-white font-semibold overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-yellow-400 group-hover:bg-blue-500 opacity-70"></span>
              <span className="relative flex items-center text-white group-hover:text-white">
                Benefits <ChevronDownIcon className="ml-1 h-4 w-4" />
              </span>
            </button>
            {benefitsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg">
                <Link to="/alumni-card" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Alumni Card
                </Link>
                <Link to="/discounts" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Discounts
                </Link>
              </div>
            )}
          </div>

          {/* Profile Picture */}
          <Link to="/profile">
            <img
              src={userProfile?.profilePicture ? `${process.env.REACT_APP_API_URL}${userProfile.profilePicture}` : "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            />
          </Link>
        </nav>
      ) : (
        <Link to="/login">
          <button className="relative px-6 py-2 text-white font-semibold overflow-hidden group">
            <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-yellow-400 group-hover:bg-blue-500 opacity-70"></span>
            <span className="relative text-white group-hover:text-white">Login</span>
          </button>
        </Link>
      )}
    </div>
  );
};

export default AuthHeader;