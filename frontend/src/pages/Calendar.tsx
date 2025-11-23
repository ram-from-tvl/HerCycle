import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar as CalendarIcon, Plus, Heart } from "lucide-react";
import { api, CycleLog } from "@/lib/api";
import { motion } from "framer-motion";

export default function Calendar() {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState<any[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [formData, setFormData] = useState<CycleLog>({
    start_date: new Date().toISOString().split('T')[0],
    period_length: 5,
    flow_intensity: "medium",
    notes: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    try {
      const response = await api.getCycleHistory();
      setCycles(response.cycles || []);
    } catch (error) {
      console.error("Failed to load cycles:", error);
      setCycles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogCycle = async () => {
    try {
      await api.logCycle(formData);
      setIsLogging(false);
      await loadCycles();
      // Reset form
      setFormData({
        start_date: new Date().toISOString().split('T')[0],
        period_length: 5,
        flow_intensity: "medium",
        notes: ""
      });
    } catch (error) {
      console.error("Failed to log cycle:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cycle history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Cycle Calendar</h1>
          </div>
          <Button onClick={() => setIsLogging(true)} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Log Period
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Log Cycle Form */}
        {isLogging && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="bg-gradient-to-br from-pink-100/50 to-primary-glow/20 border-pink-200">
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span>Log Your Period</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Period Length (days)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.period_length}
                    onChange={(e) => setFormData(prev => ({ ...prev, period_length: parseInt(e.target.value) }))}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Flow Intensity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'medium', 'heavy'].map((intensity: 'light' | 'medium' | 'heavy') => (
                      <Button
                        key={intensity}
                        variant={formData.flow_intensity === intensity ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, flow_intensity: intensity }))}
                        className="capitalize rounded-lg"
                      >
                        {intensity}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                  <Input
                    placeholder="Any symptoms or observations..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="rounded-lg"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button onClick={handleLogCycle} className="flex-1">
                    Save Period
                  </Button>
                  <Button variant="outline" onClick={() => setIsLogging(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Cycle History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard>
            <div className="flex items-center space-x-3 mb-4">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Your Cycle History</h3>
              <span className="text-sm text-muted-foreground">({cycles.length} cycles)</span>
            </div>

            {cycles.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <h4 className="text-lg font-semibold text-muted-foreground">No cycles logged yet</h4>
                  <p className="text-sm text-muted-foreground">Start tracking your periods to get AI predictions!</p>
                </div>
                <Button onClick={() => setIsLogging(true)} className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Your First Period
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {cycles.map((cycle, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {new Date(cycle.start_date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {cycle.period_length} days • {cycle.flow_intensity} flow
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {Math.floor((new Date().getTime() - new Date(cycle.start_date).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* AI Prediction Message */}
        {cycles.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="bg-gradient-to-br from-blue-100/50 to-primary-glow/20 border-blue-200">
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-blue-800">🤖 AI Analysis Ready</h4>
                <p className="text-sm text-blue-700">
                  With {cycles.length} cycle{cycles.length === 1 ? '' : 's'} logged, our AI can start analyzing your patterns!
                </p>
                <Button 
                  onClick={() => navigate('/plan')} 
                  variant="outline" 
                  className="text-blue-700 border-blue-300 rounded-full"
                >
                  Generate AI Prediction
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Tips for Better Tracking */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="border-l-4 border-primary">
            <h4 className="font-semibold mb-2">📝 Tracking Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Log your period start date as soon as it begins</li>
              <li>• Track for 3+ cycles to get accurate AI predictions</li>
              <li>• Note your flow intensity and any symptoms</li>
              <li>• Regular tracking helps our AI learn your unique patterns</li>
            </ul>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}