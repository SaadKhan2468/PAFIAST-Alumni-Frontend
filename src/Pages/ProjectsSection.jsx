import React, { useState, useEffect } from 'react';

const ProjectsSection = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    id: null,
    project_title: '',
    project_description: '',
    completion_date: '',
    months_taken: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing projects data on component mount
  useEffect(() => {
    fetchProjectsData();
  }, []);

  const fetchProjectsData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projects`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    if (isFormVisible && isEditing) {
      // If closing form while editing, reset current project
      resetForm();
    }
    setIsFormVisible(!isFormVisible);
  };

  const resetForm = () => {
    setCurrentProject({
      id: null,
      project_title: '',
      project_description: '',
      completion_date: '',
      months_taken: ''
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setCurrentProject({ ...currentProject, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in. Please log in again.");
      return;
    }

    try {
      const url = isEditing 
        ? `${process.env.REACT_APP_API_URL}/api/projects/${currentProject.id}` 
        : `${process.env.REACT_APP_API_URL}/api/projects`;
      
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(currentProject),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(isEditing ? "Project updated successfully!" : "Project added successfully!");
        await fetchProjectsData(); // Refresh projects list
        resetForm();
        setIsFormVisible(false);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project details.");
    }
  };

  const handleEdit = (project) => {
    setCurrentProject({
      id: project.id,
      project_title: project.project_title,
      project_description: project.project_description,
      completion_date: project.completion_date.split('T')[0], // Format date for input field
      months_taken: project.months_taken || ''
    });
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Project deleted successfully!");
        // Remove project from state
        setProjects(projects.filter(project => project.id !== id));
      } else {
        const data = await response.json();
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  // Function to render project cards
  const renderProjects = () => {
    if (projects.length === 0) {
      return <p className="text-gray-500 mt-4">No projects added yet.</p>;
    }

    return (
      <div className="mt-4 space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{project.project_title}</h3>
              <div>
                <button
                  onClick={() => handleEdit(project)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{project.project_description}</p>
            <div className="mt-2 text-gray-600 text-sm">
              <p>Completion Date: {new Date(project.completion_date).toLocaleDateString()}</p>
              {project.months_taken && <p>Time Taken: {project.months_taken} months</p>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button 
          onClick={toggleForm} 
          className="text-blue-500 text-lg"
        >
          {isFormVisible ? '-' : '+'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="mt-4 text-center">Loading projects data...</div>
      ) : (
        <>
          {!isFormVisible && renderProjects()}
          
          {isFormVisible && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input 
                type="text" 
                name="project_title" 
                value={currentProject.project_title}
                placeholder="Project Title" 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                required
              />
              <textarea 
                name="project_description" 
                value={currentProject.project_description}
                placeholder="Project Description" 
                onChange={handleChange} 
                className="w-full border p-2 rounded min-h-[100px]" 
                required
              />
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date
                  </label>
                  <input 
                    type="date" 
                    name="completion_date" 
                    value={currentProject.completion_date}
                    onChange={handleChange} 
                    className="w-full border p-2 rounded" 
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time of Completion (months)
                  </label>
                  <input 
                    type="number" 
                    name="months_taken" 
                    value={currentProject.months_taken}
                    placeholder="Number of months" 
                    onChange={handleChange} 
                    className="w-full border p-2 rounded" 
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? 'Update Project' : 'Add Project'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    resetForm();
                    setIsFormVisible(false);
                  }} 
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsSection;