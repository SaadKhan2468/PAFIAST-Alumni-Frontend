import React from 'react';
import AppBar from "./AppBar";

const Newsfeed = () => {
  return (
    <>
    <AppBar />
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 px-6 flex justify-between items-center w-full">
        <h1 className="text-xl font-bold text-blue-600">LinkedIn Newsfeed</h1>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-20 flex flex-col items-center space-y-8">
        
        {/* Example Embedded LinkedIn Posts */}
        <div className="bg-white p-4 shadow-md rounded-lg w-full max-w-2xl">
          <h2 className="text-lg font-semibold mb-2">Latest LinkedIn Updates</h2>

          {/* LinkedIn Post Embed (Replace URL with your LinkedIn post link) */}
           <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7290234753352364032" height="983" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
        <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7286466809942151168" height="524" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
        <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7287402822877270018" height="795" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-4 w-full mt-auto">
        <p>&copy; 2025 PAF-IAST Alumni Network. All Rights Reserved.</p>
      </footer>

    </div>
    </>
  );
};

export default Newsfeed;

