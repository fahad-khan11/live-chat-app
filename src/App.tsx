import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:3000");

const Chat = () => {
  const [newMessage, setNewMessage] = useState(""); 
  const [chatHistory, setChatHistory] = useState([]); 

  useEffect(() => {
    socket.on("message", (receivedMessage) => {
      setChatHistory((previousMessages) => [...previousMessages, receivedMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendChatMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("message", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h1>WebSocket Chat</h1>
      <div className="messages">
        {chatHistory.map((chatMsg, index) => (
          <p key={index} className="message">{chatMsg}</p>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendChatMessage()} 
        />
        <button onClick={sendChatMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
