import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/GlassCard";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, Heart, Battery, Brain, Moon } from "lucide-react";
import { api, CheckInData } from "@/lib/api";
import { motion } from "framer-motion";

export default function CheckIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckInData>({
    pain: 3,
    energy: 6,
    stress: 3,
    mood: "",
    sleep_hours: 7,
    symptoms: [],
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = ["amazing", "good", "okay", "low", "difficult"];
  const symptomOptions = [
    "cramps", "bloating", "headache", "mood swings", "fatigue", 
    "breast tenderness", "back pain", "nausea", "diarrhea", "constipation"
  ];

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitCheckin(formData);
      // After successful check-in, redirect to plan generation
      navigate("/plan");
    } catch (error) {
      console.error("Failed to submit check-in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50 px-6 py-4">
        <div className="flex items-center max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="mr-4">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Daily Check-in</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <div className="text-center space-y-2">
              <Heart className="w-8 h-8 text-primary mx-auto" />
              <h2 className="text-xl font-semibold">How are you feeling today?</h2>
              <p className="text-muted-foreground">Your daily check-in helps our AI agents create a personalized plan just for you.</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Pain Level */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <h3 className="font-semibold">Pain Level</h3>
              </div>
              <div className="space-y-3">
                <Slider
                  value={[formData.pain]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, pain: value[0] }))}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>No pain (0)</span>
                  <span className="font-medium">{formData.pain}</span>
                  <span>Severe (10)</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Energy Level */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Battery className="w-4 h-4 text-green-400" />
                <h3 className="font-semibold">Energy Level</h3>
              </div>
              <div className="space-y-3">
                <Slider
                  value={[formData.energy]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, energy: value[0] }))}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Exhausted (0)</span>
                  <span className="font-medium">{formData.energy}</span>
                  <span>Energized (10)</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stress Level */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold">Stress Level</h3>
              </div>
              <div className="space-y-3">
                <Slider
                  value={[formData.stress]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, stress: value[0] }))}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Calm (0)</span>
                  <span className="font-medium">{formData.stress}</span>
                  <span>Very stressed (10)</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Mood */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard>
            <div className="space-y-4">
              <h3 className="font-semibold">How would you describe your mood?</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {moodOptions.map(mood => (
                  <button
                    key={mood}
                    onClick={() => setFormData(prev => ({ ...prev, mood }))}
                    className={`p-3 rounded-xl border-2 transition-all capitalize ${
                      formData.mood === mood
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sleep */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <GlassCard>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold">Hours of Sleep</h3>
              </div>
              <div className="space-y-3">
                <Slider
                  value={[formData.sleep_hours]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sleep_hours: value[0] }))}
                  max={12}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0 hours</span>
                  <span className="font-medium">{formData.sleep_hours} hours</span>
                  <span>12+ hours</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Symptoms */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <GlassCard>
            <div className="space-y-4">
              <h3 className="font-semibold">Any symptoms today? (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {symptomOptions.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-2 text-sm rounded-lg border-2 transition-all ${
                      formData.symptoms.includes(symptom)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {symptom.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Notes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <GlassCard>
            <div className="space-y-4">
              <h3 className="font-semibold">Any notes for today? (Optional)</h3>
              <Textarea
                placeholder="How are you feeling? Any specific concerns or observations..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="rounded-xl"
                rows={3}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Submit Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.mood || isSubmitting}
            className="w-full rounded-xl h-12"
            size="lg"
          >
            {isSubmitting ? "Creating Your Plan..." : "Generate My AI Plan"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}