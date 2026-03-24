import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ChevronDown,
  ListTodo,
  Loader2,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TaskState } from "../backend";
import type { Task } from "../backend";
import { StarRating } from "../components/StarRating";
import { StatusChip } from "../components/StatusChip";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCancelTask,
  useGetUserTasks,
  useRateAgent,
} from "../hooks/useQueries";

const SAMPLE_TASKS: (Task & { agentName: string })[] = [
  {
    agentId: 1n,
    description:
      "Analyze Q3 sales data and identify top performing regions with trend forecasting",
    state: TaskState.completed,
    createdAt: BigInt(Date.now() - 86400000) * 1000000n,
    user: {} as any,
    output:
      "Analysis complete. Top regions: North (32% growth), West (28% growth). Forecast shows 15% Q4 increase.",
    agentName: "DataSight AI",
  },
  {
    agentId: 2n,
    description:
      "Automate weekly report generation from our CRM and send to stakeholders",
    state: TaskState.inProgress,
    createdAt: BigInt(Date.now() - 3600000) * 1000000n,
    user: {} as any,
    agentName: "AutoFlow Agent",
  },
  {
    agentId: 3n,
    description:
      "Write 5 product descriptions for our new AI productivity tools",
    state: TaskState.pending,
    createdAt: BigInt(Date.now() - 1800000) * 1000000n,
    user: {} as any,
    agentName: "ContentCraft Pro",
  },
];

export function MyTasksPage() {
  const [filter, setFilter] = useState("all");
  // biome-ignore lint/suspicious/noExplicitAny: task can be backend or sample type
  const [ratingModal, setRatingModal] = useState<{
    task: any;
    open: boolean;
  } | null>(null);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: backendTasks, isLoading } = useGetUserTasks();
  const cancelTask = useCancelTask();
  const rateAgent = useRateAgent();

  const tasks =
    backendTasks && backendTasks.length > 0
      ? backendTasks.map((t) => ({
          ...t,
          agentName: `Agent #${Number(t.agentId)}`,
        }))
      : SAMPLE_TASKS;

  const filtered =
    filter === "all"
      ? tasks
      : tasks.filter((t) => {
          if (filter === "pending") return t.state === TaskState.pending;
          if (filter === "inProgress") return t.state === TaskState.inProgress;
          if (filter === "completed") return t.state === TaskState.completed;
          if (filter === "cancelled") return t.state === TaskState.cancelled;
          return true;
        });

  const handleCancel = async (taskId: bigint) => {
    try {
      await cancelTask.mutateAsync(taskId);
      toast.success("Task cancelled");
    } catch {
      toast.error("Failed to cancel task");
    }
  };

  const handleRate = async () => {
    if (!ratingModal) return;
    try {
      await rateAgent.mutateAsync({
        agentId: ratingModal.task.agentId,
        stars: BigInt(stars),
        comment: comment.trim() || null,
      });
      toast.success("Rating submitted!");
      setRatingModal(null);
      setComment("");
      setStars(5);
    } catch {
      toast.error("Failed to submit rating");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto opacity-40" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Connect to View Tasks
          </h2>
          <p className="text-muted-foreground">
            Connect your wallet to see your submitted tasks
          </p>
          <Button
            onClick={login}
            className="btn-gradient border-0 rounded-full"
            data-ocid="tasks.connect.button"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-2">
              <ListTodo className="w-6 h-6 text-nexus-cyan" />
              <h1 className="font-display text-3xl font-bold text-foreground">
                My Tasks
              </h1>
            </div>
            <p className="text-muted-foreground">
              Track and manage all your submitted AI agent tasks
            </p>
          </div>

          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList className="bg-card border border-border">
              {["all", "pending", "inProgress", "completed", "cancelled"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:bg-nexus-cyan/10 data-[state=active]:text-nexus-cyan text-muted-foreground text-xs capitalize"
                    data-ocid={`tasks.${tab}.tab`}
                  >
                    {tab === "inProgress"
                      ? "In Progress"
                      : tab === "all"
                        ? "All"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="space-y-4" data-ocid="tasks.loading_state">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-5 h-24 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="tasks.empty_state"
            >
              <ListTodo className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                No tasks found
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                You haven't submitted any tasks yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((task, i) => (
                <motion.div
                  key={`task-${task.agentId.toString()}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-5 card-glow"
                  data-ocid={`tasks.item.${i + 1}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusChip state={task.state} />
                        <span className="text-xs text-muted-foreground">
                          Agent:{" "}
                          <span className="text-nexus-cyan">
                            {task.agentName}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            Number(task.createdAt) / 1000000,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground text-sm font-medium leading-relaxed">
                        {task.description}
                      </p>
                      {task.output && (
                        <div className="mt-2 p-3 rounded-lg bg-status-completed/5 border border-status-completed/20">
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <ChevronDown className="w-3 h-3" /> Output
                          </p>
                          <p className="text-sm text-foreground">
                            {task.output}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      {task.state === TaskState.completed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRatingModal({ task, open: true })}
                          className="border-nexus-gold/30 text-nexus-gold hover:bg-nexus-gold/10 text-xs"
                          data-ocid={`tasks.rate.button.${i + 1}`}
                        >
                          <Star className="w-3.5 h-3.5 mr-1" />
                          Rate
                        </Button>
                      )}
                      {task.state === TaskState.pending && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(task.agentId)}
                          disabled={cancelTask.isPending}
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
                          data-ocid={`tasks.cancel.button.${i + 1}`}
                        >
                          {cancelTask.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Cancel"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {ratingModal && (
        <Dialog
          open={ratingModal.open}
          onOpenChange={(v) => !v && setRatingModal(null)}
        >
          <DialogContent
            className="bg-card border-border max-w-sm"
            data-ocid="rating.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-nexus-gold" />
                Rate Agent
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center gap-3">
                <p className="text-muted-foreground text-sm">
                  How was your experience?
                </p>
                <StarRating
                  rating={stars}
                  interactive
                  onRate={setStars}
                  size="lg"
                />
                <p className="text-nexus-gold font-bold text-lg">{stars}/5</p>
              </div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment (optional)..."
                rows={3}
                className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground resize-none"
                data-ocid="rating.comment.textarea"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setRatingModal(null)}
                className="border-border"
                data-ocid="rating.cancel.button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRate}
                disabled={rateAgent.isPending}
                className="btn-gradient border-0"
                data-ocid="rating.submit.button"
              >
                {rateAgent.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit Rating"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
