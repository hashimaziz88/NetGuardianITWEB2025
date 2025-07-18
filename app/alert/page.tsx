'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { motion } from 'framer-motion';

interface AlertConfig {
  channel: 'whatsapp' | 'email' | 'push';
  enabled: boolean;
}

export default function AlertsPage() {
  const [configs, setConfigs] = useState<AlertConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await api.get('/alerts/config');
        setConfigs(response.data);
      } catch (error) {
        console.error('Failed to fetch alert configs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  const handleConfigChange = async (channel: AlertConfig['channel'], enabled: boolean) => {
    try {
      await api.patch('/alerts/config', { channel, enabled });
      setConfigs(configs.map((c) => (c.channel === channel ? { ...c, enabled } : c)));
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Alert Settings</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-800 border-cyan-500">
          <CardHeader>
            <CardTitle className="text-cyan-400">Configure Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {configs.map((config) => (
                  <div key={config.channel} className="flex items-center justify-between">
                    <span className="capitalize">{config.channel}</span>
                    <Select
                      value={config.enabled ? 'enabled' : 'disabled'}
                      onValueChange={(value) => handleConfigChange(config.channel, value === 'enabled')}
                    >
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}