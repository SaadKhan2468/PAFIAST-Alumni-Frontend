import React, { useState } from "react";
import axios from "axios";
import { FiMessageCircle, FiX } from "react-icons/fi";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you?", from: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
  if (input.trim()) {
    const userMessage = { text: input, from: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        `https://dialogflow.googleapis.com/v2/projects/alumnibot-mijk/agent/sessions/12345:detectIntent`,
        {
          queryInput: {
            text: {
              text: input,
              languageCode: "en",
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ya29.c.c0ASRK0Gb-Xcupab7zkvyJ-4wCQXYK80ehj1MdB90CpGjmLdwSkBK8w_0gWHChTnOelzRZw4KnCZA3-e6772Wz5U0xn_f3qDRKw7PrBLn6Y0gACA-aev3GYEYQjXZF2WFa8PVWJCEYfV8yXVODZKW_ToY7RMLP2AkAFnNCapii70WsJayRI-sAeekFy-_xOcqnFcD6Xqa2sJV46jcg2xWxs-qakMoak2mkSX3RSxyVTfp8q5lF_sDiiEtxy7V6qojdBR0XwmYDAaVrICVgXG8C6ovov2rC5ZoC2eJ-segy4of6unhqd74EEbx64WX8QxxSWN8P0K1JlNpMWO5Ub-ge8CsWlf4WnTXFbQav_qWuf_qhv9SVkZwcrL4G384DS4_en4zJBqjka2ZYl3Qn8xr4UvbIudmtZI-QrunVirgyj5ZQO5aj79uMuyadpbQdQIs74ydtJI9tv2WQz75j65O6k2ttR_16savkIyJ1b6YbtJjrr1qW3ju9SqXR4d_rzeag-I8R633mYlQ-_Bvy-ho7b3ra7wydvxkv0z1jxB3h4ntcRaa2hJc6ir4hk_2l_olOYz68X4560RO1Xcp3-3U03bqfhUsyaRBm1xh4_cyqBV37Y57qjW78Wrbc7Vxsm83M68Wgs6b7Zlqe8VY5djIklvsZfvwr_epZzRbMxjBq1v-5XOx1vu1wlYhdXdp9RF4d4g5q99V_svMam8hubcQpOiXOmBO4Rvzasx1yvFti-yRVxeb3Qtf9Z3xWRzaYgb6tershbQ1RxvhOruItU7B_knt-l-79U60csvj6nOMiRiumRuheaOkmxU2k1U5bOulqeWq9p5Q53BY-7Rf-zfy-UWd5rIaV0FYXYf0JxztJlOt47ufZ52W5cr-ca1m73_6UIlq8yRhaveqa55ObcIM9qJRy8f44FMgQZs7aB1smRZu0Yk5y6ossJqBU843ih3mgdl0BsbZYStVZayoQYsWFYVtoyfzXdqt51yQle4t-er1V-1MX75we_pi`,
            "Content-Type": "application/json",
          },
        }
      );

      const botReply = response.data.queryResult.fulfillmentText;
      setMessages((prev) => [...prev, { text: botReply, from: "bot" }]);
    } catch (error) {
      console.error("Error response:", error.response ? error.response.data : error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't process that.", from: "bot" },
      ]);
    }

    setInput("");
  }
};


  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-yellow-300 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <FiMessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-yellow-300 text-black p-3 flex justify-between items-center">
            Chatbot Assistant
            <button onClick={() => setIsOpen(false)} className="text-white">
              <FiX size={20} />
            </button>
          </div>
          <div className="p-3 h-60 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.from === "bot" ? "text-left" : "text-right"}`}>
                <span
                  className={`inline-block p-2 rounded ${
                    msg.from === "bot" ? "bg-gray-200" : "bg-yellow-300 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex border-t p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 p-1 border rounded"
              placeholder="Type your message..."
            />
            <button onClick={handleSend} className="ml-2 px-3 bg-yellow-300 text-black rounded hover:bg-blue-600 transition">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
