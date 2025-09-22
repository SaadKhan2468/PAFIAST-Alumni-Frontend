import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    profilePicture: null,
    certificates: null,
    isEmployed: false,
    lookingForJob: false,
  });

  const [user, setUser] = useState({
    name: "",
    profilePicture: null,
    whatsapp: "",
    isEmployed: false,
    lookingForJob: false,
    certificates: null
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
  } catch (e) {
    localStorage.removeItem("token");
    navigate("/login");
    return;
  }
    // Handle back button press
    const handleBackButton = (e) => {
      e.preventDefault();
      const confirmLogout = window.confirm("You will be logged out. Are you sure you want to go back?");
      
      if (confirmLogout) {
        // Clear token and other auth data
        localStorage.removeItem("token");
        // Navigate to login page
        navigate("/");
      }
    };

    // Add event listeners
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    // Fetch user profile
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile", error);
        });
    }

    // Cleanup event listeners
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name || user.name || "");
    formDataObj.append("whatsapp", formData.whatsapp || user.whatsapp || "");
    formDataObj.append("isEmployed", formData.isEmployed ?? user.isEmployed);
    formDataObj.append("lookingForJob", formData.lookingForJob ?? user.lookingForJob);

    if (formData.profilePicture) {
      formDataObj.append("profilePicture", formData.profilePicture);
    }

    if (formData.certificates) {
      formDataObj.append("certificates", formData.certificates);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/profile`, formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      navigate("/profilehome");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 shadow-md rounded-md w-full max-w-4xl flex flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/4 flex flex-col items-center mb-6 md:mb-0">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
            {user.profilePicture ? (
              <img
                src={`${process.env.REACT_APP_API_URL}${user.profilePicture}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4"
          />
        </div>

        <div className="w-full md:w-3/4 pl-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name || user.name || ""}
                onChange={handleChange}
                className="border p-2 w-full mt-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">WhatsApp Number:</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp || user.whatsapp || ""}
                onChange={handleChange}
                className="border p-2 w-full mt-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Certificates (PDF):</label>
              <input
                type="file"
                name="certificates"
                accept=".pdf"
                onChange={handleFileChange}
                className="border p-2 w-full mt-2"
              />
              {user.certificates && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-600">Current Certificate:</p>
                  <a
                    href={`${process.env.REACT_APP_API_URL}${user.certificates}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 block mt-1"
                  >
                    View Certificate
                  </a>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="isEmployed"
                  checked={formData.isEmployed ?? user.isEmployed}
                  onChange={handleChange}
                  className="mr-2"
                />
                Currently Employed
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="lookingForJob"
                  checked={formData.lookingForJob ?? user.lookingForJob}
                  onChange={handleChange}
                  className="mr-2"
                />
                Looking for a Job
              </label>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;