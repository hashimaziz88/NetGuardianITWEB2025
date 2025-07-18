import Dashboard from "@/components/Dashboard";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-cyan-400">NETDASHBOARD</h1>
      <Dashboard />
    </div>
  );
}
