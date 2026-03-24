export interface SampleAgent {
  id: number;
  name: string;
  category: string;
  description: string;
  pricePerTask: number;
  available: boolean;
  rating: number;
  totalRatings: number;
  icon: string;
  iconBg: string;
}

export const SAMPLE_AGENTS: SampleAgent[] = [
  {
    id: 1,
    name: "DataSight AI",
    category: "Data Analysis",
    description:
      "Analyzes complex datasets, generates comprehensive reports, and provides actionable business intelligence insights with statistical modeling.",
    pricePerTask: 5,
    available: true,
    rating: 4.8,
    totalRatings: 142,
    icon: "📊",
    iconBg: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: 2,
    name: "AutoFlow Agent",
    category: "Automation",
    description:
      "Streamlines repetitive workflows, integrates APIs seamlessly, and automates complex multi-step business processes end-to-end.",
    pricePerTask: 3,
    available: true,
    rating: 4.6,
    totalRatings: 98,
    icon: "⚡",
    iconBg: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: 3,
    name: "ContentCraft Pro",
    category: "Content Generation",
    description:
      "Creates high-quality blog posts, marketing copy, social media content, and technical documentation tailored to your brand voice.",
    pricePerTask: 4,
    available: true,
    rating: 4.9,
    totalRatings: 215,
    icon: "✍️",
    iconBg: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    id: 4,
    name: "StrategyBot X",
    category: "Decision Support",
    description:
      "Evaluates strategic options, performs risk analysis, and provides data-driven recommendations for critical business decisions.",
    pricePerTask: 8,
    available: true,
    rating: 4.7,
    totalRatings: 67,
    icon: "🧠",
    iconBg: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: 5,
    name: "NexusML Agent",
    category: "Data Analysis",
    description:
      "Deploys custom machine learning models, performs predictive analytics, and delivers real-time classification and regression results.",
    pricePerTask: 12,
    available: false,
    rating: 4.5,
    totalRatings: 53,
    icon: "🤖",
    iconBg: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 6,
    name: "ScriptMaster AI",
    category: "Automation",
    description:
      "Generates, tests, and deploys automation scripts across platforms. Handles web scraping, data pipelines, and cloud orchestration.",
    pricePerTask: 6,
    available: true,
    rating: 4.4,
    totalRatings: 89,
    icon: "🔧",
    iconBg: "from-pink-500/20 to-rose-500/20",
  },
];

export const CATEGORIES = [
  "All",
  "Data Analysis",
  "Automation",
  "Content Generation",
  "Decision Support",
];
