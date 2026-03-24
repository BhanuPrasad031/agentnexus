import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Bot,
  CheckCircle,
  Coins,
  LayoutDashboard,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { TaskState } from "../backend";
import { StarRating } from "../components/StarRating";
import { StatusChip } from "../components/StatusChip";
import { SAMPLE_AGENTS } from "../data/sampleAgents";
import type { SampleAgent } from "../data/sampleAgents";
import { useGetAllAgents, useGetMarketplaceStats } from "../hooks/useQueries";

const SAMPLE_TRANSACTIONS = [
  {
    id: 1,
    task: "Q3 Revenue Analysis",
    agent: "DataSight AI",
    status: TaskState.completed,
    amount: 5,
    time: "2 hours ago",
  },
  {
    id: 2,
    task: "Automate Invoice Processing",
    agent: "AutoFlow Agent",
    status: TaskState.inProgress,
    amount: 3,
    time: "5 hours ago",
  },
  {
    id: 3,
    task: "Blog Post: Web3 Trends",
    agent: "ContentCraft Pro",
    status: TaskState.completed,
    amount: 4,
    time: "1 day ago",
  },
  {
    id: 4,
    task: "Market Entry Strategy",
    agent: "StrategyBot X",
    status: TaskState.pending,
    amount: 8,
    time: "1 day ago",
  },
  {
    id: 5,
    task: "Customer Churn Prediction",
    agent: "NexusML Agent",
    status: TaskState.completed,
    amount: 12,
    time: "2 days ago",
  },
];

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetMarketplaceStats();
  const { data: backendAgents } = useGetAllAgents();

  const agents: SampleAgent[] =
    backendAgents && backendAgents.length > 0
      ? backendAgents.map((a, i) => ({
          id: i + 1,
          name: a.name,
          category: a.category,
          description: a.description,
          pricePerTask: Number(a.pricePerTask),
          available: a.available,
          rating: 4.5,
          totalRatings: 0,
          icon: "🤖",
          iconBg: "from-cyan-500/20 to-blue-500/20",
        }))
      : SAMPLE_AGENTS;

  const topAgents = [...agents]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Agents",
      value: statsLoading
        ? null
        : stats
          ? Number(stats.totalAgents).toLocaleString()
          : agents.length.toString(),
      icon: <Bot className="w-5 h-5" />,
      color: "from-nexus-cyan/20 to-blue-500/20",
      iconColor: "text-nexus-cyan",
      change: "+12 this week",
    },
    {
      label: "Total Tasks",
      value: statsLoading
        ? null
        : stats
          ? Number(stats.totalTasks).toLocaleString()
          : "2,847",
      icon: <ListTodo className="w-5 h-5" />,
      color: "from-nexus-purple/20 to-pink-500/20",
      iconColor: "text-nexus-purple",
      change: "+156 this week",
    },
    {
      label: "Completed Tasks",
      value: statsLoading
        ? null
        : stats
          ? Number(stats.completedTasks).toLocaleString()
          : "2,401",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "from-status-completed/20 to-emerald-600/20",
      iconColor: "text-status-completed",
      change: "84.4% success rate",
    },
    {
      label: "Total Volume",
      value: statsLoading
        ? null
        : stats
          ? `${Number(stats.totalVolume).toLocaleString()} ICP`
          : "18,432 ICP",
      icon: <Coins className="w-5 h-5" />,
      color: "from-nexus-gold/20 to-amber-600/20",
      iconColor: "text-nexus-gold",
      change: "+820 ICP today",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-nexus-cyan" />
              <h1 className="font-display text-3xl font-bold text-foreground">
                Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Overview of the AgentNexus decentralized marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-5 card-glow relative overflow-hidden"
                data-ocid={`dashboard.stat.card.${i + 1}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-30`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {card.label}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center ${card.iconColor}`}
                    >
                      {card.icon}
                    </div>
                  </div>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-24 bg-secondary" />
                  ) : (
                    <div className="text-2xl font-display font-bold text-foreground">
                      {card.value}
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-status-completed" />
                    <span className="text-xs text-muted-foreground">
                      {card.change}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <Activity className="w-4 h-4 text-nexus-cyan" />
                <h2 className="font-display font-semibold text-foreground">
                  Recent Transactions
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table
                  className="w-full"
                  data-ocid="dashboard.transactions.table"
                >
                  <thead>
                    <tr className="border-b border-border">
                      {["Task", "Agent", "Status", "Amount", "Time"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_TRANSACTIONS.map((tx, i) => (
                      <tr
                        key={tx.id}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                        data-ocid={`dashboard.transaction.row.${i + 1}`}
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm text-foreground font-medium truncate max-w-[180px] block">
                            {tx.task}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-nexus-cyan">
                            {tx.agent}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusChip state={tx.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold text-foreground">
                            {tx.amount}{" "}
                            <span className="text-muted-foreground font-normal">
                              ICP
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground">
                            {tx.time}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-nexus-purple" />
                <h2 className="font-display font-semibold text-foreground">
                  Top Rated Agents
                </h2>
              </div>
              <div className="divide-y divide-border">
                {topAgents.map((agent, i) => (
                  <div
                    key={agent.id}
                    className="px-5 py-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors"
                    data-ocid={`dashboard.topagent.item.${i + 1}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-nexus-cyan/20 to-nexus-purple/20 flex items-center justify-center text-xs font-bold text-nexus-cyan flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="text-xl flex-shrink-0">{agent.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {agent.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.category}
                      </p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <StarRating rating={agent.rating ?? 4.5} size="sm" />
                      <span className="text-xs text-nexus-gold font-bold">
                        {(agent.rating ?? 4.5).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
