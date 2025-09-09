import React from "react";
import { Link } from "react-router-dom";
import Convocation from "./images/convocation.jpg";
import AlumniMeet from "./images/alumnimeetup.jpg";
import Scholarship from "./images/scholarship.jpg";
import Researchpaper from "./images/researchpaper.jpg";
import Meetup from "./images/meetup.jpg";
import Scholarship2 from "./images/scholarship.png";
import Research from "./images/research.png";

const News = () => {
  return (
    <>
      

      {/* News Section */}
      <section id="news-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-3"
            data-aos="fade-down"
          >
            Latest News
          </h2>
          <p 
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Stay updated with the latest events, achievements, and announcements from PAF-IAST.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured News - Convocation */}
            <div 
              className="md:col-span-3 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={Meetup} 
                    alt="Convocation Ceremony" 
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                      Featured
                    </span>
                    <span className="text-gray-500 text-sm ml-4">May 15, 2025</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Annual Convocation Ceremony: Batch 2020-2021</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We are pleased to announce the Annual Convocation Ceremony for the graduates of Batch 2020-2021. 
                    The ceremony will take place on May 31, 2025 at the PAF-IAST Main Campus. All graduates are 
                    requested to register their attendance through the portal by May 20, 2025.
              
                  </p>
                  
                  <div className="flex items-center">
                    
                    <Link 
                      to="#" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                    >
                      Read More
                    </Link>
                    {/* <Link 
                      to="/register-convocation" 
                      className="ml-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      Register Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Regular News Items */}
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img 
                src={AlumniMeet} 
                alt="Alumni Meeting" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                    Event
                  </span>
                  <span className="text-gray-500 text-sm ml-4">December 28, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Annual Alumni Meet-Up 2025</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join us for our annual alumni gathering where we'll network, share experiences, and celebrate achievements.
                </p>
                <Link 
                  to="#" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <img 
                src={Scholarship2} 
                alt="Scholarship Program" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                    Opportunity
                  </span>
                  <span className="text-gray-500 text-sm ml-4">April 15, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">New Scholarship Program Launched</h3>
                <p className="text-gray-600 text-sm mb-4">
                  PAF-IAST announces a new scholarship program for postgraduate studies in collaboration with international universities.
                </p>
                <Link 
                  to="#" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img 
                src={Research} 
                alt="Research Achievement" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                    Achievement
                  </span>
                  <span className="text-gray-500 text-sm ml-4">April 5, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Alumni Research Published in Nature</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Groundbreaking research by PAF-IAST alumni Dr. Ahmed Khan on sustainable energy solutions published in Nature journal.
                </p>
                <Link 
                  to="#" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* View All News Button */}
          {/* <div className="text-center mt-12">
            <Link 
              to="/all-news" 
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              View All News
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default News;