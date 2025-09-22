import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import AlumniPage from "./Pages/alumni";
import LoginPage from "./Pages/LoginPage";
import AboutPage from "./Pages/AboutPage"; 
import Newsfeed from "./Pages/Newsfeed";
import Profile from "./Pages/Profile";
import EventCalendar from "./Pages/EventCalendar";
import Chatbot from "./Pages/Chatbot";
import ProfileHome from "./Pages/ProfileHome";
import AlumniCard from './Pages/AlumniCard';
import Team from "./Pages/Team";
import SignupForm from "./Pages/SignupForm";
import MessagePage from "./Pages/MessagePage";
import SuccessStories from "./Pages/SuccessStories";
import ProfileView from "./Pages/ProfileView";

function App() {
  return (
    <HelmetProvider>
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect Root ("/") to AlumniPage */}
          <Route path="/" element={<Navigate to="/alumni" />} />

          {/* Alumni Page */}
          <Route path="/alumni" element={<AlumniPage />} />

          {/* Other Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/newsfeed" element={<Newsfeed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/eventcalendar" element={<EventCalendar />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profilehome" element={<ProfileHome />} />
          <Route path="/alumni-card" element={<AlumniCard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/signupform" element={<SignupForm />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/successstories" element={<SuccessStories />} />
          <Route path="/profile/:registrationNumber" element={<ProfileView />} />

          {/* 404 Page */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>

        {/* Chatbot Component (Always Visible) */}
        <Chatbot />
      </div>
    </Router>
    </HelmetProvider>
  );
}

export default App;
