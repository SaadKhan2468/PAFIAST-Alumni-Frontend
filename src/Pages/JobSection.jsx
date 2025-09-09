import React, { useState, useEffect } from 'react';

const JobSection = () => {
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentJob, setCurrentJob] = useState({
        id: '',
        job_title: '',
        organization: '',
        joining_date: '',
        job_description: ''
    });

    // Fetch jobs on component mount
    useEffect(() => {
    const fetchJobs = async () => {
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch("http://localhost:5000/api/jobs", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) {
                // Handle server errors (4xx/5xx responses)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Empty array is a valid response when no jobs exist
            setJobs(data);
            
        } catch (error) {
            // Only show error for actual fetch failures or server errors
            if (error.name !== 'AbortError') { // Ignore abort errors
                console.error("Fetch error:", error);
                // Only show alert for real errors, not empty responses
                if (!error.message.includes('404')) {
                    alert("Failed to load jobs");
                }
            }
        }
    };
    
    fetchJobs();
}, []);

    const handleChange = (e) => {
        setCurrentJob({
            ...currentJob,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        try {
            let response;
            const formattedJob = {
                ...currentJob,
                joining_date: new Date(currentJob.joining_date).toISOString().split('T')[0]
            };

            if (editMode && currentJob.id) {
                response = await fetch(`http://localhost:5000/api/jobs/${currentJob.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formattedJob)
                });
            } else {
                response = await fetch("http://localhost:5000/api/jobs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formattedJob)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save job');
            }

            const responseData = await response.json();
            
            if (editMode) {
                setJobs(jobs.map(item => 
                    item.id === currentJob.id ? responseData : item
                ));
            } else {
                setJobs([...jobs, responseData]);
            }
            
            resetForm();
            alert(editMode ? "Job updated successfully!" : "Job saved successfully!");
        } catch (error) {
            console.error("Submission error:", error);
            alert(error.message || "Failed to save job");
        }
    };

    const resetForm = () => {
        setCurrentJob({
            id: '',
            job_title: '',
            organization: '',
            joining_date: '',
            job_description: ''
        });
        setEditMode(false);
        setShowForm(false);
    };

    const editJob = (job) => {
        setCurrentJob({
            ...job,
            joining_date: job.joining_date ? job.joining_date.split('T')[0] : ''
        });
        setEditMode(true);
        setShowForm(true);
    };

    return (
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Employment History</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="text-blue-500 text-lg"
                >
                    {showForm ? '-' : '+'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <input
                        type="text"
                        name="job_title"
                        placeholder="Job Title"
                        value={currentJob.job_title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="organization"
                        placeholder="Organization Name"
                        value={currentJob.organization}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="date"
                        name="joining_date"
                        placeholder="Joining Date"
                        value={currentJob.joining_date}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <textarea
                        name="job_description"
                        placeholder="Job Description"
                        value={currentJob.job_description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows="4"
                    />
                    
                    <div className="flex space-x-2">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            {editMode ? 'Update' : 'Save'}
                        </button>
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {jobs.length > 0 && (
                <div className="mt-4 space-y-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{job.job_title}</h3>
                                    <p className="text-gray-600">{job.organization}</p>
                                    <p className="text-sm text-gray-500">
                                        Joined: {job.joining_date}
                                    </p>
                                    <p className="mt-2">{job.job_description}</p>
                                </div>
                                <button 
                                    onClick={() => editJob(job)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobSection;