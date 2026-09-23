import React, { useState, useRef, useEffect } from "react";

import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaBookOpen,
  FaSpinner,
} from "react-icons/fa";

import API from "../../api/api";
import "./Agent.css";

const QuranAIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Assalamu Alaikum! 👋\n\n" +
        "I am your Quran Academy AI Tutor. " +
        "How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef(null);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async (e) => {
    e?.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    // Add user message
    const userMessage = {
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      console.log("=================================");
      console.log("🤖 SENDING AI MESSAGE");
      console.log("MESSAGE:", trimmedMessage);

      const response = await API.post(
        "/ai/chat",
        {
          message: trimmedMessage,
        }
      );

      console.log(
        "✅ AI API RESPONSE:",
        response.data
      );

      const aiReply =
        response?.data?.reply ||
        response?.data?.message ||
        "Sorry, I couldn't understand that. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
        },
      ]);
    } catch (error) {
      console.error("=================================");
      console.error("❌ AI CHAT ERROR");
      console.error(
        "MESSAGE:",
        error.message
      );
      console.error(
        "STATUS:",
        error.response?.status
      );
      console.error(
        "DATA:",
        error.response?.data
      );
      console.error("=================================");

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Sorry, I couldn't process your request. 🙏\n\n" +
            `${backendMessage || "Please try again later."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUGGESTION
  // ==========================================

  const handleSuggestion = (text) => {
    setMessage(text);
  };

  // ==========================================
  // CLEAR CHAT
  // ==========================================

  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        text:
          "Assalamu Alaikum! 👋\n\n" +
          "I am your Quran Academy AI Tutor. " +
          "How can I help you today?",
      },
    ]);
  };

  return (
    <>
      {/* ======================================
          FLOATING AI BUTTON
      ====================================== */}

      {!isOpen && (
        <button
          className="quran-ai-floating-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open Quran AI Tutor"
          type="button"
        >
          <FaRobot />

          <span className="quran-ai-tooltip">
            AI Quran Tutor
          </span>
        </button>
      )}

      {/* ======================================
          AI CHAT WINDOW
      ====================================== */}

      {isOpen && (
        <div className="quran-ai-container">

          {/* HEADER */}
          <div className="quran-ai-header">

            <div className="quran-ai-header-left">

              <div className="quran-ai-logo">
                <FaBookOpen />
              </div>

              <div>
                <h3>
                  Quran AI Tutor
                </h3>

                <span>
                  <i></i>
                  Online Assistant
                </span>
              </div>

            </div>

            <div className="quran-ai-header-actions">

              <button
                className="quran-ai-clear"
                onClick={clearChat}
                type="button"
                title="Clear chat"
              >
                Clear
              </button>

              <button
                className="quran-ai-close"
                onClick={() =>
                  setIsOpen(false)
                }
                aria-label="Close AI Tutor"
                type="button"
              >
                <FaTimes />
              </button>

            </div>

          </div>

          {/* ==================================
              MESSAGES
          ================================== */}

          <div className="quran-ai-messages">

            {/* SUGGESTIONS */}

            {messages.length === 1 && (
              <div className="quran-ai-suggestions">

                <p>
                  Try asking:
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleSuggestion(
                      "What is Tajweed?"
                    )
                  }
                >
                  What is Tajweed?
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSuggestion(
                      "How can I improve my Quran reading?"
                    )
                  }
                >
                  How can I improve my Quran reading?
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSuggestion(
                      "Tell me about Quran Academy courses."
                    )
                  }
                >
                  Tell me about your courses
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSuggestion(
                      "What is Hifz?"
                    )
                  }
                >
                  What is Hifz?
                </button>

              </div>
            )}

            {/* CHAT MESSAGES */}

            {messages.map(
              (msg, index) => (
                <div
                  key={`${msg.sender}-${index}`}
                  className={`quran-ai-message-row ${
                    msg.sender === "user"
                      ? "user-message-row"
                      : "ai-message-row"
                  }`}
                >

                  {/* AI ICON */}

                  {msg.sender === "ai" && (
                    <div className="quran-ai-avatar">
                      <FaRobot />
                    </div>
                  )}

                  {/* MESSAGE */}

                  <div
                    className={`quran-ai-message ${
                      msg.sender === "user"
                        ? "user-message"
                        : "ai-message"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* USER ICON */}

                  {msg.sender === "user" && (
                    <div className="quran-user-avatar">
                      <FaUser />
                    </div>
                  )}

                </div>
              )
            )}

            {/* ==================================
                LOADING
            ================================== */}

            {loading && (
              <div className="quran-ai-message-row ai-message-row">

                <div className="quran-ai-avatar">
                  <FaRobot />
                </div>

                <div className="quran-ai-message ai-message typing-message">

                  <FaSpinner className="ai-spinner" />

                  <span>
                    Thinking...
                  </span>

                </div>

              </div>
            )}

            <div
              ref={messagesEndRef}
            />

          </div>

          {/* ==================================
              INPUT
          ================================== */}

          <form
            className="quran-ai-input-area"
            onSubmit={sendMessage}
          >

            <input
              type="text"
              placeholder="Ask about Quran, Tajweed, Hifz..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              disabled={loading}
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={
                !message.trim() ||
                loading
              }
              aria-label="Send message"
            >
              {loading ? (
                <FaSpinner className="ai-spinner" />
              ) : (
                <FaPaperPlane />
              )}
            </button>

          </form>

          {/* FOOTER */}

          <div className="quran-ai-footer">
            Quran Academy AI Tutor
          </div>

        </div>
      )}
    </>
  );
};

export default QuranAIAgent;