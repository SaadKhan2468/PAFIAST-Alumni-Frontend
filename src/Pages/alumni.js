import React, { useState, useEffect } from "react";
import axios from 'axios';
import AppBar from "./AppBar";
import AuthHeader from './AuthHeader';
import paflLogo from "./images/pafl.png";
import { Helmet } from 'react-helmet-async';
import Job from "./images/job1.jpg";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/outline"; // Added for search icon
import Cinematic from "./Cinematic.mp4";
import siddique2 from "./images/siddique2.jpeg";
import suleman from "./images/suleman.jpeg";
import saad from "./images/saad.jpg"
import pafiast from "./images/pafiast.png";
import Suleman from "./images/Suleman.png";
import News from "./News";
// Import AOS (Animate On Scroll) library at the top of your file
import AOS from 'aos';
import 'aos/dist/aos.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add this useEffect hook into your component
  useEffect(() => {
    // Create script element to load Google Maps API
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&v=weekly';
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    
    // Define the global initMap function that Google Maps will call
    window.initMap = function() {
      // Wait for the Google Maps library to be fully loaded
      if (!window.google) {
        console.error("Google Maps API not loaded yet");
        return;
      }
      
      try {
        // Create a map focused on PAF-IAST location (Khanpur Rd, Mang)
        // Note: These coordinates are approximate and should be adjusted for accuracy
        const pafiast = { lat: 33.9088, lng: 72.9180 };
        
        const map = new window.google.maps.Map(document.getElementById("map"), {
          center: pafiast,
          zoom: 15,
          mapId: "DEMO_MAP_ID",
        });
        
        // Add a marker for the university
        const marker = new window.google.maps.Marker({
          position: pafiast,
          map: map,
          title: "PAF-IAST University",
        });
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };
    
    // Add script to document
    document.head.appendChild(googleMapsScript);
    
    // Cleanup function
    return () => {
      if (googleMapsScript.parentNode) {
        document.head.removeChild(googleMapsScript);
      }
      window.initMap = null;
    };
  }, []);
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 100,
    });
    
    // Refresh AOS on window resize
    window.addEventListener('resize', () => {
      AOS.refresh();
    });
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
      const targetText = counter.innerText;
      let targetNum = parseFloat(targetText.replace(/[^0-9.]/g, ''));
      const hasPct = targetText.includes('%');
      const hasPlus = targetText.includes('+');
      
      const duration = 1500;
      const increment = targetNum / (duration / 16); // 60fps
      
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          counter.innerText = hasPct ? `${targetNum}%` : (hasPlus ? `${targetNum}+` : targetNum);
          clearInterval(timer);
        } else {
          counter.innerText = hasPct ? `${Math.ceil(current)}%` : (hasPlus ? `${Math.ceil(current)}+` : Math.ceil(current));
        }
      }, 16);
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }, []);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleSearchChange = async (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  
  if (query.length > 2) { // Only search when at least 3 characters
    setIsSearching(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/search?q=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  } else {
    setSearchResults([]);
  }
};
 // Structured Data (JSON-LD)
     const structuredData = {
       '@context': 'https://schema.org',
       '@type': 'WebSite',
       name: 'PAFIAST Alumni Network',
       url: 'https://your-vercel-domain.com',
       potentialAction: {
         '@type': 'SearchAction',
         target: 'https://your-vercel-domain.com/alumni?q={search_term_string}',
         'query-input': 'required name=search_term_string'
       }
     };


  return (
    <header className="relative">
      <Helmet>
           <title>PAFIAST Alumni Network - Connect with Alumni</title>
           <meta name="description" content="Join the PAFIAST Alumni Network to reconnect with fellow graduates, explore job opportunities, and share your professional journey." />
           <meta name="keywords" content="PAFIAST, alumni network, university alumni, job opportunities, Pakistan education, networking" />
           <meta name="author" content="PAFIAST Alumni Network" />
           <meta name="robots" content="index, follow" />
           {/* Open Graph for social sharing */}
           <meta property="og:title" content="PAFIAST Alumni Network - Connect with Alumni" />
           <meta property="og:description" content="Join the PAFIAST Alumni Network to reconnect with fellow graduates, explore job opportunities, and share your professional journey." />
           <meta property="og:image" content="https://your-vercel-domain.com/images/pafiast.png" />
           <meta property="og:url" content="https://your-vercel-domain.com/alumni" />
           <meta property="og:type" content="website" />
           {/* Twitter Cards */}
           <meta name="twitter:card" content="summary_large_image" />
           <meta name="twitter:title" content="PAFIAST Alumni Network - Connect with Alumni" />
           <meta name="twitter:description" content="Join the PAFIAST Alumni Network to reconnect with fellow graduates, explore job opportunities, and share your professional journey." />
           <meta name="twitter:image" content="https://your-vercel-domain.com/images/pafiast.png" />
           {/* Favicon */}
           <link rel="icon" href="/favicon.ico" />
           {/* Structured Data */}
           <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
         </Helmet>
      {/* Hero Section with Video */}
      <section className="relative w-full h-screen">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src={Cinematic} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Hero Text - Centered with elegant styling */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-40 text-white p-8"
          style={{ zIndex: 10 }}
        >
          <h1 
            className="text-5xl font-bold mb-4 tracking-wide"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            PAF-IAST Alumni Network
          </h1>
          <p 
            className="text-xl font-bold max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Reconnect with your community, share experiences, and build lasting professional relationships
          </p>
        </div>
      </section>
      
     <AppBar />
     
    
      
      {/* NEW SECTION: Logo and Search Bar */}
      <section className="py-16 bg-gray">
        <div className="container mx-auto px-4 flex flex-col items-center">
          {/* Large Centered Logo */}
          <div 
            className="mb-10"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <img 
              src={pafiast} 
              alt="PAF-IAST Logo" 
              className="h-40 md:h-48 w-auto" 
            />
          </div>
          
          {/* Search Bar */}
          <div 
            className="w-full max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <div className="flex items-center">
                <input
  type="text"
  placeholder="Search alumni, events, news..."
  value={searchQuery}
  onChange={handleSearchChange}  // Changed from onSubmit
  className="w-full px-6 py-4 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
/>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-r-full transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            <div className="w-full max-w-4xl mx-auto mt-8">
  {isSearching && <p className="text-center text-gray-600">Searching...</p>}
  
  {searchResults.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {searchResults.map(user => (
        <div key={user.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={user.profilePicture ? `${process.env.REACT_APP_API_URL}${user.profilePicture}` : 'https://via.placeholder.com/150'} 
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.department}</p>
              <Link 
                to={`/profile/${user.registration_number}`}
                className="text-blue-600 text-sm hover:underline"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {!isSearching && searchResults.length === 0 && searchQuery && (
    <p className="text-center text-gray-600">No results found</p>
  )}
</div>
          </div>
        </div>
      </section>
      <News />
      
      
      {/* Alumni Impact Stats - Modern Cards with animations */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center text-gray-800 mb-3"
            data-aos="fade-down"
          >
            Alumni Impact
          </h2>
          <p 
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Because of you, so much is possible. Our alumni continue to make remarkable contributions worldwide.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat Card 1 */}
            <div 
              className="bg-white rounded-xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="inline-block p-4 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold text-blue-600 mb-2 counter">20</h3>
              <p className="text-gray-600 text-lg">Students Studying in Austria</p>
            </div>
            
            {/* Stat Card 2 */}
            <div 
              className="bg-white rounded-xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="inline-block p-4 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold text-indigo-600 mb-2 counter">80%</h3>
              <p className="text-gray-600 text-lg">Employment Rate</p>
            </div>
            
            {/* Stat Card 3 */}
            <div 
              className="bg-white rounded-xl shadow-lg p-8 text-center transform transition duration-500 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="inline-block p-4 rounded-full bg-purple-100 text-purple-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-5xl font-bold text-purple-600 mb-2 counter">25+</h3>
              <p className="text-gray-600 text-lg">Active Alumni Volunteers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Distinguished Alumni Section */}
      <section className="py-16 bg-white px-4">
        <div className="container mx-auto">
          <h2 
            className="text-3xl font-bold text-center mb-3"
            data-aos="fade-down"
          >
            Distinguished Alumni
          </h2>
          <p 
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Meet our inspiring alumni who are making meaningful contributions in their fields.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Alumni - Large Card */}
            <div 
              className="md:col-span-2 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="relative">
                <img src={siddique2} alt="Saad Ghuffran Siddique" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <span className="bg-blue-600 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">Entrepreneur</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">Saad Ghuffran Siddique</h3>
                <p className="text-blue-600 font-medium mb-3">Class of 2020</p>
                <p className="text-gray-600 leading-relaxed">
                  Saad Ghuffran Siddique has successfully founded Edversity, an innovative EdTech startup revolutionizing access to quality education across Pakistan and beyond.
                </p>
              </div>
            </div>

            {/* Right column - smaller cards */}
            <div className="space-y-8">
              {/* Alumni Card 1 */}
              <div 
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="relative">
                  <img src={Suleman} alt="Suleman" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className="bg-indigo-600 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">Tech</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">Suleman</h3>
                  <p className="text-blue-600 font-medium mb-2">Class of 2020</p>
                  <p className="text-gray-600 text-sm">Associate Software Engineer at Tkxel</p>
                </div>
              </div>
              
              {/* Alumni Card 2 */}
              <div 
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                <div className="relative">
                  <img src={saad} alt="Saad" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className="bg-purple-600 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">Engineering</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">Saad</h3>
                  <p className="text-blue-600 font-medium mb-2">Class of 2021</p>
                  <p className="text-gray-600 text-sm">Software Engineer developing innovative solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Opportunities Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left: Job Content */}
            <div 
              className="md:w-1/2 mb-8 md:mb-0 md:pr-8"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <h2 className="text-3xl font-bold text-blue-900 mb-6">JOB OPPORTUNITIES</h2>
              <p className="text-gray-700 text-lg mb-4">
                Explore a wide range of job opportunities tailored for PAF-IAST alumni. 
                We bring you the latest job listings to help you excel in your career.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                Our platform keeps you connected with top employers and trending industries.
              </p>
              <a
                href="https://paf-iast.edu.pk/careers-pafiast/"
                className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md transform hover:-translate-y-1 hover:shadow-lg"
              >
                EXPLORE OPPORTUNITIES
              </a>
            </div>

            {/* Right: Job Image */}
            <div 
              className="md:w-1/2"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <img
                src={Job}
                alt="Job Opportunities"
                className="rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-500 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action with parallax effect */}
      <section 
        className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden"
        data-aos="fade"
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 
            className="text-3xl font-bold mb-4"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            Join Our Growing Alumni Network
          </h2>
          <p 
            className="max-w-2xl mx-auto mb-8 text-lg"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Connect with fellow graduates, access exclusive opportunities, and be part of a community that supports your professional growth.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-gray-100 transition duration-300 shadow-lg transform hover:scale-105"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            Register Now
          </Link>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          {/* Left Section - Logo */}
          <div 
            className="mb-6 md:mb-0"
            data-aos="fade-right"
          >
            <img src={paflLogo} alt="PAF-IAST Logo" className="h-20" />
          </div>

          {/* Right Section - Links and Contact Info */}
          <div 
            className="text-center md:text-right space-y-4"
            data-aos="fade-left"
          >
            <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
            {/* Contact Info */}
            <div className="mt-4 text-sm">
              <p>Phone: +(0995) 111 723 278</p>
              <p>Email: info@paf-iast.edu.pk</p>
            </div>
          </div>
        </div>

        {/* Trademark Line */}
        <div 
          className="border-t border-gray-600 mt-20 pt-4 text-center text-xs text-gray-400"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          © 2025 PAF-IAST Alumni Network. All Rights Reserved.
        </div>
      </footer>
    </header>
  );
};

export default Header;