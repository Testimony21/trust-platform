import { useState, useEffect } from "react";
import "./DashboardLoader.css";

const messages = [
  "Checking your session...",
  "Fetching your trust data...",
  "Almost there...",
];

export default function DashboardLoader() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tp-loader-screen">
      <div className="tp-loader-stack">
        <div className="tp-loader-spinner-wrap">
          
          {/* SPINNING RING */}
          <svg className="tp-loader-ring" width="64" height="64" viewBox="0 0 64 64">
            <circle className="ring-bg" cx="32" cy="32" r="27" fill="none" strokeWidth="4" />
            <circle
              className="ring-active"
              cx="32"
              cy="32"
              r="27"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="50 200"
            />
          </svg>
          
          {/* SHIELD */}
          <svg className="tp-loader-shield" width="28" height="28" viewBox="0 0 24 24">
            <path
              className="shield-bg"
              d="M12 2L20 5.5V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V5.5L12 2Z"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              className="shield-check"
              d="M9 12L11 14L15.5 9.5"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
        </div>

        <div className="tp-loader-text">
          <p className="tp-loader-title">Loading your dashboard</p>
          <p className="tp-loader-sub">{messages[msgIndex]}</p>
        </div>
      </div>
    </div>
  );
}