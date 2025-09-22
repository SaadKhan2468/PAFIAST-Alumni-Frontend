import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import pafiast from './images/pafiast.png';

const ECardSection = () => {
  const [user, setUser] = useState({
    name: '',
    registrationNumber: '',
    department: '',
    graduationYear: '',
    profilePicture: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [cardRequested, setCardRequested] = useState(false);
  const [cardStatus, setCardStatus] = useState(null);
  const [requestMessage, setRequestMessage] = useState({ type: '', text: '' });
  const [showViewCard, setShowViewCard] = useState(false);
  const cardRef = useRef(null);
  const viewCardRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    checkCardStatus();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUser({
        name: response.data.name || 'N/A',
        registrationNumber: response.data.registrationNumber || 'N/A',
        department: response.data.department || 'N/A',
        graduationYear: response.data.graduationYear || 'N/A',
        profilePicture: response.data.profilePicture || null
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data");
      setIsLoading(false);
    }
  };

  const checkCardStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ecard/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.exists) {
        setCardRequested(true);
        setCardStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error checking card status:", error);
    }
  };

  const handleApplyClick = () => {
    setShowPreview(true);
  };

  const handleRequestCard = async () => {
    setRequestMessage({ type: '', text: '' });
    const token = localStorage.getItem("token");
    
    try {
      const canvas = await html2canvas(cardRef.current);
      const cardImage = canvas.toDataURL('image/png');
      
      const fetchResponse = await fetch(cardImage);
      const blob = await fetchResponse.blob();
      
      const formData = new FormData();
      formData.append('cardImage', blob, 'ecard.png');
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ecard/request`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRequestMessage({ type: 'success', text: 'E-Card requested successfully. You will be notified once it is approved.' });
      setCardRequested(true);
      setCardStatus('pending');
      setTimeout(() => {
        setShowPreview(false);
      }, 3000);
    } catch (error) {
      console.error("Error requesting E-Card:", error);
      setRequestMessage({ type: 'error', text: 'Failed to request E-Card. Please try again later.' });
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setRequestMessage({ type: '', text: '' });
  };

  const handleViewCard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ecard/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Expecting a file/blob response
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ecard_preview.png'); // Temporary preview file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setShowViewCard(true); // Show the preview modal
    } catch (error) {
      console.error("Error viewing E-Card:", error);
      setError("Failed to load E-Card preview. Please ensure the card is approved and try again.");
    }
  };

  const handleDownloadCard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ecard/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Expecting a file/blob response
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PAFIAST_E-Card.png'); // Final download file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading E-Card:", error);
      setError("Failed to download E-Card. Please ensure the card is approved and try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Error Loading Data</h2>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">PAFIAST Alumni E-Card</h2>
      
      {cardRequested ? (
        <div className="text-center">
          <div className={`p-4 mb-6 rounded ${
            cardStatus === 'approved' ? 'bg-green-100' : 
            cardStatus === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <p className="font-semibold">
              {cardStatus === 'approved' ? 'Your E-Card has been approved!' : 
               cardStatus === 'rejected' ? 'Your E-Card request was rejected.' : 
               'Your E-Card request is pending approval.'}
            </p>
            {cardStatus === 'approved' && (
              <div className="mt-3 space-x-4">
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleViewCard}
                >
                  View E-Card
                </button>
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleDownloadCard}
                >
                  Download E-Card
                </button>
              </div>
            )}
            {cardStatus === 'rejected' && (
              <button 
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  setCardRequested(false);
                  setCardStatus(null);
                }}
              >
                Apply Again
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-6">
            Get your official PAFIAST Alumni E-Card that certifies you as a graduate of our institution.
            This digital card can be used for identification and to access alumni benefits.
          </p>
          
          <button 
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleApplyClick}
          >
            Apply for E-Card
          </button>
        </div>
      )}
      
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full">
            <h3 className="text-xl font-semibold mb-4">E-Card Preview</h3>
            
            {requestMessage.text && (
              <div className={`mb-4 p-3 rounded ${
                requestMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {requestMessage.text}
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please verify your information below. This E-Card will be reviewed by administration before approval.
              </p>
            </div>
            
            <div 
              ref={cardRef}
              className="border-4 border-blue-800 rounded-lg p-4 mb-6 bg-gradient-to-r from-blue-50 to-gray-50"
              style={{ width: '360px', margin: '0 auto' }}
            >
              <div className="flex justify-between items-start mb-4">
                <img src={pafiast} alt="PAFIAST Logo" className="w-16 h-16" />
                <div className="text-center">
                  <h4 className="font-bold text-blue-800">PAF-IAST</h4>
                  <p className="text-xs">ALUMNI IDENTIFICATION CARD</p>
                </div>
                <div className="w-16"></div>
              </div>
              
              <div className="flex mb-4">
                <div className="mr-4">
                  <div className="w-24 h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img 
                        src={`${process.env.REACT_APP_API_URL}${user.profilePicture}`} 
                        alt="Profile" 
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Photo</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Reg. Number</p>
                    <p className="font-medium">{user.registrationNumber}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium">{user.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Graduation Year</p>
                    <p className="font-medium">{user.graduationYear}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>This card is the property of PAF-IAST</p>
                <p>Valid until: {new Date().getFullYear() + 5}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showViewCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full">
            <h3 className="text-xl font-semibold mb-4">E-Card View</h3>
            <div ref={viewCardRef} className="border-4 border-blue-800 rounded-lg p-4 mb-6 bg-gradient-to-r from-blue-50 to-gray-50">
              <div className="flex justify-between items-start mb-4">
                <img src={pafiast} alt="PAFIAST Logo" className="w-16 h-16" />
                <div className="text-center">
                  <h4 className="font-bold text-blue-800">PAF-IAST</h4>
                  <p className="text-xs">ALUMNI IDENTIFICATION CARD</p>
                </div>
                <div className="w-16"></div>
              </div>
              
              <div className="flex mb-4">
                <div className="mr-4">
                  <div className="w-24 h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img 
                        src={`${process.env.REACT_APP_API_URL}${user.profilePicture}`} 
                        alt="Profile" 
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Photo</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Reg. Number</p>
                    <p className="font-medium">{user.registrationNumber}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium">{user.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Graduation Year</p>
                    <p className="font-medium">{user.graduationYear}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>This card is the property of PAF-IAST</p>
                <p>Valid until: {new Date().getFullYear() + 5}</p>
              </div>
            </div>
            <button
              onClick={() => setShowViewCard(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ECardSection;