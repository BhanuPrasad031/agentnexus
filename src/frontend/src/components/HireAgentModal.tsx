import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, Tag, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TaskState } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAutoCompleteTask, useSubmitTask } from "../hooks/useQueries";
import { generateAiOutput } from "../utils/aiOutputGenerator";

interface HireAgentModalProps {
  // biome-ignore lint/suspicious/noExplicitAny: agent can be backend or sample type
  agent: any;
  open: boolean;
  onClose: () => void;
}

export function HireAgentModal({ agent, open, onClose }: HireAgentModalProps) {
  const [description, setDescription] = useState("");
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const submitTask = useSubmitTask();
  const autoCompleteTask = useAutoCompleteTask();

  const price = agent
    ? typeof agent.pricePerTask === "bigint"
      ? Number(agent.pricePerTask)
      : agent.pricePerTask
    : 0;
  const agentId = agent
    ? typeof agent.id === "bigint"
      ? agent.id
      : BigInt(agent.id ?? 0)
    : 0n;

  const triggerAiExecution = async (
    taskId: bigint,
    taskDescription: string,
  ) => {
    const toastId = toast.loading("🤖 AI agent initializing...");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      toast.loading("⚙️ Processing your task...", { id: toastId });
      await new Promise((r) => setTimeout(r, 2000));
      const output = generateAiOutput(agent?.category ?? "", taskDescription);
      await autoCompleteTask.mutateAsync({ taskId, output });
      toast.success("✓ Task completed by AI!", { id: toastId });
    } catch (err) {
      console.error("AI execution error:", err);
      toast.dismiss(toastId);
    }
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a task description");
      return;
    }
    try {
      const taskId = await submitTask.mutateAsync({
        agentId,
        description: description.trim(),
        output: "",
        state: TaskState.pending,
      });
      toast.success("Task submitted!");
      setDescription("");
      onClose();
      // Fire and forget — AI executes in background
      triggerAiExecution(taskId, description.trim());
    } catch {
      toast.error("Failed to submit task. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="hire.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-nexus-cyan" />
            Hire {agent?.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Submit your task — AI will execute it automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {agent && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-nexus-cyan" />
                <span className="text-sm text-muted-foreground">Category</span>
              </div>
              <span className="text-sm text-foreground font-medium">
                {agent.category}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-nexus-cyan/5 border border-nexus-cyan/20">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-nexus-cyan" />
              <span className="text-sm text-muted-foreground">Payment</span>
            </div>
            <span className="text-foreground font-bold">{price} ICP</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-desc" className="text-foreground text-sm">
              Task Description *
            </Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need the agent to do in detail..."
              rows={4}
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground resize-none focus:border-nexus-cyan/50"
              data-ocid="hire.textarea"
            />
          </div>

          {!isLoggedIn && (
            <p className="text-xs text-status-pending text-center p-2 rounded-lg border border-status-pending/20 bg-status-pending/5">
              ⚠️ Connect your wallet to submit a task
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-muted-foreground hover:bg-secondary"
            data-ocid="hire.cancel.button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitTask.isPending}
            className="btn-gradient border-0 rounded-lg"
            data-ocid="hire.submit.button"
          >
            {submitTask.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
              </>
            ) : isLoggedIn ? (
              <>
                <Zap className="w-4 h-4 mr-2" /> Submit Task
              </>
            ) : (
              "Connect & Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
