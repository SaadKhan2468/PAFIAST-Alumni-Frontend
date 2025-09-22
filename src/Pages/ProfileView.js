import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfileView = () => {
  const { registrationNumber } = useParams();
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState(null);
  const [internships, setInternships] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = `${process.env.REACT_APP_API_URL}/api`;
        
        const responses = await Promise.all([
          axios.get(`${baseUrl}/profile/${registrationNumber}`),
          axios.get(`${baseUrl}/education/${registrationNumber}`),
          axios.get(`${baseUrl}/internships/${registrationNumber}`),
          axios.get(`${baseUrl}/projects/${registrationNumber}`),
          axios.get(`${baseUrl}/skills/${registrationNumber}`),
          axios.get(`${baseUrl}/achievements/${registrationNumber}`),
        ]);

        setProfile(responses[0].data);
        setEducation(responses[1].data);
        setInternships(responses[2].data);
        setProjects(responses[3].data);
        setSkills(responses[4].data);
        setAchievements(responses[5].data);

      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [registrationNumber]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 shrink-0">
            {profile.profilePicture ? (
              <img 
                src={`${process.env.REACT_APP_API_URL}${profile.profilePicture}`} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.name}</h1>
            <div className="text-lg text-gray-600 space-y-1">
              <p><span className="font-semibold">Department:</span> {profile.department}</p>
              <p><span className="font-semibold">Graduation Year:</span> {profile.graduationYear}</p>
              <p><span className="font-semibold">Status:</span> {profile.isEmployed ? "Employed" : "Seeking Opportunities"}</p>
              {profile.whatsapp && (
                <p><span className="font-semibold">WhatsApp:</span> {profile.whatsapp}</p>
              )}
            </div>
          </div>
        </div>

        {/* Education Section */}
        <Section title="Education">
          {education ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard 
                title="Matriculation"
                items={[
                  `Institute: ${education.matric_institute || 'N/A'}`,
                  `Year: ${education.matric_year || 'N/A'}`,
                  `Percentage: ${education.matric_percentage || 'N/A'}%`
                ]}
              />
              <InfoCard 
                title="Intermediate"
                items={[
                  `Institute: ${education.fsc_institute || 'N/A'}`,
                  `Year: ${education.fsc_year || 'N/A'}`,
                  `Percentage: ${education.fsc_percentage || 'N/A'}%`
                ]}
              />
            </div>
          ) : <EmptyState message="No education details available" />}
        </Section>

        {/* Skills Section */}
        <Section title="Skills">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : <EmptyState message="No skills listed" />}
        </Section>

        {/* Internships Section */}
        <Section title="Internships">
          {internships.length > 0 ? (
            internships.map(internship => (
              <ExperienceCard
                key={internship.id}
                title={internship.title}
                subtitle={internship.company}
                duration={`${formatDate(internship.start_date)} - ${formatDate(internship.end_date)}`}
                description={internship.description}
                meta={`${internship.paid ? 'Paid' : 'Unpaid'} • ${internship.duration}`}
              />
            ))
          ) : <EmptyState message="No internships listed" />}
        </Section>

        {/* Projects Section */}
        <Section title="Projects">
          {projects.length > 0 ? (
            projects.map(project => (
              <ExperienceCard
                key={project.id}
                title={project.project_title}
                subtitle={`Duration: ${project.months_taken} months`}
                duration={`Completed: ${formatDate(project.completion_date)}`}
                description={project.project_description}
              />
            ))
          ) : <EmptyState message="No projects listed" />}
        </Section>

        {/* Achievements Section */}
        <Section title="Achievements">
          {achievements.length > 0 ? (
            achievements.map(achievement => (
              <div key={achievement.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-lg">{achievement.title}</h3>
                <p className="text-gray-600 mt-1">{achievement.details}</p>
                {achievement.file_path && (
                  <a
                    href={`${process.env.REACT_APP_API_URL}/uploads/${achievement.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  >
                    View Document
                  </a>
                )}
              </div>
            ))
          ) : <EmptyState message="No achievements listed" />}
        </Section>
      </div>
    </div>
  );
};

// Reusable Components
const Section = ({ title, children }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4 border-b pb-2">{title}</h2>
    {children}
  </div>
);

const InfoCard = ({ title, items }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600">{item}</li>
      ))}
    </ul>
  </div>
);

const ExperienceCard = ({ title, subtitle, duration, description, meta }) => (
  <div className="bg-gray-50 p-4 rounded-lg mb-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
        <p className="text-sm text-gray-500 mt-1">{duration}</p>
        {description && <p className="mt-2 text-gray-600">{description}</p>}
      </div>
      {meta && <span className="text-sm text-gray-500">{meta}</span>}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-4 text-gray-500">{message}</div>
);

// Helper function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default ProfileView;