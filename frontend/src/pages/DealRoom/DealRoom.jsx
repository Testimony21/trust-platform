import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { getDeal, getMessages, sendMessage, updateDealStatus } from "../../api/dealApi";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";
import "./DealRoom.css";

const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default function DealRoom() {
  const { id } = useParams();
  const { user } = useAuth();

  const [deal, setDeal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const currentUserId = user?._id?.toString() || user?.id?.toString();

  const loadDealRoom = async () => {
    try {
      setError("");
      const [dealData, messageData] = await Promise.all([
        getDeal(id),
        getMessages(id),
      ]);
      setDeal(dealData);
      setMessages(messageData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load deal room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealRoom();

    socket.emit("joinDeal", id);

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveDeal", id);
      socket.off("newMessage");
    };
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSending(true);
      await sendMessage(id, text.trim());
      setText("");
    } catch (err) {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      const updatedDeal = await updateDealStatus(id, status);
      setDeal(updatedDeal);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const isBuyer = deal?.buyer?._id?.toString() === currentUserId;
  const isSeller = deal?.seller?._id?.toString() === currentUserId;

  if (loading) {
    return <main className="deal-room-page">Loading deal room...</main>;
  }

  if (error && !deal) {
    return <main className="deal-room-page deal-room-error">{error}</main>;
  }

  return (
    <main className="deal-room-page">
      <section className="deal-room-shell">
        <Link className="deal-back" to="/deals">
          <ArrowLeft size={17} />
          Back to deals
        </Link>

        {error && <div className="deal-room-error">{error}</div>}

        <div className="deal-room-layout">
          <aside className="deal-summary">
            <p className="deal-kicker">Deal Room</p>
            <h1>{deal.title}</h1>

            <span className={`deal-room-status status-${deal.status}`}>
              {deal.status.replace("_", " ")}
            </span>

            <div className="summary-list">
              <p>
                <span>Buyer</span>
                {deal.buyer?.fullName || deal.buyer?.email || "Buyer"}
              </p>
              <p>
                <span>Seller</span>
                {deal.seller?.fullName || deal.seller?.email || "Seller"}
              </p>
              <p>
                <span>Amount</span>
                {deal.amount
                  ? `₦${Number(deal.amount).toLocaleString()}`
                  : "Not set"}
              </p>
              <p>
                <span>Platform</span>
                {deal.platform || "Not set"}
              </p>
            </div>

            <div className="deal-actions">
              {isSeller &&
                deal.status !== "delivered" &&
                deal.status !== "completed" && (
                  <button onClick={() => handleStatusUpdate("delivered")}>
                    Mark delivered
                  </button>
                )}

              {isBuyer && deal.status !== "completed" && (
                <button onClick={() => handleStatusUpdate("completed")}>
                  Mark completed
                </button>
              )}

              <button
                className="danger"
                onClick={() => handleStatusUpdate("disputed")}
              >
                Report issue
              </button>
            </div>

            <div className="deal-note">
              <ShieldCheck size={18} />
              Feedback will only be allowed after a completed deal.
            </div>
          </aside>

          <section className="chat-panel">
            <div className="chat-header">
              <h2>Conversation</h2>
              <p>Keep the important deal details inside this room.</p>
            </div>

            <div className="messages-list">
              {messages.length === 0 && (
                <div className="empty-chat">
                  No messages yet. Start the conversation.
                </div>
              )}

              {messages.map((message) => {
                const senderId =
                  message.senderId?._id?.toString() ||
                  message.senderId?.toString();
                const mine = senderId === currentUserId;

                return (
                  <div
                    className={`message-bubble ${mine ? "mine" : ""}`}
                    key={message._id}
                  >
                    <span>
                      {message.senderId?.fullName ||
                        message.senderId?.email ||
                        "User"}
                    </span>
                    <p>{message.text}</p>
                  </div>
                );
              })}
            </div>

            <form className="message-form" onSubmit={handleSend}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a message..."
              />
              <button disabled={sending || !text.trim()}>
                <Send size={17} />
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}