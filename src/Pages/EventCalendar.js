import React, { useState, useEffect } from "react";
import axios from "axios";
import AppBar from "./AppBar";

import Calendar1 from "./images/calendar1.jpg";
import Calendar2 from "./images/calendar2.jpg";
import Calendar3 from "./images/calendar3.jpg";
import Calendar4 from "./images/calendar4.jpg";


const EventCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      image: Calendar1,
      date: "Feb 10, 2025",
      time: "10:00 AM - 12:00 PM",
      description: "Alumni Meetup - Connect and network with fellow alumni.",
      registeredUsers: []
    },
    {
      id: 2,
      image: Calendar2,
      date: "Feb 15, 2025",
      time: "02:00 PM - 04:00 PM",
      description: "Tech Talk - Latest trends in AI and Machine Learning.",
      registeredUsers: []
    },
    {
      id: 3,
      image: Calendar3,
      date: "Feb 20, 2025",
      time: "05:00 PM - 07:00 PM",
      description: "Career Guidance - Get insights from industry experts.",
      registeredUsers: []
    },
    {
      id: 4,
      image: Calendar4,
      date: "Feb 25, 2025",
      time: "06:00 PM - 08:00 PM",
      description: "Startup Pitch - Showcase your innovative ideas.",
      registeredUsers: []
    }
  ]);

  const [userProfile, setUserProfile] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    }
  };

  const handleRegistration = (eventId) => {
    if (!userProfile) {
      alert("Please log in to register for events");
      return;
    }

    // Update the events state to include the new registration
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId) {
          const isAlreadyRegistered = event.registeredUsers.includes(userProfile.name);
          if (!isAlreadyRegistered) {
            return {
              ...event,
              registeredUsers: [...event.registeredUsers, userProfile.name]
            };
          }
        }
        return event;
      })
    );

    // Set registration status for this event
    setRegistrationStatus(prev => ({
      ...prev,
      [eventId]: true
    }));

    // Show success message
    alert(`Registration successful!\nName: ${userProfile.name}\nEvent: ${events.find(e => e.id === eventId).description}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
  <>
  <AppBar />
  
      <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <div key={event.id} className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Date Tag */}
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded">
              {event.date}
            </div>

            {/* Event Image */}
            <img src={event.image} alt="Event" className="w-full h-40 object-cover" />

            {/* Event Details */}
            <div className="p-4">
              <p className="text-gray-700 text-sm font-semibold">{event.time}</p>
              <p className="text-gray-600 text-sm mt-1 mb-4">{event.description}</p>
              
              {registrationStatus[event.id] ? (
                <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm text-center">
                  You are registered!
                </div>
              ) : (
                <button
                  onClick={() => handleRegistration(event.id)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default EventCalendar;