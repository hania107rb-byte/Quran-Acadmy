import React, { useEffect, useState } from "react";
import "./Message.css";
import API from "/src/api/api";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await API.get("/contact");

      console.log("Contact API Response:", response.data);

      if (response.data?.success) {
        setMessages(
          Array.isArray(response.data.contacts)
            ? response.data.contacts
            : []
        );
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    try {
      // Backend DELETE route jab ready ho:
      // await API.delete(`/contact/${id}`);

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="admin-messages-page">
        <div className="messages-header">
          <h2>Messages & Inquiries</h2>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-messages-page">

      <div className="messages-header">
        <h2>Messages & Inquiries</h2>
        <p>
          Review incoming messages, questions, and contact requests
          from students and visitors.
        </p>
      </div>

      <div className="messages-list">

        {messages.length === 0 ? (
          <p className="no-messages">
            No messages found.
          </p>
        ) : (
          messages.map((msg) => (
            <div className="message-card" key={msg._id}>

              <div className="message-header">
                <div>
                  <h3>{msg.name || "Unknown User"}</h3>

                  <span className="message-email">
                    {msg.email || "No email"}
                  </span>
                </div>

                <span className="status-tag unread">
                  New
                </span>
              </div>

              <h4>
                {msg.subject || "No Subject"}
              </h4>

              <p className="message-text">
                {msg.message || "No message"}
              </p>

              <div className="message-footer">

                <span className="message-date">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleDateString()
                    : "No date"}
                </span>

                <div className="message-actions">
                  <button
                    className="delete-btn"
                    onClick={() => deleteMessage(msg._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
};


export default Messages;