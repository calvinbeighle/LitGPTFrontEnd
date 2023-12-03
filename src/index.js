import React, { useState } from "react";
import ReactDOM from "react-dom";

import BotMessage from "./components/BotMessage";
import UserMessage from "./components/UserMessage";
import Messages from "./components/Messages";
import Input from "./components/Input";
import API from "./ChatbotAPI";
import Header from "./components/Header";

// Correct Image Import
import chatbotImage from './images/ProteinImage.jpeg'; // Adjust the path as needed

import "./styles.css";

function Chatbot() {
  const [messages, setMessages] = useState([]);

  const send = async text => {
    const newMessages = messages.concat(
      <UserMessage key={messages.length + 1} text={text} />,
      <BotMessage
  key={messages.length + 2}
  fetchMessage={async () => {
    const response = await fetch('http://localhost:5000/llm', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let data = await response.json();
  
    if (data === '{LIT}') {
      const litresResponse = await fetch("http://localhost:5000/litsearch");
      data = await litresResponse.json(); // Parse the JSON from the second API call
    } else if (data === '{SIM}') {
      const simResponse = await fetch("http://localhost:5000/sim");
      data = await simResponse.json(); // Parse the JSON from the second API call
    }
  
    return data;
  }}  
/>
    );
    setMessages(newMessages);
  };

  return (
    <div className="chatbot">
      <Header />
      <Messages messages={messages} />
      <Input onSend={send} />
      {/* Displaying the Image */}
      <img src={chatbotImage} alt="Chatbot" /> {/* Adjust the alt text as needed */}
    </div>
  );
}



const rootElement = document.getElementById("root");
ReactDOM.render(<Chatbot />, rootElement);
