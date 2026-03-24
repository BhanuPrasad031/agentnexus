import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  Filter,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AgentCard } from "../components/AgentCard";
import { HireAgentModal } from "../components/HireAgentModal";
import { CATEGORIES, SAMPLE_AGENTS } from "../data/sampleAgents";
import type { SampleAgent } from "../data/sampleAgents";
import { useGetAllAgents } from "../hooks/useQueries";

interface MarketplacePageProps {
  onNavigate: (page: string) => void;
}

export function MarketplacePage({ onNavigate }: MarketplacePageProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: agent can be backend or sample type
  const [hireAgent, setHireAgent] = useState<any>(null);

  const { data: backendAgents, isLoading } = useGetAllAgents();

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

  const filtered = agents.filter((a) => {
    const name = a.name.toLowerCase();
    const desc = a.description.toLowerCase();
    const q = search.toLowerCase();
    if (q && !name.includes(q) && !desc.includes(q)) return false;
    if (availableOnly && !a.available) return false;
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(a.category)
    )
      return false;
    return true;
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden radial-gradient-bg py-20 px-4">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-nexus-cyan/30 bg-nexus-cyan/5 text-nexus-cyan text-xs font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                Decentralized AI Agent Marketplace
              </div>
              <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">The Future of</span>
                <br />
                <span className="gradient-text">Autonomous AI</span>
                <br />
                <span className="text-foreground">Services</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                Hire autonomous AI agents for data analysis, automation, content
                generation, and decision support. Powered by blockchain-secured
                smart contracts.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("marketplace-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                  data-ocid="hero.browse.button"
                >
                  <Zap className="w-4 h-4" />
                  Browse Agents
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("register")}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-nexus-cyan/40 text-nexus-cyan hover:bg-nexus-cyan/10 transition-all"
                  data-ocid="hero.register.button"
                >
                  <Bot className="w-4 h-4" />
                  Register Agent
                </button>
              </div>
              <div className="flex gap-8 pt-4">
                {[
                  { label: "Active Agents", value: "150+" },
                  { label: "Tasks Completed", value: "2,400+" },
                  { label: "Total Volume", value: "18K ICP" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-display font-bold gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nexus-cyan/10 to-nexus-purple/10 animate-pulse" />
                <div className="absolute inset-8 rounded-full border border-nexus-cyan/20 animate-float" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-2xl btn-gradient flex items-center justify-center shadow-neon-cyan animate-float">
                    <Bot className="w-16 h-16 text-white" />
                  </div>
                </div>
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: orbital positions are stable by index
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-nexus-cyan"
                    style={{
                      top: `calc(50% - 6px + ${Math.sin((deg * Math.PI) / 180) * 120}px)`,
                      left: `calc(50% - 6px + ${Math.cos((deg * Math.PI) / 180) * 120}px)`,
                      opacity: 0.4 + i * 0.1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace-section" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                AI Agent Marketplace
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {filtered.length} agents available
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agents..."
                className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-nexus-cyan/50"
                data-ocid="marketplace.search_input"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-56 flex-shrink-0">
              <div className="rounded-xl border border-border bg-card p-5 space-y-5 sticky top-24">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Filter className="w-4 h-4 text-nexus-cyan" />
                  Filters
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
                    Category
                  </p>
                  <div className="space-y-2.5">
                    {CATEGORIES.slice(1).map((cat) => (
                      <div key={cat} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                          className="border-border data-[state=checked]:bg-nexus-cyan data-[state=checked]:border-nexus-cyan"
                          data-ocid="filter.category.checkbox"
                        />
                        <Label
                          htmlFor={`cat-${cat}`}
                          className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                        >
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="available-only"
                      checked={availableOnly}
                      onCheckedChange={(v) => setAvailableOnly(!!v)}
                      className="border-border data-[state=checked]:bg-nexus-cyan data-[state=checked]:border-nexus-cyan"
                      data-ocid="filter.available.checkbox"
                    />
                    <Label
                      htmlFor="available-only"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Available Only
                    </Label>
                  </div>
                </div>

                {(selectedCategories.length > 0 || availableOnly) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategories([]);
                      setAvailableOnly(false);
                    }}
                    className="text-xs text-nexus-cyan hover:underline flex items-center gap-1"
                    data-ocid="filter.clear.button"
                  >
                    <ChevronRight className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </div>
            </aside>

            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                      key={i}
                      className="rounded-xl border border-border bg-card p-5 space-y-4"
                      data-ocid="agent.loading_state"
                    >
                      <Skeleton className="h-12 w-12 rounded-xl bg-secondary" />
                      <Skeleton className="h-4 w-32 bg-secondary" />
                      <Skeleton className="h-3 w-full bg-secondary" />
                      <Skeleton className="h-3 w-3/4 bg-secondary" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-24 text-center"
                  data-ocid="agent.empty_state"
                >
                  <Bot className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    No agents found
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.07 } },
                  }}
                >
                  {filtered.map((agent, i) => (
                    <motion.div
                      key={agent.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <AgentCard
                        agent={agent}
                        index={i}
                        onHire={setHireAgent}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <HireAgentModal
        agent={hireAgent}
        open={!!hireAgent}
        onClose={() => setHireAgent(null)}
      />
    </div>
  );
}
