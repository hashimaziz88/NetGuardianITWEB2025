"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/api";
import { X } from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function ChatbotModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setMessages([]);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setLoading(true);
    try {
      const response = await api.post(
        "/chatbot/",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: response.data.response },
      ]);
    } catch (err: any) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text:
            "Error: " +
            (err.response?.data?.error || "Could not get response."),
        },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div className="bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md mx-auto flex flex-col h-[70vh]">
        <div className="flex items-center justify-between p-4 border-b border-cyan-700">
          <span className="text-cyan-400 font-bold text-lg">Guardian Bot</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-cyan-400"
          >
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center">
              Start the conversation!
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-cyan-700 text-white self-end ml-16"
                  : "bg-gray-700 text-cyan-200 self-start mr-16"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          className="flex border-t border-gray-700 p-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) sendMessage();
          }}
        >
          <input
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded mr-2 outline-none"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
