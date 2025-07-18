"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Zap, X } from "lucide-react";

interface ScanStatusBoxProps {
  status: string | null;
  onClear: () => void;
}

function getStatusType(msg: string | null) {
  if (!msg) return "info";
  if (msg.toLowerCase().includes("failed")) return "error";
  if (msg.toLowerCase().includes("starting")) return "loading";
  if (
    msg.toLowerCase().includes("complete") ||
    msg.toLowerCase().includes("initiated")
  )
    return "success";
  return "info";
}

export default function ScanStatusBox({ status, onClear }: ScanStatusBoxProps) {
  const statusType = getStatusType(status);

  useEffect(() => {
    if (!status) return;
    if (statusType === "success" || statusType === "info") {
      const timer = setTimeout(onClear, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, statusType, onClear]);

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-6 right-6 z-[100] flex items-center pointer-events-auto"
          role="alert"
        >
          <div
            className={`relative flex items-center gap-2 px-6 pr-14 py-4 rounded-lg shadow-2xl
              ${
                statusType === "success"
                  ? "bg-green-900/90 border border-green-400 text-green-200"
                  : statusType === "error"
                  ? "bg-red-900/90 border border-red-400 text-red-200"
                  : statusType === "loading"
                  ? "bg-cyan-900/90 border border-cyan-400 text-cyan-200"
                  : "bg-gray-800/90 border border-cyan-700 text-cyan-100"
              }
            `}
          >
            <button
              className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-white"
              onClick={onClear}
              aria-label="Close"
              type="button"
            >
              <X />
            </button>
            {statusType === "success" && (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
            {statusType === "error" && (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            {statusType === "loading" && (
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            )}
            {statusType === "info" && <Zap className="w-5 h-5 text-cyan-400" />}
            <span>
              {status
                .replace(/(Status: in_progress)/, "Scan in progress...")
                .replace(/(Status: completed)/, "Scan completed!")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
