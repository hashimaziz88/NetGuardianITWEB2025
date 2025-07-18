import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface QuickActionsProps {
  onBreachedEmailScan: () => void;
  onEmailScan: () => void;
  onWifiScan: () => void;
  onShodanScan: () => void;
}

export default function QuickActions({
  onBreachedEmailScan,
  onEmailScan,
  onWifiScan,
}: QuickActionsProps) {
  return (
    <Card className="bg-gray-800 border-cyan-500">
      <CardHeader>
        <CardTitle className="flex items-center text-cyan-400">
          <Zap className="mr-2" /> Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <button
            className="w-full bg-cyan-500 text-gray-900 py-2 rounded hover:bg-cyan-400"
            onClick={onBreachedEmailScan}
          >
            Run Breached Email Scan
          </button>
          <button
            className="w-full bg-cyan-500 text-gray-900 py-2 rounded hover:bg-cyan-400"
            onClick={onEmailScan}
          >
            Run Email Scan
          </button>
          <button
            className="w-full bg-cyan-500 text-gray-900 py-2 rounded hover:bg-cyan-400"
            onClick={onWifiScan}
          >
            Run WiFi Scan
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
