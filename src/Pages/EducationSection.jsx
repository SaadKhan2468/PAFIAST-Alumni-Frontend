import React, { useState, useEffect } from 'react';

const EducationSection = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEducationData, setHasEducationData] = useState(false);
  const [education, setEducation] = useState({
    matricInstitute: '',
    matricDegree: '',
    matricYear: '',
    matricPercentage: '',
    fscInstitute: '',
    fscDegree: '',
    fscYear: '',
    fscPercentage: '',
  });

  // Fetch existing education data on component mount
  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/education`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok && Object.keys(data).length > 0) {
        setEducation({
          matricInstitute: data.matric_institute || '',
          matricDegree: data.matric_degree || '',
          matricYear: data.matric_year || '',
          matricPercentage: data.matric_percentage || '',
          fscInstitute: data.fsc_institute || '',
          fscDegree: data.fsc_degree || '',
          fscYear: data.fsc_year || '',
          fscPercentage: data.fsc_percentage || '',
        });
        setHasEducationData(true);
      }
    } catch (error) {
      console.error("Error fetching education data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleChange = (e) => {
    setEducation({ ...education, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(education),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Education details saved successfully!");
        setHasEducationData(true);
        setIsFormVisible(false);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving education details:", error);
      alert("Failed to save education details.");
    }
  };

  // Function to render education details when available
  const renderEducationDetails = () => {
    return (
      <div className="mt-4">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold">Matriculation</h3>
          <p><strong>Institute:</strong> {education.matricInstitute}</p>
          <p><strong>Degree:</strong> {education.matricDegree}</p>
          <p><strong>Year:</strong> {education.matricYear}</p>
          <p><strong>Percentage:</strong> {education.matricPercentage}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">FSC / O-A Level</h3>
          <p><strong>Institute:</strong> {education.fscInstitute}</p>
          <p><strong>Degree:</strong> {education.fscDegree}</p>
          <p><strong>Year:</strong> {education.fscYear}</p>
          <p><strong>Percentage:</strong> {education.fscPercentage}</p>
        </div>
        
        <button 
          onClick={() => setIsFormVisible(true)} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit Education Details
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education</h2>
        {!hasEducationData && !isFormVisible && (
          <button onClick={toggleForm} className="text-blue-500 text-lg">+</button>
        )}
        {isFormVisible && (
          <button onClick={toggleForm} className="text-blue-500 text-lg">-</button>
        )}
      </div>
      
      {isLoading ? (
        <div className="mt-4 text-center">Loading education data...</div>
      ) : (
        <>
          {hasEducationData && !isFormVisible && renderEducationDetails()}
          
          {isFormVisible && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <h3 className="text-lg font-semibold">Matriculation</h3>
              <input 
                type="text" 
                name="matricInstitute" 
                value={education.matricInstitute}
                placeholder="Institute Name" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
              />
              <input 
                type="text" 
                name="matricDegree" 
                value={education.matricDegree}
                placeholder="Degree Type" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
              />
              <input 
                type="number" 
                name="matricYear" 
                value={education.matricYear}
                placeholder="Graduation Year" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
              />
              <input 
                type="text" 
                name="matricPercentage" 
                value={education.matricPercentage}
                placeholder="Percentage" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
              />
              
              <h3 className="text-lg font-semibold">FSC / O-A Level</h3>
              <input 
                type="text" 
                name="fscInstitute" 
                value={education.fscInstitute}
                placeholder="Institute Name" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
              />
              <input 
                type="text" 
                name="fscDegree" 
                value={education.fscDegree}
                placeholder="Degree Type" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
              />
              <input 
                type="number" 
                name="fscYear" 
                value={education.fscYear}
                placeholder="Graduation Year" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
              />
              <input 
                type="text" 
                name="fscPercentage" 
                value={education.fscPercentage}
                placeholder="Percentage" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
              />
              
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {hasEducationData ? 'Update' : 'Save'}
              </button>
              
              {hasEducationData && (
                <button 
                  type="button" 
                  onClick={() => setIsFormVisible(false)} 
                  className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default EducationSection;