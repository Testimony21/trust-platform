import { useState } from "react";
import { BadgeCheck, ShieldCheck, Clock, CheckCircle2, FileText, Phone, Camera, ArrowLeft, Upload, Check, ChevronDown } from "lucide-react";
import "./VerificationStatus.css";

export default function VerificationStatus() {
  const [viewMode, setViewMode] = useState("dashboard"); 
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    fullName: "",
    idType: "passport",
    idFile: null,
    phoneNumber: ""
  });

  // Tracking validation errors locally
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, idFile: e.target.files[0] }));
      setErrors(prev => ({ ...prev, idFile: "" }));
    }
  };

  // Step-by-Step Validation Guards
  const validateStep = (step) => {
    let stepErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) stepErrors.fullName = "Legal name is required.";
    }
    if (step === 2) {
      if (!formData.idFile) stepErrors.idFile = "Please upload a valid document file.";
    }
    if (step === 3) {
      if (!formData.phoneNumber.trim()) stepErrors.phoneNumber = "Phone number is required.";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = (nextStep) => {
    if (validateStep(currentStep)) {
      setCurrentStep(nextStep);
    }
  };

  const resetFlow = () => {
    setViewMode("dashboard");
    setCurrentStep(1);
    setErrors({});
  };

  const handleFinalSubmit = () => {
    if (validateStep(3)) {
      alert("Verification payload submitted successfully!");
      resetFlow();
    }
  };

  return (
    <div className="verif-page">
      {/* VIEW 1: CENTRAL DASHBOARD PREVIEW */}
      {viewMode === "dashboard" && (
        <>
          <div className="verif-header">
            <div className="verif-header-left">
              <span className="verif-kicker">Security Center</span>
              <h1>Identity Verification</h1>
              <p>
                Elevate your profile tier by verifying your identity, safeguarding your transactions, and unlocking advanced platform credentials.
              </p>
            </div>
          </div>

          <div className="verif-layout">
            <div className="verif-main">
              <div className="verif-steps-card">
                <h2>Required Steps</h2>
                <p className="verif-steps-sub">
                  Complete these secure authentication items to clear your account validation benchmarks.
                </p>

                <div className="verif-steps">
                  <div className="verif-step">
                    <div className="verif-step-icon"><FileText size={20} /></div>
                    <div className="verif-step-content">
                      <strong>Government-Issued Identification</strong>
                      <p>Provide a secure file copy of your valid national passport, driver's license, or national ID card.</p>
                    </div>
                    <span className="verif-step-status pending">Pending</span>
                  </div>

                  <div className="verif-step">
                    <div className="verif-step-icon"><Phone size={20} /></div>
                    <div className="verif-step-content">
                      <strong>Contact Protocol Link</strong>
                      <p>Confirm ownership of your primary mobile link using an SMS security verification pin.</p>
                    </div>
                    <span className="verif-step-status pending">Pending</span>
                  </div>

                  <div className="verif-step">
                    <div className="verif-step-icon"><Camera size={20} /></div>
                    <div className="verif-step-content">
                      <strong>Biometric Validation Match</strong>
                      <p>Submit a simple high-clarity front-facing photo portrait to verify document validation records.</p>
                    </div>
                    <span className="verif-step-status pending">Pending</span>
                  </div>
                </div>

                <button className="verif-cta" onClick={() => setViewMode("flow")}>
                  <ShieldCheck size={18} />
                  Begin Verification Process
                </button>
              </div>
            </div>

            <aside className="verif-aside">
              <div className="verif-info-card">
                <div className="verif-info-icon"><Clock size={20} /></div>
                <h3>Processing Expectations</h3>
                <p>Documents are handled securely and manually audited by system administrators within 24 to 48 business hours.</p>
              </div>

              <div className="verif-info-card">
                <div className="verif-info-icon green"><BadgeCheck size={20} /></div>
                <h3>Account Privileges</h3>
                <div className="verif-perks">
                  <div className="verif-perk"><CheckCircle2 size={15} /> <span>Identity verification marker</span></div>
                  <div className="verif-perk"><CheckCircle2 size={15} /> <span>Enhanced profiles</span></div>
                  <div className="verif-perk"><CheckCircle2 size={15} /> <span>Protection against security holds</span></div>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}

      {/* VIEW 2: IMMERSIVE STEP-BY-STEP WORKSPACE */}
      {viewMode === "flow" && (
        <div className="verif-workspace-container">
          <div className="verif-workspace-sidebar">
            <button className="verif-back-link" onClick={resetFlow}>
              <ArrowLeft size={16} /> Cancel & Return
            </button>
            
            <div className="workspace-steps-nav">
              <div className={`nav-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'done' : ''}`}>
                <span className="nav-number">{currentStep > 1 ? <Check size={14} /> : "1"}</span>
                <div>
                  <h4>Legal Credentials</h4>
                  <p>Personal detail mapping</p>
                </div>
              </div>
              <div className={`nav-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'done' : ''}`}>
                <span className="nav-number">{currentStep > 2 ? <Check size={14} /> : "2"}</span>
                <div>
                  <h4>Document Upload</h4>
                  <p>High-resolution copy</p>
                </div>
              </div>
              <div className={`nav-item ${currentStep === 3 ? 'active' : ''}`}>
                <span className="nav-number">3</span>
                <div>
                  <h4>Phone Linking</h4>
                  <p>SMS code handshake</p>
                </div>
              </div>
            </div>
          </div>

          <div className="verif-workspace-content">
            <div className="workspace-form-box">
              {currentStep === 1 && (
                <div className="step-fade-in">
                  <h2>Confirm Your Details</h2>
                  <p className="step-desc">Enter your document status parameters exactly as shown on your identification cards.</p>
                  
                  <div className="form-element">
                    <label>Full Legal Name</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleInputChange} 
                      placeholder="e.g. John Doe" 
                      className={errors.fullName ? "input-error" : ""}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>

                  <div className="form-element">
                    <label>Document Classification</label>
                    <div className="custom-select-wrapper">
                      <select name="idType" value={formData.idType} onChange={handleInputChange}>
                        <option value="passport">International Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="national_id">National ID Card</option>
                      </select>
                      <ChevronDown size={16} className="select-arrow" />
                    </div>
                  </div>

                  <div className="actions-footer">
                    <button className="verif-cta-prime" onClick={() => handleNextStep(2)}>Continue</button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-fade-in">
                  <h2>Upload Identification</h2>
                  <p className="step-desc">Ensure that all edges of the card/page are fully visible and readable.</p>
                  
                  <div className={`upload-drop-zone ${errors.idFile ? "zone-error" : ""}`}>
                    <Upload size={32} className="drop-icon" />
                    <p>{formData.idFile ? formData.idFile.name : "Drag copy here or click to browse files"}</p>
                    <span className="file-limits">Supports JPG, PNG formats up to 10MB</span>
                    <input type="file" onChange={handleFileChange} accept="image/*,application/pdf" />
                  </div>
                  {errors.idFile && <span className="error-text zone-error-msg">{errors.idFile}</span>}

                  <div className="actions-footer split">
                    <button className="verif-btn-secondary" onClick={() => setCurrentStep(1)}>Back</button>
                    <button className="verif-cta-prime" onClick={() => handleNextStep(3)}>Continue</button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-fade-in">
                  <h2>Phone Link Verification</h2>
                  <p className="step-desc">Add an extra mobile configuration anchor to safeguard transactions.</p>
                  
                  <div className="form-element">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber" 
                      value={formData.phoneNumber} 
                      onChange={handleInputChange} 
                      placeholder="+1 (555) 000-0000" 
                      className={errors.phoneNumber ? "input-error" : ""}
                    />
                    {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                  </div>

                  <div className="actions-footer split">
                    <button className="verif-btn-secondary" onClick={() => setCurrentStep(2)}>Back</button>
                    <button className="verif-btn-success" onClick={handleFinalSubmit}>Submit Documents</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}