import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/GlassCard";
import { Flower2, ChevronRight } from "lucide-react";
import { api, UserProfile } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const steps = ["welcome", "basic", "lifestyle", "wellness", "cycle"] as const;
type Step = typeof steps[number];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    diet_type: "vegetarian",
    food_constraints: [],
    budget_level: "medium",
    food_access: "cook",
    movement_space: "home",
    activity_background: "beginner",  // Fixed: was fitness_level
    time_availability: "15-20min",     // Fixed: was time_available
    emotional_comfort_level: "medium",
    preferred_product: "pads",
  });

  // Cycle tracking state
  const [cycleData, setCycleData] = useState({
    is_on_period: false,
    period_start_date: "",
    days_since_last_period: null as number | null,
  });

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    try {
      // Save profile
      await api.updateProfile(formData);
      
      // Save cycle tracking info
      await api.setCycleTracking(cycleData);
      
      navigate("/");
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      handleComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/20 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {currentStep === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <Flower2 className="w-32 h-32 mx-auto text-primary animate-float" />
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-foreground">Welcome to HerCycle</h1>
              <p className="text-xl text-muted-foreground">Your gentle companion for holistic wellness</p>
            </div>
            <Button onClick={nextStep} size="lg" className="rounded-full px-8">
              Begin Your Journey <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {currentStep === "basic" && (
          <motion.div
            key="basic"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-md w-full space-y-6"
          >
            <div className="flex justify-center space-x-2 mb-8">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === 0 ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
              ))}
            </div>
            <GlassCard>
              <h2 className="text-3xl font-bold mb-6">Let's get to know you</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Age *</label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={formData.age || ""}
                    onChange={(e) => updateField("age", parseInt(e.target.value))}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Height (cm) - Optional</label>
                  <Input
                    type="number"
                    placeholder="165"
                    value={formData.height_cm || ""}
                    onChange={(e) => updateField("height_cm", parseInt(e.target.value))}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Weight (kg) - Optional</label>
                  <Input
                    type="number"
                    placeholder="60"
                    value={formData.weight_kg || ""}
                    onChange={(e) => updateField("weight_kg", parseInt(e.target.value))}
                    className="rounded-2xl"
                  />
                </div>
              </div>
              <Button onClick={nextStep} className="w-full mt-6 rounded-full" disabled={!formData.age}>
                Continue
              </Button>
            </GlassCard>
          </motion.div>
        )}

        {currentStep === "lifestyle" && (
          <motion.div
            key="lifestyle"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-md w-full space-y-6"
          >
            <div className="flex justify-center space-x-2 mb-8">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === 1 ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
              ))}
            </div>
            <GlassCard>
              <h2 className="text-3xl font-bold mb-6">Your Lifestyle</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Diet Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["vegetarian", "non_veg", "vegan", "eggetarian"].map(type => (
                      <button
                        key={type}
                        onClick={() => updateField("diet_type", type)}
                        className={`p-3 rounded-2xl border-2 transition-all capitalize ${
                          formData.diet_type === type
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {type.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Food Access</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "cook", label: "Cook at Home" },
                      { value: "mess", label: "Mess/Canteen" },
                      { value: "delivery", label: "Delivery" },
                      { value: "mixed", label: "Mixed" }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateField("food_access", option.value)}
                        className={`p-3 rounded-2xl border-2 transition-all ${
                          formData.food_access === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Budget Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["low", "medium", "high"].map(level => (
                      <button
                        key={level}
                        onClick={() => updateField("budget_level", level)}
                        className={`p-3 rounded-2xl border-2 transition-all capitalize ${
                          formData.budget_level === level
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={nextStep} className="w-full mt-6 rounded-full">
                Continue
              </Button>
            </GlassCard>
          </motion.div>
        )}

        {currentStep === "wellness" && (
          <motion.div
            key="wellness"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-md w-full space-y-6"
          >
            <div className="flex justify-center space-x-2 mb-8">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === 3 ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
              ))}
            </div>
            <GlassCard>
              <h2 className="text-3xl font-bold mb-6">Movement & Wellness</h2>
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label className="text-sm font-medium mb-3 block">Exercise Space</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["room", "home", "gym", "outdoor"].map(space => (
                      <button
                        key={space}
                        onClick={() => updateField("movement_space", space)}
                        className={`p-3 rounded-2xl border-2 transition-all capitalize ${
                          formData.movement_space === space
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {space}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Fitness Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["beginner", "intermediate", "advanced"].map(level => (
                      <button
                        key={level}
                        onClick={() => updateField("activity_background", level)}
                        className={`p-3 rounded-2xl border-2 transition-all capitalize ${
                          formData.activity_background === level
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Time Available</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["5-10min", "15-20min", "30min+"].map(time => (
                      <button
                        key={time}
                        onClick={() => updateField("time_availability", time)}
                        className={`p-3 rounded-2xl border-2 transition-all ${
                          formData.time_availability === time
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {time} min
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Preferred Product</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "pads", label: "Pads" },
                      { value: "tampons", label: "Tampons" },
                      { value: "cup", label: "Cup" },
                      { value: "period_underwear", label: "Period Underwear" }
                    ].map(product => (
                      <button
                        key={product.value}
                        onClick={() => updateField("preferred_product", product.value)}
                        className={`p-3 rounded-2xl border-2 transition-all ${
                          formData.preferred_product === product.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {product.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={() => setCurrentStep("cycle")} className="w-full mt-6 rounded-full">
                Next
              </Button>
            </GlassCard>
          </motion.div>
        )}

        {currentStep === "cycle" && (
          <motion.div
            key="cycle"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-md w-full space-y-6"
          >
            <div className="flex justify-center space-x-2 mb-8">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === 4 ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
              ))}
            </div>
            <GlassCard>
              <h2 className="text-3xl font-bold mb-6">Cycle Tracking</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Are you currently on your period?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCycleData(prev => ({ ...prev, is_on_period: true, days_since_last_period: null }))}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        cycleData.is_on_period
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      Yes, I'm on my period
                    </button>
                    <button
                      onClick={() => setCycleData(prev => ({ ...prev, is_on_period: false }))}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        !cycleData.is_on_period && cycleData.days_since_last_period !== null
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      No, not currently
                    </button>
                  </div>
                </div>

                {!cycleData.is_on_period && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">How many days since your last period started?</label>
                    <Input
                      type="number"
                      placeholder="Enter days (e.g., 15)"
                      value={cycleData.days_since_last_period || ""}
                      onChange={(e) => setCycleData(prev => ({ 
                        ...prev, 
                        days_since_last_period: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      className="text-center"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This helps us determine your current cycle phase
                    </p>
                  </div>
                )}

                {cycleData.is_on_period && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">When did your current period start?</label>
                    <Input
                      type="date"
                      value={cycleData.period_start_date}
                      onChange={(e) => setCycleData(prev => ({ 
                        ...prev, 
                        period_start_date: e.target.value 
                      }))}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>
              <Button 
                onClick={handleComplete} 
                className="w-full mt-6 rounded-full"
                disabled={
                  (!cycleData.is_on_period && cycleData.days_since_last_period === null) ||
                  (cycleData.is_on_period && !cycleData.period_start_date)
                }
              >
                Complete Setup
              </Button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
