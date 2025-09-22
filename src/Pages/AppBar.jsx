import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import pafiast from "./images/pafiast.png";
import axios from "axios";

const AppBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
            // Fetch user profile
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUserProfile(response.data);
          } else {
            clearAuth();
          }
        } catch (e) {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    };

    const clearAuth = () => {
      setIsAuthenticated(false);
      setUserProfile(null);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate("/profilehome");
    } else {
      navigate("/login");
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className={`bg-yellow-400 shadow-lg sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-xl' : 'py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <img src={pafiast} alt="PAF-IAST ALUMNI" className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-12'} mr-4`} />
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/alumni" className="text-gray-700 hover:text-blue-600 font-bold">Home</Link>
          {/*<Link to="/about" className="text-gray-700 hover:text-blue-600 font-bold">About</Link>
          <Link to="/newsfeed" className="text-gray-700 hover:text-blue-600 font-bold">Newsfeed</Link>
          <Link to="/eventcalendar" className="text-gray-700 hover:text-blue-600 font-bold">Events</Link>*/}
          
          <Link to="/message" className="text-gray-700 hover:text-blue-600 font-bold">Message</Link>
          <Link to="/team" className="text-gray-700 hover:text-blue-600 font-bold">Our Team</Link>
          
          <Link to="/successstories" className="text-gray-700 hover:text-blue-600 font-bold">Success Stories</Link>
          
          <div className="relative flex items-center">
            <div className={`flex items-center transition-all duration-300 ${isSearchExpanded ? 'w-48' : 'w-8'}`} onMouseEnter={() => setIsSearchExpanded(true)} onMouseLeave={() => !searchQuery && setIsSearchExpanded(false)}>
              <form onSubmit={handleSearch} className="flex items-center w-full">
                {isSearchExpanded && <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white text-gray-700 rounded-l-full py-1 px-3 focus:outline-none w-full transition-all duration-300" />}
                <button type="submit" className="text-gray-700 p-1 rounded-full hover:bg-blue-100 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div 
              onClick={handleAuthClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {isAuthenticated && userProfile ? (
                <img
                  src={userProfile.profilePicture 
                    ? `${process.env.REACT_APP_API_URL}${userProfile.profilePicture}`
                    : "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppBar;
