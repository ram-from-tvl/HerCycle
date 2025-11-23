import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { LoadingBloom } from "@/components/LoadingBloom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Apple, Dumbbell, Heart, Leaf, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function DailyPlan() {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const data = await api.generatePlan();
      console.log("Plan data received:", data); // Debug log
      setPlanData(data);
    } catch (error) {
      console.error("Failed to load plan:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 p-4">
        <LoadingBloom 
          message="Creating your personalized plan..." 
          showAgentProgress={true}
        />
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 p-4 flex items-center justify-center">
        <GlassCard className="text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Plan Available</h2>
          <p className="text-muted-foreground mb-4">Unable to generate your daily plan. Please try again.</p>
          <Button onClick={loadPlan}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </GlassCard>
      </div>
    );
  }

  const plan = planData.final_plan;
  const agents = planData.agent_outputs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-glow/10 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Your AI-Generated Plan</h1>
          </div>
          <Button variant="outline" size="sm" onClick={loadPlan}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Success Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="bg-gradient-to-br from-green-500/20 to-primary-glow/30 border-green-200">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">{planData.message}</h3>
                <p className="text-sm text-green-600">9 AI agents have analyzed your data and created personalized recommendations</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Plan Overview */}
        {plan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="bg-gradient-to-br from-primary/20 to-primary-glow/30">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Sparkles className="w-6 h-6" />
                  <span>Today's Focus</span>
                </h2>
                
                <div className="bg-white/10 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-lg">{plan.focus_for_today}</h3>
                  <p className="text-sm opacity-90">{plan.reasoning_summary}</p>
                </div>

                {plan.encouraging_message && (
                  <div className="bg-pink-500/20 rounded-lg p-4 border border-pink-200">
                    <p className="text-sm font-medium text-pink-800">{plan.encouraging_message}</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Action Items */}
        {plan?.plan_items && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Your Action Plan</h3>
              <div className="space-y-3">
                {plan.plan_items.map((item: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="mt-1">
                      {item.category === 'nutrition' && <Apple className="w-4 h-4 text-green-500" />}
                      {item.category === 'movement' && <Dumbbell className="w-4 h-4 text-blue-500" />}
                      {item.category === 'emotional' && <Heart className="w-4 h-4 text-pink-500" />}
                      {item.category === 'other' && <BookOpen className="w-4 h-4 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">— {item.source_agent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Agent Outputs Accordion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Accordion type="single" collapsible className="space-y-4">
            
            {/* Cycle Pattern Agent */}
            {agents?.cycle_pattern && (
              <AccordionItem value="cycle" className="border-none">
                <GlassCard className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold">Cycle Pattern Insights</h4>
                        <p className="text-sm text-muted-foreground">AI analysis of your menstrual cycle</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-3">
                      <p className="text-sm">{agents.cycle_pattern.summary_text}</p>
                      {agents.cycle_pattern.predicted_days_until_next && (
                        <div className="bg-pink-50 p-3 rounded-lg">
                          <p className="text-sm font-medium">Next period prediction: {agents.cycle_pattern.predicted_days_until_next} days</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </GlassCard>
              </AccordionItem>
            )}

            {/* Nutrition Agent */}
            {agents?.nutrition && (
              <AccordionItem value="nutrition" className="border-none">
                <GlassCard className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Apple className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold">Nutrition Guidance</h4>
                        <p className="text-sm text-muted-foreground">{agents.nutrition.focus}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Meals</h5>
                        <div className="space-y-2 text-sm">
                          <p><strong>Breakfast:</strong> {agents.nutrition.meals?.breakfast}</p>
                          <p><strong>Lunch:</strong> {agents.nutrition.meals?.lunch}</p>
                          <p><strong>Snacks:</strong> {agents.nutrition.meals?.snacks}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Hydration</h5>
                        <p className="text-sm">{agents.nutrition.hydration}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </GlassCard>
              </AccordionItem>
            )}

            {/* Movement Agent */}
            {agents?.movement && (
              <AccordionItem value="movement" className="border-none">
                <GlassCard className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold">Movement Plan</h4>
                        <p className="text-sm text-muted-foreground">{agents.movement.routine?.name} ({agents.movement.routine?.duration})</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Today's Routine</h5>
                        <div className="space-y-2">
                          {agents.movement.routine?.exercises?.map((exercise: string, i: number) => (
                            <div key={i} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-sm">{exercise}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm whitespace-pre-line">{agents.movement.routine?.instructions}</div>
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <h6 className="font-medium text-yellow-800 mb-1">Safety Notes</h6>
                        <p className="text-xs text-yellow-700">{agents.movement.safety_notes}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </GlassCard>
              </AccordionItem>
            )}

            {/* Emotional Agent */}
            {agents?.emotional && (
              <AccordionItem value="emotional" className="border-none">
                <GlassCard className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold">Emotional Wellness</h4>
                        <p className="text-sm text-muted-foreground">{agents.emotional.mood_summary}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Support Suggestions</h5>
                        <ul className="space-y-1 text-sm">
                          {agents.emotional.support_suggestions?.map((suggestion: string, i: number) => (
                            <li key={i} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {agents.emotional.journaling_prompt && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h5 className="font-medium mb-2">Reflection Prompt</h5>
                          <p className="text-sm italic">"{agents.emotional.journaling_prompt}"</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </GlassCard>
              </AccordionItem>
            )}

            {/* Sustainability Agent */}
            {agents?.sustainability && (
              <AccordionItem value="sustainability" className="border-none">
                <GlassCard className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold">Sustainability Tips</h4>
                        <p className="text-sm text-muted-foreground">Eco-friendly period product recommendations</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      {agents.sustainability.recommended_alternative && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h5 className="font-medium mb-2">Recommended: {agents.sustainability.recommended_alternative.product}</h5>
                          <p className="text-sm mb-2">{agents.sustainability.recommended_alternative.reasoning}</p>
                          <div className="text-sm">
                            <p><strong>Annual savings:</strong> ₹{agents.sustainability.recommended_alternative.savings}</p>
                            <p><strong>Environmental impact:</strong> {agents.sustainability.recommended_alternative.environmental_benefit}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </GlassCard>
              </AccordionItem>
            )}

          </Accordion>
        </motion.div>

        {/* Generate New Plan Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="text-center">
            <Button onClick={() => navigate('/checkin')} size="lg" className="rounded-full px-8">
              Update Check-in & Generate New Plan
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
