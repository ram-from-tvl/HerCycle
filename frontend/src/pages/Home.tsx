import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, BookOpen, User, Heart, Brain } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [cycleData, setCycleData] = useState<any>(null);
  const [latestPlan, setLatestPlan] = useState<any>(null);
  const [greeting, setGreeting] = useState("");
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Check if user has completed profile setup
    checkProfileSetup();
  }, []);

  const checkProfileSetup = async () => {
    try {
      const profileResponse = await api.getProfile();
      const profile = profileResponse.profile;
      
      // Check if essential profile fields exist
      const hasEssentialFields = profile && profile.age && profile.diet_type;
      
      if (!hasEssentialFields) {
        // Redirect to onboarding if profile is incomplete
        navigate('/onboarding');
        return;
      }
      
      setHasProfile(true);
      
      // Fetch cycle data and latest plan
      Promise.all([
        api.getCyclePatterns().catch(console.error),
        api.getLatestPlan().catch(console.error)
      ]).then(([cycleResponse, planResponse]) => {
        setCycleData(cycleResponse);
        setLatestPlan(planResponse);
      });
    } catch (error) {
      console.error("Profile check failed:", error);
      // If profile doesn't exist, redirect to onboarding
      navigate('/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking profile
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if no profile (should be redirected already)
  if (!hasProfile) {
    return null;
  }

  const actionCards = [
    { icon: Heart, label: "Check-in", color: "from-pink-400 to-pink-300", path: "/checkin" },
    { icon: Sparkles, label: "Today's Plan", color: "from-primary to-primary-glow", path: "/plan" },
    { icon: Brain, label: "AI Agents", color: "from-violet-400 to-violet-300", path: "/agents" },
    { icon: Calendar, label: "Log Period", color: "from-blue-400 to-blue-300", path: "/calendar" },
    { icon: BookOpen, label: "Learn", color: "from-green-400 to-green-300", path: "/learn" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50 px-6 py-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-primary">HerCycle</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h2 className="text-3xl font-bold">{greeting}</h2>
          <p className="text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </motion.div>

        {/* Cycle Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="bg-gradient-to-br from-cycle to-primary-glow/20">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your Cycle</p>
                <h3 className="text-2xl font-bold">Day {cycleData?.current_day || "—"}</h3>
                <p className="text-sm">{cycleData?.phase || "Loading..."}</p>
              </div>
              <div className="w-24 h-24 rounded-full border-8 border-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{cycleData?.days_until_period || "—"}</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actionCards.map((card, index) => (
            <motion.div
              key={card.path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <GlassCard onClick={() => navigate(card.path)} className={`bg-gradient-to-br ${card.color} text-white cursor-pointer h-32 flex flex-col items-center justify-center space-y-2`}>
                <card.icon className="w-8 h-8" />
                <span className="font-semibold">{card.label}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Quick Tip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <GlassCard className="border-l-4 border-primary">
            <p className="text-sm text-muted-foreground mb-2">💡 Daily Tip</p>
            <p className="text-sm">Stay hydrated! Aim for 8 glasses of water today to support your body through your cycle.</p>
          </GlassCard>
        </motion.div>

        {/* Today's AI Recommendations - Show if plan exists */}
        {latestPlan?.final_plan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <GlassCard className="bg-gradient-to-br from-green-100/50 to-primary-glow/20 border-green-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-800">🌟 Today's AI Recommendations</h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/plan')} className="text-green-700 border-green-300">
                    View Full Plan
                  </Button>
                </div>
                
                <p className="text-sm text-green-700">{latestPlan.final_plan.focus_for_today}</p>
                
                {latestPlan.final_plan.plan_items && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Quick Actions:</p>
                    <div className="grid gap-2">
                      {latestPlan.final_plan.plan_items.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="flex items-start space-x-2 bg-white/50 rounded-lg p-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-xs text-green-800">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {latestPlan.final_plan.encouraging_message && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-medium text-green-800">✨ {latestPlan.final_plan.encouraging_message}</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* No Plan Yet - Encourage to start */}
        {!latestPlan?.final_plan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <GlassCard className="bg-gradient-to-br from-blue-100/50 to-primary-glow/20 border-blue-200">
              <div className="text-center space-y-3">
                <Brain className="w-12 h-12 text-blue-600 mx-auto" />
                <h3 className="text-lg font-semibold text-blue-800">Ready for Your AI-Powered Day?</h3>
                <p className="text-sm text-blue-700">Get personalized recommendations from 9 AI specialists</p>
                <div className="flex space-x-3 justify-center">
                  <Button onClick={() => navigate('/checkin')} className="bg-blue-600 hover:bg-blue-700">
                    Start Check-in
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/plan')} className="text-blue-700 border-blue-300">
                    Quick Plan
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-background/90 border-t border-border/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-around">
          {[
            { icon: Sparkles, label: "Home", path: "/" },
            { icon: Calendar, label: "Calendar", path: "/calendar" },
            { icon: Heart, label: "Check-in", path: "/checkin" },
            { icon: BookOpen, label: "Learn", path: "/learn" },
            { icon: User, label: "Profile", path: "/profile" },
          ].map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-primary transition-colors">
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
