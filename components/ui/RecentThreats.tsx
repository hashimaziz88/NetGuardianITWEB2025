import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface Threat {
  id: string;
  description: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

export default function RecentThreats({
  threats,
  loading,
}: {
  threats: Threat[];
  loading: boolean;
}) {
  return (
    <Card className="bg-gray-800 border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center text-cyan-400">
          <AlertTriangle className="mr-2" /> Recent Threats
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : threats.length ? (
          <ul className="space-y-2">
            {threats.slice(0, 5).map((threat) => (
              <li key={threat.id} className="text-sm">
                <span
                  className={
                    threat.severity === "high"
                      ? "text-red-400 font-bold"
                      : threat.severity === "medium"
                      ? "text-yellow-400 font-bold"
                      : "text-green-400 font-bold"
                  }
                >
                  {threat.severity}
                </span>
                : {threat.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent threats detected.</p>
        )}
      </CardContent>
    </Card>
  );
}
