import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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
      <h1>Chatbot con OpenAI (GPT-4) y LaTeX</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="input-box">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe un mensaje..." />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
