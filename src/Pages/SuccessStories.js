import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import pafiast from "./images/pafiast.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import aqsa from "./images/successstories/aqsa.jpg";
import ayeshakhan from "./images/successstories/ayeshakhan.jpg";
import ehtisham from "./images/successstories/ehtisham.jpg";
import fozan from "./images/successstories/fozan.jpg";
import nageen from "./images/successstories/nageen.jpg";
import anas from "./images/successstories/anas.jpg";
import afsheen from "./images/successstories/afsheen.jpg";
import abideen from "./images/successstories/abideen.jpg";
import Sulemannob from "./images/sulemannob.png";
import Saadnob from "./images/saadnob.png";
import AppBar from "./AppBar";

const SuccessStories = () => {
  // State for current slide index
  const [activeBioIndex, setActiveBioIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayRef = useRef();
  const slidesContainerRef = useRef(null);
  
  // Biomedical success stories data with images and content
  const biomedicalStories = [
    {
      image: abideen,
      name: "Muhammad Abideen",
      department: "BS Biomedical Sciences",
      story: "My name is Muhammad Abideen, from the land of K2, Gilgit Baltistan. Graduating from PAF-IAST has been a transformative experience for me. At PAF-IAST, I had the privilege of learning from distinguished faculty whose mentorship greatly enriched my academic knowledge and supported my personal and professional growth."
    },
    {
      image: ayeshakhan,
      name: "Ayesha Khan",
      department: "BS Biomedical Sciences",
      story: "As a graduate of PAF-IAST's Biomedical Sciences program, I've been able to pursue groundbreaking research in cellular biology. The university's state-of-the-art laboratories and dedicated mentors helped me develop the skills I needed to succeed in my current role at a leading pharmaceutical company."
    },
    {
      image: fozan,
      name: "Fozan Ahmed",
      department: "BS Biomedical Sciences",
      story: "My journey at PAF-IAST equipped me with both theoretical knowledge and practical skills essential for modern healthcare research. The opportunities for hands-on experience in advanced laboratory settings prepared me well for my current position in clinical research."
    },
    {
      image: anas,
      name: "Anas Malik",
      department: "BS Biomedical Sciences",
      story: "The rigorous curriculum and excellent faculty at PAF-IAST's Biomedical Sciences department gave me a strong foundation for my career. I'm now working on innovative diagnostic technologies that have the potential to transform healthcare accessibility in rural Pakistan."
    },
    {
      image: afsheen,
      name: "Afsheen Zahra",
      department: "BS Biomedical Sciences",
      story: "PAF-IAST's emphasis on research and innovation allowed me to explore my interests in genetic analysis. Today, I'm proud to be contributing to important genomic research that aims to address health challenges specific to our region."
    },
    {
      image: ehtisham,
      name: "Ehtisham Ul Haq",
      department: "BS Biomedical Sciences",
      story: "The collaborative environment at PAF-IAST fostered my interest in interdisciplinary research. Now, I'm applying biomedical principles to environmental health projects that benefit communities throughout Pakistan."
    },
    {
      image: nageen,
      name: "Nageen Fatima",
      department: "BS Biomedical Sciences",
      story: "My education at PAF-IAST went beyond academics - I learned critical thinking, problem-solving, and research methodologies that serve me daily in my work at a leading medical research institute. The mentorship I received continues to guide my professional development."
    }
  ];
  
  // Featured alumni with prominent display
  const featuredAlumni = [
    {
      image: Sulemannob,
      name: "Suleman",
      department: "Computer Science",
      story: "Muhammad Suleman, now a respected member of the tech community at Tkxel, a well-regarded software house, began his journey at PAF-IAST. At the institute, he not only excelled academically but also embraced every challenge as an opportunity for growth. Initially a reserved individual, he gradually evolved into an inspiring leader,  laying the foundation for the Entrepreneurial Society and the Google Developer Student Club (GDSC), visionary initiatives aimed at benefiting future generations.His leadership was evident as he organized collaborative team projects, led innovative university summits, and consistently sought opportunities to learn and improve. Today, as a proud alumnus of PAF-IAST, Muhammad Suleman continues to inspire his juniors, often reflecting on the formative years that set him on a path of continuous growth and meaningful success."
    },
    {
      image: Saadnob,
      name: "Saad Ghufran Siddique",
      department: "Computer Science",
      story: "Saad founded a successful startup that bridges technology and traditional agriculture, helping farmers increase their productivity through innovative methods. His company has now expanded to three provinces and employs over 50 people. The entrepreneurial spirit he developed at PAF-IAST's Business Incubation Center was instrumental in turning his vision into reality. Talal regularly returns to campus to mentor current students interested in entrepreneurship."
    }
  ];
  
  // Other success stories
  const otherStories = [
    {
      image: aqsa,
      name: "Aqsa",
      department: "MS Artificial Intelligence",
      story: "I’m Aqsa Khan, an MS Artificial Intelligence graduate from the School of Computing Sciences, PAF-IAST. My journey in AI has been one of passion, perseverance and growth, leading me to incredible opportunities in both academia and industry. One of my proudest achievements was being selected for a research program with Johannes Kepler University (JKU), Austria where I had the opportunity to collaborate with experts in AI and explore cutting-edge advancements in the field. During my master’s I also served as a Lab Engineer, strengthening my research and technical skills. I was honored to be selected for the Women KP Digital Civic Internship with Code for Pakistan, where I was among only 50 women chosen across Khyber Pakhtunkhwa (KPK). This program allowed me to contribute to impactful digital solutions while reinforcing my commitment to AI-driven innovation. My professional career has been an exciting progression from working as a Data Scientist at Jazz, to joining Ufone as an Executive BI Reporting & QA and now serving as an Assistant Manager in the UAV Lab at NRTC (National Radio & Telecommunication Corporation). At NRTC, I’m actively contributing to the development of AI-powered UAV systems for security, defense and commercial applications. My journey reflects the excellence of PAF-IAST graduates in shaping the future of technology-driven solutions. As I continue to grow in my profession, I remain committed to pushing the boundaries of AI innovation. My advice to aspiring AI professionals: Follow your passion, embrace new challenges and never stop learning. Aqsa Khan A Journey of Innovation and Growth"
    }
  ];
  
  // Setup smooth carousel transition effect
  useEffect(() => {
    const slideWidth = 100 / biomedicalStories.length;
    
    if (slidesContainerRef.current) {
      slidesContainerRef.current.style.transition = isHovering ? 'none' : 'transform 0.5s ease-in-out';
      slidesContainerRef.current.style.transform = `translateX(-${activeBioIndex * slideWidth}%)`;
    }
  }, [activeBioIndex, isHovering, biomedicalStories.length]);
  
  // Setup auto-scrolling functionality with pause on hover
  useEffect(() => {
    const play = () => {
      if (!isHovering) {
        setActiveBioIndex((prevIndex) => (prevIndex + 1) % biomedicalStories.length);
      }
    };
    
    autoPlayRef.current = play;
  }, [biomedicalStories.length, isHovering]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      autoPlayRef.current();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Navigation functions for carousel
  const navigateBio = (direction) => {
    if (direction === "prev") {
      setActiveBioIndex((prevIndex) => 
        prevIndex === 0 ? biomedicalStories.length - 1 : prevIndex - 1
      );
    } else {
      setActiveBioIndex((prevIndex) => (prevIndex + 1) % biomedicalStories.length);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppBar />

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-800 py-20">
        <div className="container mx-auto px-4 pt-32 flex flex-col items-center">
          <img src={pafiast} alt="PAF-IAST Logo" className="h-24 mb-6" />
          <h1 className="text-5xl font-bold text-white text-center mb-4">Inspirational Success Stories</h1>
          <p className="text-xl text-gray-200 text-center max-w-3xl mx-auto">
            Discover how our alumni are making a significant impact in their fields and changing the world after graduating from PAF-IAST.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Success Stories in Bio Medical Sciences */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Success Stories in Biomedical Sciences</h2>
        
        {/* Smooth Sliding Biomedical Sciences Carousel */}
        <div 
          className="relative w-full max-w-6xl mx-auto mb-24 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-full overflow-hidden rounded-xl shadow-2xl">
            <div 
              ref={slidesContainerRef}
              className="flex w-full"
              style={{ width: `${biomedicalStories.length * 100}%` }}
            >
              {biomedicalStories.map((story, index) => (
                <div 
                  key={index}
                  className="relative"
                  style={{ width: `${100 / biomedicalStories.length}%` }}
                >
                  <div className="relative w-full bg-gradient-to-r from-blue-800 to-indigo-900">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="h-full">
                        <img 
                          src={story.image} 
                          alt={story.name}
                          className="w-full h-full object-cover object-center"
                          style={{ maxHeight: "500px" }}
                        />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                          <p className="text-xl font-medium text-blue-200 mb-1">{story.department}</p>
                          <h3 className="text-3xl font-bold mb-4">{story.name}</h3>
                          <p className="text-lg leading-relaxed">
                            "{story.story}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={() => navigateBio("prev")} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white text-blue-800 rounded-full shadow-lg hover:bg-blue-50 transition-colors z-10"
            aria-label="Previous"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          <button 
            onClick={() => navigateBio("next")} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white text-blue-800 rounded-full shadow-lg hover:bg-blue-50 transition-colors z-10"
            aria-label="Next"
          >
            <FaChevronRight className="text-xl" />
          </button>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6">
            {biomedicalStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveBioIndex(index)}
                className={`w-3 h-3 mx-2 rounded-full transition-all duration-300 ${
                  index === activeBioIndex 
                    ? "bg-blue-800 w-6" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Featured Alumni Section with Centered Image */}
        <h2 className="text-3xl font-bold text-gray-800 my-12 text-center">Featured Alumni</h2>
        
        <div className="grid grid-cols-1 gap-16 mb-20">
          {featuredAlumni.map((alum, index) => (
            <div key={index} className="relative bg-white rounded-xl shadow-lg overflow-hidden p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left Side Content */}
                <div className="w-full md:w-1/3 order-2 md:order-1">
                  <div className="p-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{alum.name}</h3>
                    <p className="text-lg font-medium text-indigo-600 mb-4">{alum.department}</p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {alum.story.substring(0, alum.story.length / 2)}
                    </p>
                  </div>
                </div>
                
                {/* Centered Image */}
                <div className="w-full md:w-1/3 mx-auto order-1 md:order-2 flex justify-center">
                  <img 
                    src={alum.image} 
                    alt={alum.name}
                    className="w-full h-auto object-contain rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
                    style={{ maxHeight: "1000px" }}
                  />
                </div>
                
                {/* Right Side Content */}
                <div className="w-full md:w-1/3 order-3">
                  <div className="p-4">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {alum.story.substring(alum.story.length / 2)}
                    </p>
                    <div className="mt-4">
                      <Link 
                        to={`#`}
                        className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Read Full Story
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Success Stories */}
        <h2 className="text-3xl font-bold text-gray-800 my-12 text-center">More Success Stories</h2>
        
        <div className="flex flex-col space-y-8 mb-12">
          {otherStories.map((story, index) => (
            <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-64 md:h-auto flex-shrink-0">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{story.name}</h3>
                  <p className="text-lg font-semibold text-indigo-600 mb-4">{story.department}</p>
                  <p className="text-lg text-gray-700 leading-relaxed">{story.story}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl py-12 px-8 text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">Share Your Success Story</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Are you a PAF-IAST alumnus with an inspiring journey? We'd love to feature your story on our website!
          </p>
          <Link 
            to="#" 
            className="inline-block bg-white text-indigo-700 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            Submit Your Story
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img src={pafiast} alt="PAF-IAST Logo" className="h-12 mb-4" />
              <p>&copy; 2025 PAF-IAST Alumni Network. All Rights Reserved.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/alumni" className="hover:text-white transition-colors">Alumni Directory</Link>
              <Link to="/events" className="hover:text-white transition-colors">Events</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SuccessStories;