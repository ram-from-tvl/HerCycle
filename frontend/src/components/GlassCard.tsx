import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard = ({ children, className, onClick }: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "backdrop-blur-md bg-white/80 dark:bg-card/80",
        "border border-white/30 dark:border-border/30",
        "rounded-3xl p-6",
        "shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.15)]",
        "transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.02] hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.25)]",
        className
      )}
    >
      {children}
    </div>
  );
};
