"use client";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Incident {
  id: string;
  description: string;
  detected_at: string;
  severity: number;
  source: string;
  type: string;
  resolved: boolean;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

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
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    // eslint-disable-next-line
  }, [user]);

  const handleResolve = async (id: string) => {
    if (!user) return;
    setResolvingId(id);
    try {
      await api.put(`/incidents/resolve/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      await fetchIncidents();
    } catch (error) {
      // handle error
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="bg-gray-900 border-pink-500 w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-pink-400 text-xl">
            <AlertCircle className="mr-2" /> All Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : incidents.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-3 text-gray-300">Type</th>
                    <th className="py-2 px-3 text-gray-300">Description</th>
                    <th className="py-2 px-3 text-gray-300">Source</th>
                    <th className="py-2 px-3 text-gray-300">Detected At</th>
                    <th className="py-2 px-3 text-gray-300">Severity</th>
                    <th className="py-2 px-3 text-gray-300">Status</th>
                    <th className="py-2 px-3 text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr
                      key={incident.id}
                      className="border-b border-gray-800 hover:bg-gray-800 transition"
                    >
                      <td className="py-2 px-3 font-semibold text-pink-300">
                        {incident.type.toUpperCase()}
                      </td>
                      <td className="py-2 px-3">{incident.description}</td>
                      <td className="py-2 px-3">{incident.source}</td>
                      <td className="py-2 px-3">
                        {new Date(incident.detected_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={
                            incident.severity >= 4
                              ? "text-red-400 font-bold"
                              : incident.severity === 3
                              ? "text-yellow-400 font-bold"
                              : "text-green-400 font-bold"
                          }
                        >
                          {incident.severity}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {incident.resolved ? (
                          <span className="text-green-400">Resolved</span>
                        ) : (
                          <span className="text-yellow-400">Unresolved</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {!incident.resolved && (
                          <button
                            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-xs"
                            onClick={() => handleResolve(incident.id)}
                            disabled={resolvingId === incident.id}
                          >
                            {resolvingId === incident.id ? "Resolving..." : "Resolve"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No incidents found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
