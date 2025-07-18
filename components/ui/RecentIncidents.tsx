import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import api from "@/lib/api";

interface Incident {
  id: string;
  description: string;
  detected_at: string;
  severity: number;
  source: string;
  type: string;
  resolved: boolean;
}

// Helper to check if date is valid and >= 2000
function isValidRecentDate(dateStr: string) {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.getFullYear() >= 2000;
}

export default function RecentIncidents({
  incidents,
  loading,
  refreshIncidents, // Optional: pass a refresh function from parent if you want to update after resolve
}: {
  incidents: Incident[];
  loading: boolean;
  refreshIncidents?: () => void;
}) {
  const { user } = useContext(AuthContext);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (id: string) => {
    if (!user) return;
    setResolvingId(id);
    try {
      await api.put(
        `/incidents/resolve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (refreshIncidents) {
        await refreshIncidents();
      }
    } catch (error) {
      // handle error
    } finally {
      setResolvingId(null);
    }
  };

  // Sort incidents as required
  const sortedIncidents = [...incidents].sort((a, b) => {
    const aValid = isValidRecentDate(a.detected_at);
    const bValid = isValidRecentDate(b.detected_at);

    if (aValid && bValid) {
      // Descending order for valid dates
      return (
        new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
      );
    }
    if (aValid) return -1; // a comes before b
    if (bValid) return 1; // b comes before a
    return 0; // both invalid, keep order
  });

  return (
    <Card className="bg-gray-900 border-pink-500 w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-pink-400 text-xl">
          <AlertCircle className="mr-2" /> Recent Incidents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : incidents.length ? (
          <>
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
                  {sortedIncidents.slice(0, 5).map((incident) => (
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
                            {resolvingId === incident.id
                              ? "Resolving..."
                              : "Resolve"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Link
                href="/incidents"
                className="text-pink-400 hover:underline font-semibold"
              >
                View All Incidents &rarr;
              </Link>
            </div>
          </>
        ) : (
          <p>No recent incidents detected.</p>
        )}
      </CardContent>
    </Card>
  );
}
