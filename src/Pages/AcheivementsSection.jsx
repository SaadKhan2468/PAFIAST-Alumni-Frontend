import React, { useState, useEffect } from 'react';

const AchievementsSection = () => {
    const [achievements, setAchievements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAchievement, setCurrentAchievement] = useState({
        id: '',
        title: '',
        details: '',
        file: null,
        file_path: ''
    });

    useEffect(() => {
        const fetchAchievements = async () => {
            const token = localStorage.getItem("token");
            
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/achievements`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                
                const data = await response.json();
                setAchievements(Array.isArray(data) ? data : []);
            } catch (error) {
                // Only show error if it's not a 404
                if (error.message !== 'Failed to fetch' || error.response?.status !== 404) {
                    console.error("Fetch error:", error);
                    alert("Failed to load achievements");
                }
            }
        };
        
        fetchAchievements();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'file') {
            setCurrentAchievement({
                ...currentAchievement,
                file: e.target.files[0]
            });
        } else {
            setCurrentAchievement({
                ...currentAchievement,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        try {
            const formData = new FormData();
            formData.append('title', currentAchievement.title);
            formData.append('details', currentAchievement.details);
            
            if (currentAchievement.file) {
                formData.append('file', currentAchievement.file);
            }
            
            if (editMode && currentAchievement.id) {
                formData.append('id', currentAchievement.id);
                
                // Update existing achievement
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/achievements/${currentAchievement.id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update achievement');
                }
                
                const updatedAchievement = await response.json();
                
                // Update the achievement in the local state
                setAchievements(achievements.map(item => 
                    item.id === currentAchievement.id ? updatedAchievement : item
                ));
                
                alert("Achievement updated successfully!");
            } else {
                // Create new achievement
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/achievements`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to save achievement');
                }
                
                const newAchievement = await response.json();
                
                // Add the new achievement to the local state
                setAchievements([...achievements, newAchievement]);
                
                alert("Achievement saved successfully!");
            }
            
            resetForm();
        } catch (error) {
            console.error("Submission error:", error);
            alert(error.message || "Failed to save achievement");
        }
    };

    const resetForm = () => {
        setCurrentAchievement({
            id: '',
            title: '',
            details: '',
            file: null,
            file_path: ''
        });
        setEditMode(false);
        setShowForm(false);
    };

    const editAchievement = (achievement) => {
        setCurrentAchievement({
            id: achievement.id,
            title: achievement.title,
            details: achievement.details,
            file: null, // Can't restore file input, but we keep the file_path
            file_path: achievement.file_path
        });
        setEditMode(true);
        setShowForm(true);
    };

    return (
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Achievements</h2>
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
                        placeholder="Achievement Title"
                        value={currentAchievement.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <textarea
                        name="details"
                        placeholder="Details"
                        value={currentAchievement.details}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows="4"
                        required
                    />
                    <input
                        type="file"
                        name="file"
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        accept="image/*,application/pdf"
                        // Only required for new achievements
                        required={!editMode}
                    />
                    {editMode && currentAchievement.file_path && (
                        <p className="text-sm text-gray-600">
                            Current file: {currentAchievement.file_path}
                        </p>
                    )}
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

            {achievements.length > 0 && (
                <div className="mt-4 space-y-4">
                    {achievements.map((achievement) => (
                        <div key={achievement.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{achievement.title}</h3>
                                    <p className="text-gray-600 mt-2">{achievement.details}</p>
                                    {achievement.file_path && (
                                        <a
                                            href={`${process.env.REACT_APP_API_URL}/uploads/${achievement.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                                        >
                                            View Certificate
                                        </a>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => editAchievement(achievement)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AchievementsSection;