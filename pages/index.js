import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    if (data.response) {
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    }
  };

  return (
    <div className="container">
      <h1>Chatbot Gemini</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe un mensaje..." />
        <button onClick={sendMessage}>Enviar</button>
      </div>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .chat-box {
          height: 400px;
          overflow-y: auto;
          border: 1px solid #ccc;
          padding: 10px;
        }
        .user-message {
          text-align: right;
          background-color: #d1e7dd;
          padding: 5px;
          border-radius: 5px;
          margin: 5px;
        }
        .bot-message {
          text-align: left;
          background-color: #f8d7da;
          padding: 5px;
          border-radius: 5px;
          margin: 5px;
        }
        .input-box {
          display: flex;
          margin-top: 10px;
        }
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          margin-left: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
