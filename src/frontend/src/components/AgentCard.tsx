import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Tag, Zap } from "lucide-react";
import { StarRating } from "./StarRating";

const ICON_COLORS = [
  "from-cyan-500/20 to-blue-500/20",
  "from-purple-500/20 to-pink-500/20",
  "from-emerald-500/20 to-cyan-500/20",
  "from-amber-500/20 to-orange-500/20",
  "from-blue-500/20 to-purple-500/20",
  "from-pink-500/20 to-rose-500/20",
];

const ICONS = ["📊", "⚡", "✍️", "🧠", "🤖", "🔧", "🎯", "🔬", "📈", "🌐"];

const CATEGORY_COLORS: Record<string, string> = {
  "Data Analysis": "bg-nexus-cyan/10 text-nexus-cyan border-nexus-cyan/20",
  Automation: "bg-nexus-purple/10 text-nexus-purple border-nexus-purple/20",
  "Content Generation":
    "bg-status-completed/10 text-status-completed border-status-completed/20",
  "Decision Support": "bg-nexus-gold/10 text-nexus-gold border-nexus-gold/20",
};

interface AgentCardProps {
  // biome-ignore lint/suspicious/noExplicitAny: agent can be backend or sample type
  agent: any;
  index: number;
  // biome-ignore lint/suspicious/noExplicitAny: agent can be backend or sample type
  onHire: (agent: any) => void;
}

export function AgentCard({ agent, index, onHire }: AgentCardProps) {
  const icon = agent.icon || ICONS[index % ICONS.length];
  const iconBg = agent.iconBg || ICON_COLORS[index % ICON_COLORS.length];
  const rating = agent.rating ?? 4.5;
  const totalRatings = agent.totalRatings ?? 0;
  const price =
    typeof agent.pricePerTask === "bigint"
      ? Number(agent.pricePerTask)
      : agent.pricePerTask;
  const categoryColor =
    CATEGORY_COLORS[agent.category] ||
    "bg-secondary text-muted-foreground border-border";

  return (
    <div
      className="relative rounded-xl border border-border bg-card card-glow flex flex-col overflow-hidden group"
      data-ocid={`agent.card.${index + 1}`}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nexus-cyan/50 via-nexus-purple/50 to-transparent" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-2xl border border-border flex-shrink-0`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground text-base leading-tight truncate">
              {agent.name}
            </h3>
            <Badge
              className={`mt-1 text-xs font-medium border rounded-full px-2 py-0.5 ${categoryColor}`}
            >
              {agent.category}
            </Badge>
          </div>
          <div className="flex-shrink-0">
            {agent.available ? (
              <span className="flex items-center gap-1 text-xs text-status-completed">
                <span className="w-1.5 h-1.5 rounded-full bg-status-completed animate-pulse" />
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Offline
              </span>
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {agent.description}
        </p>

        <div className="flex items-center gap-2">
          <StarRating rating={rating} size="sm" />
          <span className="text-nexus-gold text-sm font-semibold">
            {rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground text-xs">
            ({totalRatings} reviews)
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground font-bold text-base">{price}</span>
          <span className="text-muted-foreground text-xs">ICP / task</span>
        </div>
        <Button
          onClick={() => onHire(agent)}
          disabled={!agent.available}
          className="btn-gradient rounded-full px-4 py-2 text-sm font-semibold border-0 flex items-center gap-1.5"
          data-ocid={`agent.hire.button.${index + 1}`}
        >
          <Zap className="w-3.5 h-3.5" />
          Hire Agent
        </Button>
      </div>
    </div>
  );
}
