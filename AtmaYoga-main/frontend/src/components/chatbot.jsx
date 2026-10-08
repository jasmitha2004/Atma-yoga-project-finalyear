import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { text: userText, type: "user" }
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      console.log("Backend response:", data);

      const newMessages = [];

      // Always show the answer
      if (data.answer) {
        newMessages.push({
          text: data.answer,
          type: "bot",
        });
      }

      // Show asana only if recommended and not null/undefined
      if (data.recommended_asana && data.recommended_asana !== null) {
        newMessages.push({
          text: `🧘 Recommended Asana: ${data.recommended_asana}`,
          type: "bot",
        });
      }

      setMessages((prev) => [...prev, ...newMessages]);

    } catch (err) {
      console.error("Chatbot error:", err);
      let errorMessage = "❌ Sorry, the service is temporarily unavailable.";
      
      // More helpful error message
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        errorMessage = "❌ Cannot connect to the AI service. Please make sure the LLM service is running on port 8001.\n\nTo start it:\n1. Open a terminal\n2. Run: cd yoga_llm_files && python app.py";
      } else if (err.message.includes("Server error")) {
        errorMessage = "❌ The AI service returned an error. Please check the service logs.";
      }
      
      setMessages((prev) => [
        ...prev,
        { 
          text: errorMessage, 
          type: "bot" 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chatbot-section">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <h2>🧘 Chat with AtmaYoga</h2>
        </div>

        {/* Messages Area */}
        <div className="chatbot-messages">
          {messages.length === 0 && (
            <div className="message bot">
              <div className="message-bubble">
                Hi! 👋 I'm your AtmaYoga assistant. Tell me how you're feeling, 
                and I'll recommend the perfect yoga poses for you. You can also ask 
                anything about yoga!
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`message ${m.type}`}>
              <div className="message-bubble">{m.text}</div>
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <div className="loading-indicator">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className="chatbot-input-area" onSubmit={sendMessage}>
          <input
            className="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me how you feel..."
            disabled={loading}
          />
          <button 
            className="chatbot-send-btn" 
            type="submit"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}
