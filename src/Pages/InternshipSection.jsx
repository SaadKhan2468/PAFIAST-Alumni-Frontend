import React, { useState, useEffect } from 'react';

const InternshipSection = () => {
    const [internships, setInternships] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentInternship, setCurrentInternship] = useState({
        id: '',
        title: '',
        company: '',
        duration: '',
        start_date: '',
        end_date: '',
        description: '',
        paid: false
    });

    // Fetch internships on component mount
    useEffect(() => {
    const fetchInternships = async () => {
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/internships`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            
            const data = await response.json();
            setInternships(data);
        } catch (error) {
            // Only show error if it's not a 404
            if (error.message !== 'Failed to fetch' || error.response?.status !== 404) {
                console.error("Fetch error:", error);
                alert("Failed to load internships");
            }
        }
    };
    
    fetchInternships();
}, []);

    const handleChange = (e) => {
        setCurrentInternship({
            ...currentInternship,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        try {
            // Format dates properly
            const formattedInternship = {
                ...currentInternship,
                start_date: new Date(currentInternship.start_date).toISOString().split('T')[0],
                end_date: new Date(currentInternship.end_date).toISOString().split('T')[0]
            };
            
            // Determine if we're creating a new record or updating an existing one
            let response;
            if (editMode && currentInternship.id) {
                // Update existing internship
                response = await fetch(`${process.env.REACT_APP_API_URL}/api/internships/${currentInternship.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formattedInternship)
                });
            } else {
                // Create new internship
                response = await fetch(`${process.env.REACT_APP_API_URL}/api/internships`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formattedInternship)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save internship');
            }

            const responseData = await response.json();
            
            if (editMode) {
                // Update the internship in the local state
                setInternships(internships.map(item => 
                    item.id === currentInternship.id ? responseData : item
                ));
            } else {
                // Add the new internship to the local state
                setInternships([...internships, responseData]);
            }
            
            resetForm();
            alert(editMode ? "Internship updated successfully!" : "Internship saved successfully!");
        } catch (error) {
            console.error("Submission error:", error);
            alert(error.message || "Failed to save internship");
        }
    };

    const resetForm = () => {
        setCurrentInternship({
            id: '',
            title: '',
            company: '',
            duration: '',
            start_date: '',
            end_date: '',
            description: '',
            paid: false
        });
        setEditMode(false);
        setShowForm(false);
    };

    const editInternship = (internship) => {
        // Ensure dates are in the correct format for input fields (YYYY-MM-DD)
        const formattedInternship = {
            ...internship,
            start_date: internship.start_date ? internship.start_date.split('T')[0] : '',
            end_date: internship.end_date ? internship.end_date.split('T')[0] : ''
        };
        
        setCurrentInternship(formattedInternship);
        setEditMode(true);
        setShowForm(true);
    };

    return (
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Internships</h2>
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
                        name="title"
                        placeholder="Internship Title"
                        value={currentInternship.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={currentInternship.company}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration (e.g., 3 months)"
                        value={currentInternship.duration}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            name="start_date"
                            placeholder="Start Date"
                            value={currentInternship.start_date}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                        <input
                            type="date"
                            name="end_date"
                            placeholder="End Date"
                            value={currentInternship.end_date}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={currentInternship.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows="4"
                    />
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="paid"
                            checked={currentInternship.paid}
                            onChange={handleChange}
                            className="form-checkbox"
                        />
                        <span>Paid Internship</span>
                    </label>
                    
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

            {internships.length > 0 && (
                <div className="mt-4 space-y-4">
                    {internships.map((internship) => (
                        <div key={internship.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{internship.title}</h3>
                                    <p className="text-gray-600">{internship.company}</p>
                                    <p className="text-sm text-gray-500">
                                        {internship.start_date} - {internship.end_date} ({internship.duration})
                                    </p>
                                    <p className="mt-2">{internship.description}</p>
                                    <span className={`px-2 py-1 rounded ${internship.paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {internship.paid ? "Paid" : "Unpaid"}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => editInternship(internship)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                    {/* Delete button removed */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InternshipSection;