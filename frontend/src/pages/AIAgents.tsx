import { motion } from "framer-motion";
import { ArrowLeft, Brain, TrendingUp, Apple, Dumbbell, Heart, Leaf, BookOpen, Target, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentCard } from "@/components/AgentCard";
import { GlassCard } from "@/components/GlassCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AIAgents() {
  const navigate = useNavigate();
  const [latestPlan, setLatestPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestPlan();
  }, []);

  const loadLatestPlan = async () => {
    try {
      const planData = await api.getLatestPlan();
      setLatestPlan(planData);
    } catch (error) {
      console.error("Failed to load latest plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const agents = [
    {
      icon: Brain,
      name: "Cycle Forecaster",
      role: "Your personal cycle predictor",
      description: "Analyzes your cycle history using machine learning to predict your next period with confidence scores. Uses SHAP AI to explain why predictions are accurate.",
      example: "Next period: Dec 1 (8 days away) - HIGH confidence",
      color: "bg-cycle",
      hasData: latestPlan?.agent_outputs?.cycle_pattern_agent ? true : false,
      status: latestPlan?.agent_outputs?.cycle_pattern_agent ? "Active" : "Standby"
    },
    {
      icon: TrendingUp,
      name: "Pattern Detective",
      role: "Finds hidden connections",
      description: "Discovers correlations between your symptoms, sleep, and activities. Tracks trends over time to give you actionable insights.",
      example: "When you sleep <6 hours, pain increases 40%",
      color: "bg-primary/20",
      hasData: latestPlan?.agent_outputs?.symptom_insight_agent ? true : false,
      status: latestPlan?.agent_outputs?.symptom_insight_agent ? "Active" : "Standby"
    },
    {
      icon: Apple,
      name: "Personal Nutritionist",
      role: "Recommends foods tailored to YOU",
      description: "Matches foods to your symptoms while respecting your diet type, constraints, budget, and food access. Suggests regional options.",
      example: "Spinach curry (high iron → reduces fatigue)",
      color: "bg-nutrition",
      hasData: latestPlan?.agent_outputs?.nutrition_agent ? true : false,
      status: latestPlan?.agent_outputs?.nutrition_agent ? "Active" : "Standby"
    },
    {
      icon: Dumbbell,
      name: "Movement Coach",
      role: "Creates safe exercise plans",
      description: "Adapts workouts to your pain level, available space, fitness level, and time. Provides safety warnings based on your cycle phase.",
      example: "Gentle yoga (10min, room-based) - SAFE for day 2",
      color: "bg-movement",
      hasData: latestPlan?.agent_outputs?.movement_agent ? true : false,
      status: latestPlan?.agent_outputs?.movement_agent ? "Active" : "Standby"
    },
    {
      icon: Heart,
      name: "Emotional Support Specialist",
      role: "Provides mental health strategies",
      description: "Assesses your mood and suggests evidence-based coping techniques. Offers cycle-phase affirmations and knows when to recommend professional help.",
      example: "Try 4-7-8 breathing → instant calm",
      color: "bg-emotional",
      hasData: latestPlan?.agent_outputs?.emotional_agent ? true : false,
      status: latestPlan?.agent_outputs?.emotional_agent ? "Active" : "Standby"
    },
    {
      icon: Leaf,
      name: "Sustainability Advisor",
      role: "Analyzes products & impact",
      description: "Calculates yearly costs of menstrual products, suggests eco-friendly alternatives, and shows long-term savings with honest pros & cons.",
      example: "Switch to cup → save ₹1,200/year + 99% less waste",
      color: "bg-green-200 dark:bg-green-900",
      hasData: latestPlan?.agent_outputs?.sustainability_agent ? true : false,
      status: latestPlan?.agent_outputs?.sustainability_agent ? "Active" : "Standby"
    },
    {
      icon: BookOpen,
      name: "Research Librarian",
      role: "Finds relevant health articles",
      description: "Searches 100+ vetted medical sources and matches articles to your current symptoms. Provides reading time estimates and trusted links.",
      example: "Understanding PMS (5min read) - Matches your symptoms",
      color: "bg-primary/20",
      hasData: latestPlan?.agent_outputs?.knowledge_resource_agent ? true : false,
      status: latestPlan?.agent_outputs?.knowledge_resource_agent ? "Active" : "Standby"
    },
    {
      icon: Target,
      name: "Care Coordinator",
      role: "Ties everything together",
      description: "Synthesizes insights from all 8 agents, prioritizes your daily actions, and creates a cohesive wellness message personalized to you.",
      example: "Today's focus: gentle movement + iron-rich foods",
      color: "bg-violet-200 dark:bg-violet-900",
      hasData: latestPlan?.final_plan ? true : false,
      status: latestPlan?.final_plan ? "Active" : "Standby"
    },
    {
      icon: Shield,
      name: "Safety Guardian",
      role: "Ensures medical safety",
      description: "Reviews all recommendations, adds appropriate disclaimers, lists emergency warning signs, and validates that advice is medically sound.",
      example: "⚠️ Seek help if pain >8/10 or fever >101°F",
      color: "bg-red-100 dark:bg-red-900/30",
      hasData: latestPlan?.agent_outputs?.safety_agent ? true : false,
      status: latestPlan?.agent_outputs?.safety_agent ? "Active" : "Standby"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50 px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Meet Your AI Team</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="bg-gradient-to-br from-primary/20 to-primary-glow/30 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">🤖 9 AI Specialists</h2>
              <p className="text-lg">Working together just for you</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <span>⏱️ 30-60 seconds</span>
                <span>•</span>
                <span>100% personalized</span>
                <span>•</span>
                <span>Research-backed</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Plan Status Summary - Only show if a plan exists */}
        {!loading && latestPlan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-200">AI Team Active</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {agents.filter(agent => agent.hasData).length}
                  </div>
                  <div className="text-green-700 dark:text-green-300">Active Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {latestPlan.final_plan ? '✓' : '○'}
                  </div>
                  <div className="text-green-700 dark:text-green-300">Plan Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-green-700 dark:text-green-300">Last Updated</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 text-center">⚙️ How It Works</h3>
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-primary/20 rounded-full px-4 py-2 font-medium">You Request Daily Plan</div>
                <span className="text-2xl">→</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-primary/20 rounded-full px-4 py-2 font-medium">9 Agents Analyze</div>
                <span className="text-2xl">→</span>
              </div>
              <div className="bg-gradient-to-r from-primary/20 to-primary-glow/30 rounded-full px-6 py-3 font-bold text-lg">
                Personalized Wellness Plan ✨
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Each agent specializes in one area → Together they create your complete plan!
            </p>
          </GlassCard>
        </motion.div>

        {/* Agent Cards */}
        <div className="space-y-4">
          {agents.map((agent, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <AgentCard {...agent} />
            </motion.div>
          ))}
        </div>

        {/* Why 9 Agents */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <GlassCard className="bg-gradient-to-br from-primary/10 to-primary-glow/20">
            <h3 className="text-xl font-bold mb-4">🌟 Why 9 Agents?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-semibold text-destructive">Traditional AI:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>❌ One generic chatbot</li>
                  <li>❌ One-size-fits-all advice</li>
                  <li>❌ No personalization</li>
                  <li>❌ Can't explain why</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-primary">HerCycle:</p>
                <ul className="space-y-1 text-sm">
                  <li>✅ 9 specialized experts</li>
                  <li>✅ Deep domain expertise</li>
                  <li>✅ Tailored to YOUR profile</li>
                  <li>✅ Explains the "why"</li>
                  <li>✅ Safety-validated</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <Button onClick={() => navigate("/plan")} className="w-full rounded-full" size="lg">
            See Your AI Team in Action ✨
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
