import React, { useState } from "react";
import "./Message.css";

function Message({ initialMessages = [] }) {
  const defaultMessages = [
    {
      id: 1,
      sender: "Admin",
      role: "admin",
      message: "Welcome to the Quran Academy semester term. Please submit weekly attendance sheets by Friday.",
      date: "16 Jul 2026",
      unread: false,
    },
    {
      id: 2,
      sender: "Ali Ahmed",
      role: "student",
      message: "Assalam-o-Alaikum Sir, I will join today's Tajweed class 10 minutes late due to Internet issues.",
      date: "15 Jul 2026",
      unread: true,
    },
    {
      id: 3,
      sender: "Ayesha Khan",
      role: "student",
      message: "Respected Teacher, please share the Quran revision page numbers for today's assignment.",
      date: "15 Jul 2026",
      unread: true,
    },
  ];

  const [messageList, setMessageList] = useState(
    initialMessages.length > 0 ? initialMessages : defaultMessages
  );
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'student', 'admin'
  const [replyTo, setReplyTo] = useState(null); // Selected message for modal reply
  const [replyText, setReplyText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Filter messages based on active tab
  const filteredMessages = messageList.filter((msg) => {
    if (activeTab === "student") return msg.role === "student";
    if (activeTab === "admin") return msg.role === "admin";
    return true;
  });

  // Handle Reply Submission
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyTo) return;

    // Mark as read after reply
    setMessageList(
      messageList.map((m) => (m.id === replyTo.id ? { ...m, unread: false } : m))
    );

    setToastMessage(`Reply sent to ${replyTo.sender}`);
    setReplyTo(null);
    setReplyText("");

    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="messages-page animate-fade-in">
      {/* Header */}
      <div className="messages-header">
        <div>
          <h1>Communications & Messages</h1>
          <p className="subtitle">View messages from academy administration and student queries.</p>
        </div>

        <div className="unread-counter">
          <span>Unread Messages:</span>
          <strong>{messageList.filter((m) => m.unread).length}</strong>
        </div>
      </div>

      {toastMessage && <div className="toast-success">✓ {toastMessage}</div>}

      {/* Filter Tabs */}
      <div className="messages-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Messages
          </button>
          <button
            className={`filter-tab ${activeTab === "student" ? "active" : ""}`}
            onClick={() => setActiveTab("student")}
          >
            Student Queries
          </button>
          <button
            className={`filter-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Announcements
          </button>
        </div>
      </div>

      {/* Message Cards List */}
      <div className="message-list">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div
              className={`message-card ${msg.role === "admin" ? "admin-card" : ""} ${
                msg.unread ? "unread" : ""
              }`}
              key={msg.id}
            >
              <div className="message-header">
                <div className="sender-profile">
                  <div className={`avatar ${msg.role}`}>
                    {msg.sender.charAt(0)}
                  </div>
                  <div>
                    <h3 className="sender-name">
                      {msg.sender}{" "}
                      {msg.role === "admin" && <span className="admin-badge">Admin</span>}
                    </h3>
                    <span className="message-date">{msg.date}</span>
                  </div>
                </div>

                {msg.unread && <span className="new-tag">New</span>}
              </div>

              <div className="message-body">
                <p>{msg.message}</p>
              </div>

              <div className="message-footer">
                <button className="reply-btn" onClick={() => setReplyTo(msg)}>
                  💬 Reply
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-messages">
            <p>No messages found in this section.</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyTo && (
        <div className="modal-overlay" onClick={() => setReplyTo(null)}>
          <div className="modal-card animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setReplyTo(null)}>
              ✕
            </button>

            <div className="modal-header">
              <h3>Send Reply to {replyTo.sender}</h3>
            </div>

            <form onSubmit={handleSendReply}>
              <div className="original-msg-preview">
                <label>Replying to:</label>
                <p>"{replyTo.message}"</p>
              </div>

              <div className="form-group">
                <label>Your Message</label>
                <textarea
                  rows="4"
                  placeholder="Type your response here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="send-btn">
                  🚀 Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;