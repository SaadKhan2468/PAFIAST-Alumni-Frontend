import alumnicard from './images/alumnicard.jpg';
import React, { useState } from 'react';
import AppBar from "./AppBar";
import { Link } from 'react-router-dom';

const AlumniCard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    cnic: '',
    registrationId: '',
    address: '',
    city: '',
    email: '',
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: formData.name,
          registrationNumber: formData.registrationId,
          graduationYear: formData.graduationYear,
          email: formData.email,
          phone: formData.cnic,  // Using CNIC field as additional identifier
          attestationType: 'Alumni Card Application',
          degreeLevel: 'N/A',
          additionalInfo: `
            Address: ${formData.address}
            City: ${formData.city}
          `
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setShowForm(false);
          setSubmitStatus('');
          setFormData({
            name: '',
            graduationYear: '',
            cnic: '',
            registrationId: '',
            address: '',
            city: '',
            email: '',
          });
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <>
    <AppBar />
    <div className="flex min-h-screen bg-gray-100 p-8">
    
      {/* Left Side: Text Content */}
      <div className="w-1/2 p-6">
        <h1 className="text-3xl font-semibold text-gray-800">PAF-IAST Alumni Card</h1>
        <p className="mt-4 text-gray-600">
          The PAF-IAST Alumni Card grants exclusive benefits to graduates, including access to networking events, library privileges, and discounts on various services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 text-gray-700">Benefits of Alumni Card</h2>
        <ul className="list-disc list-inside mt-3 text-gray-600">
          <li>Access to PAF-IAST campus facilities</li>
          <li>Networking events and career fairs</li>
          <li>Discounts on professional courses and certifications</li>
          <li>Special alumni-only offers</li>
        </ul>

        <div className="mt-6">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Apply for Card
          </button>
        </div>

        <div className="mt-6">
          <Link to="/profilehome" className="text-blue-500 hover:underline">Back to Profile</Link>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="w-1/2 flex justify-center items-center">
        <img src={alumnicard} alt="Alumni Card" className="max-w-full h-auto rounded-lg shadow-lg" />
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Apply for Alumni Card</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full p-2 mb-3 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                placeholder="Graduation Year"
                className="w-full p-2 mb-3 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                placeholder="CNIC"
                className="w-full p-2 mb-3 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="registrationId"
                value={formData.registrationId}
                onChange={handleInputChange}
                placeholder="PAF-IAST Registration Id"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full p-2 mb-3 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={submitStatus === 'sending'}
              >
                {submitStatus === 'sending' ? 'Submitting...' : 'SUBMIT'}
              </button>
              {submitStatus === 'success' && (
                <p className="text-green-500 text-center mt-2">Application submitted successfully!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-center mt-2">Error submitting application. Please try again.</p>
              )}
            </form>
            <button onClick={() => setShowForm(false)} className="mt-4 text-red-500 hover:underline">Cancel</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AlumniCard;