import { Flower2 } from "lucide-react";
import { AgentProgress } from "./AgentProgress";
import { useEffect, useState } from "react";

interface LoadingBloomProps {
  message?: string;
  showAgentProgress?: boolean;
}

interface AgentStep {
  name: string;
  status: "pending" | "active" | "complete";
}

export const LoadingBloom = ({ 
  message = "Creating your personalized plan...", 
  showAgentProgress = false 
}: LoadingBloomProps) => {
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([
    { name: "🔮 Analyzing cycle patterns", status: "active" },
    { name: "🔍 Finding symptom correlations", status: "pending" },
    { name: "🥗 Selecting personalized foods", status: "pending" },
    { name: "🧘‍♀️ Creating movement plan", status: "pending" },
    { name: "💙 Preparing emotional support", status: "pending" },
    { name: "♻️ Calculating sustainability options", status: "pending" },
    { name: "📚 Gathering resources", status: "pending" },
    { name: "🎯 Coordinating recommendations", status: "pending" },
    { name: "🛡️ Safety validation", status: "pending" },
  ]);

  useEffect(() => {
    if (!showAgentProgress) return;

    const intervals: NodeJS.Timeout[] = [];
    
    agentSteps.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setAgentSteps(prev => 
          prev.map((step, i) => {
            if (i < index) return { ...step, status: "complete" as const };
            if (i === index) return { ...step, status: "active" as const };
            return step;
          })
        );
      }, index * 3000);
      intervals.push(timeout);
    });

    return () => intervals.forEach(clearTimeout);
  }, [showAgentProgress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 px-4">
      <div className="relative">
        <Flower2 className="w-24 h-24 text-primary animate-bloom" />
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
      </div>
      <p className="text-lg text-muted-foreground animate-fade-in text-center">{message}</p>
      {showAgentProgress && (
        <div className="w-full max-w-md animate-fade-in">
          <p className="text-sm text-muted-foreground text-center mb-4">Your AI Team is Working...</p>
          <AgentProgress steps={agentSteps} />
        </div>
      )}
    </div>
  );
};
