import { X } from "lucide-react";
import ScanStatusBox from "@/components/ui/ScanStatusBox";

interface BreachedEmailScanModalProps {
  show: boolean;
  emailInput: string;
  setEmailInput: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  disabled: boolean;
  scanStatus?: string | null;
  onClearStatus?: () => void;
}

export default function BreachedEmailScanModal({
  show,
  emailInput,
  setEmailInput,
  onClose,
  onSubmit,
  disabled,
  scanStatus,
  onClearStatus,
}: BreachedEmailScanModalProps) {
  if (!show) return null;
  return (
    <form className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
          type="button"
        >
          <X />
        </button>
        <h2 className="text-lg font-bold text-cyan-400 mb-4">
          Breached Email Scan
        </h2>
        {scanStatus && onClearStatus && (
          <div className="mb-4">
            <ScanStatusBox status={scanStatus} onClear={onClearStatus} />
          </div>
        )}
        <label className="block mb-4 text-sm text-gray-300">
          Email Address
          <input
            type="email"
            className="mt-1 w-full px-3 py-2 rounded bg-gray-800 text-white border border-cyan-500"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="user@example.com"
          />
        </label>
        <button
          className="w-full bg-cyan-500 text-gray-900 py-2 rounded hover:bg-cyan-400 font-bold"
          onClick={onSubmit}
          disabled={disabled}
          type="button"
        >
          Start Breached Email Scan
        </button>
      </div>
    </form>
  );
}