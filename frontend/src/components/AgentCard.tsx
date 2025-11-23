import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Badge } from "./ui/badge";

interface AgentCardProps {
  icon: LucideIcon;
  name: string;
  role: string;
  description: string;
  example: string;
  color: string;
  hasData?: boolean;
  status?: string;
}

export const AgentCard = ({ icon: Icon, name, role, description, example, color, hasData, status }: AgentCardProps) => {
  return (
    <GlassCard className="hover:scale-105 transition-transform duration-300">
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold">{name}</h3>
            {status && (
              <Badge 
                variant={hasData ? "default" : "secondary"}
                className={hasData ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}
              >
                {status}
              </Badge>
            )}
          </div>
          <p className="text-sm text-primary/80 mb-3 italic">{role}</p>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{description}</p>
          <div className="bg-background/60 rounded-lg p-3 border-l-4 border-primary/50">
            <p className="text-xs text-muted-foreground mb-1 font-medium">You see:</p>
            <p className="text-sm">{example}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
