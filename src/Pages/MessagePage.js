import React from "react";
import { Link } from "react-router-dom";
import pafiast from "./images/pafiast.png";
import RectorImage from "./images/rector.jpg";
import PresidentImage from "./images/president.jpg";
import AppBar from "./AppBar";

const MessagePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />

      {/* Content Section */}
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        {/* Rector's Message */}
        <section className="flex flex-col md:flex-row items-start my-12">
          <div className="md:w-1/3 sticky top-24 h-full pr-4">
            <img src={RectorImage} alt="Rector" className="w-full h-auto object-cover rounded-lg shadow-xl" />
          </div>
          <div className="md:w-2/3 text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Message from the Rector</h2>
            <p className="text-lg text-gray-700">
              Being one of the pioneer members of the project team, I must say that inception of Pak-Austria Fachhochschule Institute of Applied Sciences and Technology is like a dream come true. I take immense pride in being appointed as the first Rector of the Institute.
              <br /><br />
              Today, knowledge along with skill is the key difference between developed and underdeveloped economies. Pakistan lacks in adequately trained and skilled work force in production sector, keeping it behind others. To become a developed economy, it is imperative for the nation to invest in and leverage its engineering sector. The existing engineering and technology curricula do not adequately cater to the needs of our industry mainly due to the lack of practical skills of graduates. Being cognizant of the fact, PAF-IAST is all set to change this rut through a conscious effort by tying practical skills and industry engagement to its Bachelor and Master degree programs.
              <br /><br />
              A purpose-built campus, with state-of-the-art facilities for interactive learning through smart classrooms and advanced laboratory equipment has been established at Mang, Haripur.
              <br /><br />
              With the launch of five programs at the bachelor’s degree level in collaboration with Austrian Universities of Applied Sciences, the Institute has created history as it aims to champion the applied engineering, science, and technology education in the country. For the first time, the course curricula will be augmented with lectures and seminars delivered by the industry professionals while the laboratory work will also incorporate application-oriented approach. In addition, the students will be required to undergo several internships in industry during their studies. The academic programs are delivered by highly qualified 100% PhD faculty that has been trained by the foreign partners. In addition, a new concept of ‘Professors of Practice’ has been introduced to bring the applied industrial approach to the classrooms that will also promote linkage with the industry.
              <br /><br />
              In addition, research centers in selected applied fields encompassing railway engineering, mineral resource engineering, food processing & packaging technologies and artificial intelligence are being established in collaboration with leading Chinese universities. One of the centers called the ‘Sino-Pak Center for Artificial Intelligence’ has already started to function with state-of-the-art facilities and highly qualified Ph.D. faculty.
              <br /><br />
              The centerpiece of PAF-IAST is the Technology Park, built to cultivate innovation and to promote new start-up companies with close linkages with the Austrian, Chinese and Pakistani industries. Emphasis will be on applied research of industrial importance. The aim will be to foster the development and manufacture of innovative products both for the local market of Pakistan and for export.
            </p>
          </div>
        </section>

        {/* President's Message */}
        <section className="flex flex-col md:flex-row items-start my-12">
          <div className="md:w-1/3 sticky top-24 h-full pr-4">
            <img src={PresidentImage} alt="President" className="w-full h-auto object-cover rounded-lg shadow-xl" />
          </div>
          <div className="md:w-2/3 text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Message from the President</h2>
            <p className="text-lg text-gray-700">
              Dear Alumni and Students of PAF-IAST,
              <br /><br />
              I hope this message finds you in great spirits! It is an absolute honor to serve as the founding and interim president of the Pak-Austria Fachhochschule Alumni Association. Together, we have a shared history, and more importantly, a shared responsibility to shape a brighter future for all those who have walked and will walk the halls of our beloved institute.
              <br /><br />
              As a unified community, we will continue to push for stronger collaboration between the institute and industry, which is key to creating more meaningful opportunities for graduates. I also believe in the importance of expanding our international outreach to open doors for further education and global opportunities for all.
              <br /><br />
              In the spirit of progress, I encourage everyone to stay engaged with the alumni network. Your feedback, insights, and participation are invaluable as we advocate for positive changes. We have immense potential, and together, we can shape the future of PAF-IAST and contribute to the success of current and future students.
              <br /><br />
              To the students, I send my best wishes for your academic and professional journey. Your time at PAF-IAST is an important chapter, and we, as your alumni family, are here to support and guide you through it.
              <br /><br />
              Let’s move forward with optimism, determination, and a shared vision for excellence.
              <br /><br />
              <strong>Warm regards,</strong>
              <br />
              <strong>Muhammad Saud Ali</strong>
              <br />
              Interim President
              <br />
              Pak-Austria Fachhochschule Alumni Association
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center w-full">
        <p>&copy; 2025 PAF-IAST Alumni Network. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default MessagePage;
