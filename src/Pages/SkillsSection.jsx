import React, { useState, useEffect } from 'react';

const SkillsSection = () => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');

    // Fetch skills on component mount
    useEffect(() => {
    const fetchSkills = async () => {
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch("http://localhost:5000/api/skills", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                // Ensure skills is always an array
                const skillsArray = Array.isArray(data.skills) ? data.skills : [];
                setSkills(skillsArray);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setSkills([]); // Set empty array on error
        }
    };
    fetchSkills();
}, []);
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            const updatedSkills = [...skills, newSkill.trim()];
            
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/api/skills", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ skills: updatedSkills })
                });

                if (response.ok) {
                    setSkills(updatedSkills);
                    setNewSkill('');
                }
            } catch (error) {
                console.error("Submission error:", error);
            }
        }
    };

    const deleteSkill = async (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        
        try {
            const token = localStorage.getItem("token");
            await fetch("http://localhost:5000/api/skills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ skills: updatedSkills })
            });
            setSkills(updatedSkills);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a skill and press Enter"
                className="w-full border p-2 rounded mb-4"
            />
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                        <span>{skill}</span>
                        <button 
                            onClick={() => deleteSkill(index)}
                            className="ml-2 text-gray-500 hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsSection;