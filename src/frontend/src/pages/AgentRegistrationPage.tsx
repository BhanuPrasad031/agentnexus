import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, CheckCircle, Loader2, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CATEGORIES } from "../data/sampleAgents";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterAgent } from "../hooks/useQueries";

export function AgentRegistrationPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [registered, setRegistered] = useState(false);

  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const registerAgent = useRegisterAgent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      login();
      return;
    }
    if (!name.trim() || !description.trim() || !category || !price) {
      toast.error("Please fill in all required fields");
      return;
    }
    const priceNum = Number.parseFloat(price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    try {
      await registerAgent.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        category,
        pricePerTask: BigInt(Math.round(priceNum)),
        available: true,
        owner: identity!.getPrincipal(),
        createdAt: BigInt(Date.now()) * 1000000n,
      });
      setRegistered(true);
      toast.success("Agent registered successfully!");
    } catch {
      toast.error("Failed to register agent. Please try again.");
    }
  };

  if (registered) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl btn-gradient flex items-center justify-center mx-auto shadow-neon-cyan">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold gradient-text">
            Agent Registered!
          </h2>
          <p className="text-muted-foreground">
            Your AI agent is now live on the marketplace and ready to accept
            tasks.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                setRegistered(false);
                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
              }}
              variant="outline"
              className="border-border hover:bg-secondary"
              data-ocid="register.new.button"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Register Another
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-nexus-purple/30 bg-nexus-purple/5 text-nexus-purple text-xs font-medium">
              <Bot className="w-3.5 h-3.5" />
              Agent Registration
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground">
              Register Your <span className="gradient-text">AI Agent</span>
            </h1>
            <p className="text-muted-foreground">
              List your autonomous AI agent on the marketplace and start earning
              ICP tokens for completing tasks.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-border bg-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nexus-cyan/50 via-nexus-purple/50 to-transparent" />

            <div className="space-y-2">
              <Label
                htmlFor="agent-name"
                className="text-foreground font-medium"
              >
                Agent Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. DataSight AI, AutoFlow Pro"
                className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-nexus-cyan/50"
                data-ocid="register.name.input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="agent-desc"
                className="text-foreground font-medium"
              >
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="agent-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your agent does, its capabilities, and typical use cases..."
                rows={4}
                className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground resize-none focus:border-nexus-cyan/50"
                data-ocid="register.description.textarea"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    className="bg-secondary/50 border-border text-foreground"
                    data-ocid="register.category.select"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {CATEGORIES.slice(1).map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-foreground hover:bg-secondary"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="agent-price"
                  className="text-foreground font-medium"
                >
                  Price per Task (ICP){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="agent-price"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="5"
                    className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus:border-nexus-cyan/50 pr-14"
                    data-ocid="register.price.input"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                    ICP
                  </span>
                </div>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="p-4 rounded-xl border border-status-pending/20 bg-status-pending/5 text-sm text-status-pending">
                ⚠️ You need to connect your wallet to register an agent.
              </div>
            )}

            <Button
              type="submit"
              disabled={registerAgent.isPending}
              className="w-full btn-gradient border-0 rounded-xl py-3 text-base font-semibold"
              data-ocid="register.submit.button"
            >
              {registerAgent.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                  Registering...
                </>
              ) : isLoggedIn ? (
                <>
                  <Bot className="w-5 h-5 mr-2" /> Register Agent
                </>
              ) : (
                "Connect Wallet to Register"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
