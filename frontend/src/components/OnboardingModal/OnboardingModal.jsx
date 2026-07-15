// src/components/OnboardingModal/OnboardingModal.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Search, MessageCircle, BadgeCheck, X } from "lucide-react";
import "./OnboardingModal.css";

const buyerSteps = [
  {
    icon: <Search size={28} />,
    title: "Search for a seller",
    description: "Enter a seller's name, email, or phone number to check their trust score and identity before paying.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Review their trust data",
    description: "See their trust score, verification status, deal history, and any scam reports filed against them.",
  },
  {
    icon: <MessageCircle size={28} />,
    title: "Start a safe transaction",
    description: "Once you're confident, start a transaction. Chat with the seller inside a protected deal room.",
  },
];

const sellerSteps = [
  {
    icon: <BadgeCheck size={28} />,
    title: "Complete your profile",
    description: "Add your display name, bio, phone, and social links so buyers can find and trust you.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Get verified",
    description: "Submit your identity for verification to unlock the verified badge and boost your trust score.",
  },
  {
    icon: <MessageCircle size={28} />,
    title: "Build your trust score",
    description: "Your score starts at 0 and grows as buyers complete deals with you and leave positive feedback.",
  },
];

export default function OnboardingModal({ role, onClose }) {
  const [step, setStep] = useState(0);
  const steps = role === "seller" ? sellerSteps : buyerSteps;
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">

        <button className="onboarding-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="onboarding-badge">
          {role === "seller" ? "Seller Guide" : "Buyer Guide"}
        </div>

        <h2>
          {role === "seller"
            ? "Welcome to Trust-Platform"
            : "How to stay safe while buying"}
        </h2>

        <p className="onboarding-sub">
          {role === "seller"
            ? "Here's how to set up your account and start receiving buyers."
            : "Here's how to verify sellers and transact safely."}
        </p>

        {/* STEPS INDICATOR */}
        <div className="onboarding-dots">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`onboarding-dot ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            />
          ))}
        </div>

        {/* CURRENT STEP */}
        <div className="onboarding-step">
          <div className="onboarding-step-icon">
            {steps[step].icon}
          </div>
          <h3>{steps[step].title}</h3>
          <p>{steps[step].description}</p>
        </div>

        {/* ACTIONS */}
        <div className="onboarding-actions">
          <button className="onboarding-next" onClick={handleNext}>
            {isLast ? "Get started" : "Next →"}
          </button>

          <div className="onboarding-secondary">
            {step > 0 && (
              <button className="onboarding-back" onClick={() => setStep((prev) => prev - 1)}>
                ← Back
              </button>
            )}

            {step === 0 && (
              <button className="onboarding-skip" onClick={onClose}>
                Skip
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}