import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface AgentStep {
  name: string;
  status: "pending" | "active" | "complete";
}

interface AgentProgressProps {
  steps: AgentStep[];
}

export const AgentProgress = ({ steps }: AgentProgressProps) => {
  return (
    <div className="space-y-3 w-full max-w-md">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3"
        >
          <div className="flex-shrink-0">
            {step.status === "complete" && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            {step.status === "active" && (
              <div className="w-6 h-6 rounded-full bg-primary/50 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
              </div>
            )}
            {step.status === "pending" && (
              <div className="w-6 h-6 rounded-full bg-muted" />
            )}
          </div>
          <p
            className={`text-sm ${
              step.status === "complete"
                ? "text-foreground"
                : step.status === "active"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }`}
          >
            {step.name}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
