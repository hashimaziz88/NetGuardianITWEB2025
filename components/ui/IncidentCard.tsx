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

function isValidRecentDate(dateStr: string) {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.getFullYear() >= 2000;
}

export default function IncidentCard({
  incidents,
  loading,
}: {
  incidents: Incident[];
  loading: boolean;
}) {
  const sortedIncidents = [...incidents].sort((a, b) => {
    const aValid = isValidRecentDate(a.detected_at);
    const bValid = isValidRecentDate(b.detected_at);

    if (aValid && bValid) {
      return (
        new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
      );
    }
    if (aValid) return -1;
    if (bValid) return 1;
    return 0;
  });

  return (
    <Card className="bg-gray-800 border-pink-500">
      <CardHeader>
        <CardTitle className="flex items-center text-pink-400">
          <AlertCircle className="mr-2" /> Recent Incidents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : incidents.length ? (
          <ul className="space-y-2">
            {sortedIncidents.slice(0, 5).map((incident) => (
              <li key={incident.id} className="text-sm">
                <span
                  className={
                    incident.severity >= 4
                      ? "text-red-400 font-bold"
                      : incident.severity === 3
                      ? "text-yellow-400 font-bold"
                      : "text-green-400 font-bold"
                  }
                >
                  {incident.type.toUpperCase()}
                </span>
                : {incident.description} (
                {new Date(incident.detected_at).toLocaleString()})
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent incidents detected.</p>
        )}
      </CardContent>
    </Card>
  );
}