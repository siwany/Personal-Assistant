import './App.css';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AllexampleQuestions = [
  "What's her major?",
  "What are her hobbies?",
  "Where is she studying?",
  "What is her research interest?",
  "What kind of music does she like?"
];

const App = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi, I'm Siwan's personal assistant. What would you like to ask about her today?" }
  ]); // Set initial message
  const [input, setInput] = useState(""); // User input
  const [loading, setLoading] = useState(false); // Typing...
  const [exampleQuestions, setExampleQuestions] = useState(AllexampleQuestions.slice(0, 3));

  const messagesEndRef = useRef(null);



  const sendMessage = async (messageFromButton = null) => {
    const message = messageFromButton || input.trim(); // Use button message or user input
    if (!message) return; // Ignore empty message

    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, { sender: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/chat", { message });

      // Add chatbot response to chat
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: "bot", text: response.data.reply } // Bot response
      ]);

      if (messageFromButton) {
        setExampleQuestions(prevQuestions => {
            const remainingQuestions = AllexampleQuestions.filter(q => !prevQuestions.includes(q)); // Find new options
            const newQuestion = remainingQuestions.length > 0 ? remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)] : null;
            return prevQuestions.filter(q => q !== messageFromButton).concat(newQuestion ? [newQuestion] : []);
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: "bot", text: "I don't have enough information to answer this question. Try again!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }, [messages, loading]);

  return (
    <div className="container">
      <h1>💬 Personal Assistant Chatbot</h1>
      <p className="description">Feel free to ask anything about Siwan!</p>

      <div className="chatBox">
      {messages.map((msg, index) => (
      <div key={index} className={msg.sender === "user" ? "userMessage" : "botMessage"}>
        {msg.text}
      </div>
      ))}
      {loading && <div className="botMessage">Typing...</div>}

      <div className="exampleQuestions">
        {exampleQuestions.map((question, index) => (
          <button key={index} className="exampleButton" onClick={() => sendMessage(question)}>
            {question}
          </button>
        ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="inputContainer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Type something..."
          className="input"
        />
        <button onClick={sendMessage} className="sendButton">Send</button>
      </div>
    </div>
  );
}

export default App;
