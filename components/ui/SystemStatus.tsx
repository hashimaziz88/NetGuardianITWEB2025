import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function SystemStatus() {
  return (
    <Card className="bg-gray-800 border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center text-cyan-400">
          <Shield className="mr-2" /> System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-green-400">All systems operational</p>
        <p className="text-sm mt-2">
          Last scan:{" "}
          {new Date().toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
