import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import pafiast from "./images/pafiast.png";
import { useLocation } from "react-router-dom";
import EducationSection from './EducationSection';
import InternshipSection from './InternshipSection';
import ProjectsSection from './ProjectsSection';
import JobSection from './JobSection';
import SkillsSection from './SkillsSection';
import AcheivementsSection from './AcheivementsSection';
import ECardSection from './ECardSection';
import AppBar from './AppBar';

const ProfileHome = () => {
  const [user, setUser] = useState({
    name: '', 
    profilePicture: '',
    whatsapp: '',
    certificates: '',
    isEmployed: false,
    lookingForJob: false,
    registrationNumber: '',
    graduationYear: '',
    department: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newCertificates, setNewCertificates] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: '', text: '' });
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserProfile();
  }, [token]);
  
  const location = useLocation();

  useEffect(() => {
    if (!sessionStorage.getItem('navigationHistory')) {
      sessionStorage.setItem('navigationHistory', JSON.stringify([location.pathname]));
    } else {
      const history = JSON.parse(sessionStorage.getItem('navigationHistory'));
      if (history[history.length - 1] !== location.pathname) {
        history.push(location.pathname);
        sessionStorage.setItem('navigationHistory', JSON.stringify(history));
      }
    }
  }, [location]);
  
  const fetchUserProfile = async () => {
    if (token) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Added console logs to help debug the response
        console.log("Profile API response:", response.data);
        
        // Make sure to properly handle the data
        const userData = {
          ...user,
          ...response.data,
          // Explicitly ensure these fields are set from response
          department: response.data.department || "Not specified",
          graduationYear: response.data.graduationYear || "Not specified"
        };
        
        console.log("Processed user data:", userData);
        
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error("Error fetching profile", error);
        setEditMessage({ type: 'error', text: 'Failed to load profile data' });
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
    setNewProfilePicture(null);
    setNewCertificates(null);
    setEditMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setEditMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('name', editedUser.name || '');
    formData.append('whatsapp', editedUser.whatsapp || '');
    formData.append('isEmployed', editedUser.isEmployed ? 'true' : 'false');
    formData.append('lookingForJob', editedUser.lookingForJob ? 'true' : 'false');
    
    // We're not actually sending these fields back in the update request
    // If you want to update these fields, you should add them to the update route
    // formData.append('department', editedUser.department || '');
    // formData.append('graduationYear', editedUser.graduationYear || '');

    if (newProfilePicture) {
      formData.append('profilePicture', newProfilePicture);
    }
    
    if (newCertificates) {
      formData.append('certificates', newCertificates);
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setEditMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
      fetchUserProfile(); // Refresh the profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      setEditMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };


  // ... Keep all existing useEffect hooks and functions unchanged ...

  const SecondaryAppBar = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-6 py-3">
          <button
            onClick={() => setActiveSection('skills')}
            className={`px-2 py-1 ${
              activeSection === 'skills' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveSection('achievements')}
            className={`px-2 py-1 ${
              activeSection === 'achievements' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveSection('education')}
            className={`px-2 py-1 ${
              activeSection === 'education' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveSection('internship')}
            className={`px-2 py-1 ${
              activeSection === 'internship' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Internships
          </button>
          <button
            onClick={() => setActiveSection('projects')}
            className={`px-2 py-1 ${
              activeSection === 'projects' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveSection('job')}
            className={`px-2 py-1 ${
              activeSection === 'job' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Employment Status
          </button>
          
        </nav>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Header */}
       <div className="fixed w-full top-0 z-50">
      <AppBar />
      <SecondaryAppBar />
    </div>

      {/* Main Content Area */}
     <div className="pt-32">
      <div className="flex p-8 gap-8">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-white rounded-lg shadow-lg p-6 h-fit">
          {/* Keep existing sidebar content unchanged */}
          <div className="flex justify-end mb-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-green-500 hover:text-green-600"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-red-500 hover:text-red-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editMessage.text && (
            <div className={`mb-4 p-2 rounded text-sm ${
              editMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {editMessage.text}
              
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            {/* Keep existing profile picture and edit fields */}
          <div className="relative">
              <img
                src={user.profilePicture ? `${process.env.REACT_APP_API_URL}${user.profilePicture}` : "https://via.placeholder.com/150"}
                alt="User Profile"
                className="w-32 h-32 rounded-full mb-4"
              />
              {isEditing && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-500 mb-1">Update Profile Picture</label>
                  <input
                    type="file"
                    onChange={(e) => setNewProfilePicture(e.target.files[0])}
                    className="text-sm"
                    accept="image/*"
                  />
                </div>
              )}
            </div>
            
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name || ''}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="text-xl font-semibold text-gray-800 text-center border rounded p-1"
                placeholder="Enter your name"
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-800">{user.name || "User Name"}</h3>
            )}
          
          </div>

          <div className="space-y-4">
            {/* Keep existing profile fields */}
          <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{user.department || "Not specified"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Graduation Year</p>
              <p className="font-medium">{user.graduationYear || "Not specified"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">WhatsApp Number</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.whatsapp || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, whatsapp: e.target.value })}
                  className="w-full border rounded p-1"
                  placeholder="Enter WhatsApp number"
                />
              ) : (
                <p className="font-medium">{user.whatsapp || "Not specified"}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Employment Status</p>
              {isEditing ? (
                <select
                  value={editedUser.isEmployed ? "true" : "false"}
                  onChange={(e) => setEditedUser({ ...editedUser, isEmployed: e.target.value === "true" })}
                  className="w-full border rounded p-1"
                >
                  <option value="true">Currently Employed</option>
                  <option value="false">Not Employed</option>
                </select>
              ) : (
                <p className="font-medium">
                  {user.isEmployed ? "Currently Employed" : "Not Employed"}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Job Status</p>
              {isEditing ? (
                <select
                  value={editedUser.lookingForJob ? "true" : "false"}
                  onChange={(e) => setEditedUser({ ...editedUser, lookingForJob: e.target.value === "true" })}
                  className="w-full border rounded p-1"
                >
                  <option value="true">Looking for opportunities</option>
                  <option value="false">Not seeking opportunities</option>
                </select>
              ) : (
                <p className="font-medium">
                  {user.lookingForJob ? "Looking for opportunities" : "Not seeking opportunities"}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Certificates</p>
              {isEditing ? (
                <div>
                  <input
                    type="file"
                    onChange={(e) => setNewCertificates(e.target.files[0])}
                    className="text-sm"
                    accept=".pdf,.doc,.docx"
                  />
                  {user.certificates && (
                    <a
                      href={`${process.env.REACT_APP_API_URL}${user.certificates}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-500 hover:text-blue-600 text-sm mt-2"
                    >
                      View Current Certificates
                    </a>
                  )}

                </div>
              ) : (
                user.certificates && (
                  <a
                    href={`${process.env.REACT_APP_API_URL}${user.certificates}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    View Certificates
                  </a>
                )
              )}
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors mt-4"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1">
          {/* Welcome Message */}
          {!activeSection && (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Alumni Profile</h1>
              <p className="text-gray-600 text-lg">
                Reconnect with your alma mater, network with fellow alumni, and explore exciting opportunities. 
                Select a section from the navigation above to view or edit your profile details.
              </p>
            </div>
          )}

          {/* Dynamic Sections */}
          {activeSection === 'skills' && <SkillsSection />}
          {activeSection === 'achievements' && <AcheivementsSection />}
          {activeSection === 'education' && <EducationSection />}
          {activeSection === 'internship' && <InternshipSection />}
          {activeSection === 'projects' && <ProjectsSection />}
          {activeSection === 'job' && <JobSection />}
          {activeSection === 'ecard' && <ECardSection />}

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelLogout}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Yes, Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfileHome;