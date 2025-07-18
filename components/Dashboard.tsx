"use client";
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import RecentThreats from "@/components/ui/RecentThreats";
import SystemStatus from "@/components/ui/SystemStatus";
import QuickActions from "@/components/ui/QuickActions";
import EmailScanModal from "@/components/ui/EmailScanModal";
import ScanStatusBox from "@/components/ui/ScanStatusBox";
import IncidentCard from "@/components/ui/IncidentCard";
import RecentIncidents from "@/components/ui/RecentIncidents";
import Link from "next/link";
import BreachedEmailScanModal from "@/components/ui/BreachedEmailScanModal";
import ChatbotModal from "@/components/ui/ChatbotModal";

interface Threat {
  id: string;
  description: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

export default function Dashboard() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBreachedEmailModal, setShowBreachedEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [imapPassword, setImapPassword] = useState("");
  const [incidents, setIncidents] = useState<any[]>([]); // Adjust type as needed
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Move fetch functions outside useEffect so you can call them elsewhere
  const fetchThreats = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }
      const response = await api.get("/incidents/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setThreats(response.data.incidents);
    } catch (error) {
      setScanStatus("Failed to fetch threats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      if (!user) return;
      const response = await api.get("/incidents/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setIncidents(response.data.incidents);
    } catch (error) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchThreats();
    fetchIncidents();
  }, [user]);

  // Handlers
  const handleEmailScan = async () => {
    if (!user) {
      setScanStatus("You must be logged in to scan.");
      setShowEmailModal(false);
      return;
    }
    setScanStatus(null);
    setShowEmailModal(false); // Close modal first

    try {
      const response = await api.post(
        "/email_scan/scan",
        {
          provider: "gmail",
          email: emailInput,
          email_pass: imapPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Check for completed status
      if (response.data.status === "completed") {
        setScanStatus("Email scan completed!");
      } else if (response.data.message && response.data.status) {
        setScanStatus(
          `${response.data.message} (Status: ${response.data.status})`
        );
      } else if (response.data.message) {
        setScanStatus(response.data.message);
      } else {
        setScanStatus("Email scan initiated.");
      }
      await fetchThreats();
      await fetchIncidents();
    } catch (error: any) {
      setScanStatus(
        error.response?.data?.error
          ? `Email scan failed: ${error.response.data.error}`
          : "Failed to start email scan."
      );
    }
    setEmailInput("");
    setImapPassword("");
  };

  const handleWifiScan = async () => {
    if (!user) {
      setScanStatus("You must be logged in to scan.");
      return;
    }
    setScanStatus(null);
    try {
      setScanStatus("Starting WiFi scan...");
      const response = await api.post(
        "/scan/wifi",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setScanStatus(
        response.data.message && response.data.status
          ? `${response.data.message} (Status: ${response.data.status})`
          : response.data.message
          ? response.data.message
          : "WiFi scan started."
      );
      await fetchThreats();
      await fetchIncidents();
    } catch (error: any) {
      setScanStatus(
        error.response?.data?.error
          ? `WiFi scan failed: ${error.response.data.error}`
          : "Failed to start WiFi scan."
      );
    }
  };

  const handleShodanScan = async () => {
    if (!user) {
      setScanStatus("You must be logged in to scan.");
      return;
    }
    setScanStatus(null);
    try {
      const response = await api.post(
        "/scan/shodan",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setScanStatus(
        response.data.message && response.data.status
          ? `${response.data.message} (Status: ${response.data.status})`
          : response.data.message
          ? response.data.message
          : response.data.risk_level
          ? `Shodan scan complete. Risk: ${response.data.risk_level.toUpperCase()}`
          : "Shodan scan complete."
      );
      await fetchThreats();
      await fetchIncidents();
    } catch (error: any) {
      setScanStatus(
        error.response?.data?.error
          ? `Shodan scan failed: ${error.response.data.error}`
          : "Failed to start Shodan scan."
      );
    }
  };

  // Add this handler for breached email scan
  const handleBreachedEmailScan = async () => {
    if (!user) {
      setScanStatus("You must be logged in to scan.");
      setShowBreachedEmailModal(false);
      return;
    }
    setScanStatus(null);
    setShowBreachedEmailModal(false);
    try {
      const response = await api.post(
        "/scan/email", // <-- Use /scan/email as in your screenshot
        { email: emailInput },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setScanStatus(
        response.data.message && response.data.status
          ? `${response.data.message} (Status: ${response.data.status})`
          : response.data.message
          ? response.data.message
          : "Email scan initiated."
      );
      await fetchThreats();
      await fetchIncidents();
      setScanStatus("Breached email scan completed!");
    } catch (error: any) {
      setScanStatus(
        error.response?.data?.error
          ? `Email scan failed: ${error.response.data.error}`
          : "Failed to start email scan."
      );
    }
    setEmailInput("");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 p-6"
      >
        {user ? (
          <RecentThreats threats={threats} loading={loading} />
        ) : (
          <div className="col-span-1 flex items-center justify-center bg-gray-800 rounded-lg p-6 border-cyan-500 border">
            <span className="text-cyan-300">
              <Link href="/login" className="underline hover:text-cyan-400">
                Login
              </Link>{" "}
              to view recent threats.
            </span>
          </div>
        )}
        <SystemStatus />
        <QuickActions
          onEmailScan={() => {
            setScanStatus(null);
            if (!user) {
              setScanStatus("You must be logged in to scan.");
              return;
            }
            setShowEmailModal(true);
          }}
          onWifiScan={handleWifiScan}
          onShodanScan={handleShodanScan}
          onBreachedEmailScan={() => {
            setScanStatus(null);
            if (!user) {
              setScanStatus("You must be logged in to scan.");
              return;
            }
            setShowBreachedEmailModal(true);
          }}
        />
      </motion.div>
      {/* Full-width Recent Incidents at the bottom */}
      <div className="w-full px-6 pb-6">
        {user ? (
          <RecentIncidents
            incidents={incidents}
            loading={loading}
            refreshIncidents={fetchIncidents} // <-- Add this line
          />
        ) : (
          <div className="w-full flex items-center justify-center bg-gray-900 rounded-lg p-8 border-pink-500 border">
            <span className="text-pink-300 text-lg">
              <Link href="/login" className="underline hover:text-pink-400">
                Login
              </Link>{" "}
              to view recent incidents.
            </span>
          </div>
        )}
      </div>
      {/* Email Scan Modal and ScanStatusBox remain unchanged */}
      <EmailScanModal
        show={showEmailModal}
        emailInput={emailInput}
        imapPassword={imapPassword}
        setEmailInput={setEmailInput}
        setImapPassword={setImapPassword}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailScan}
        disabled={!emailInput || !imapPassword}
        scanStatus={scanStatus}
        onClearStatus={() => setScanStatus(null)}
      />
      <BreachedEmailScanModal
        show={showBreachedEmailModal}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        onClose={() => setShowBreachedEmailModal(false)}
        onSubmit={handleBreachedEmailScan}
        disabled={!emailInput}
        scanStatus={scanStatus}
        onClearStatus={() => setScanStatus(null)}
      />
      {!showEmailModal && (
        <ScanStatusBox
          status={scanStatus}
          onClear={() => setScanStatus(null)}
        />
      )}
      {/* Floating Chatbot Button - only visible when logged in */}
      {user && (
        <>
          <button
            className="fixed z-40 bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all"
            onClick={() => setChatbotOpen(true)}
            aria-label="Open Chatbot"
            style={{ boxShadow: "0 4px 24px rgba(0,255,255,0.2)" }}
          >
            💬
          </button>
          <ChatbotModal
            open={chatbotOpen}
            onClose={() => setChatbotOpen(false)}
          />
        </>
      )}
    </>
  );
}
