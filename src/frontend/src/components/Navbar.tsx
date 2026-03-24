import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bot,
  LayoutDashboard,
  ListTodo,
  LogOut,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Page = "marketplace" | "register" | "tasks" | "dashboard";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_LINKS: { label: string; page: Page; icon: React.ReactNode }[] = [
  {
    label: "Marketplace",
    page: "marketplace",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  { label: "Agents", page: "register", icon: <Bot className="w-4 h-4" /> },
  { label: "My Tasks", page: "tasks", icon: <ListTodo className="w-4 h-4" /> },
  {
    label: "Dashboard",
    page: "dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { clear, login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : "";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-[oklch(var(--card)/0.8)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => onNavigate("marketplace")}
            className="flex items-center gap-2.5 group"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center shadow-neon-cyan">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-text">
              AgentNexus
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => onNavigate(link.page)}
                data-ocid={`nav.${link.page}.link`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === link.page
                    ? "text-nexus-cyan bg-nexus-cyan/10 border border-nexus-cyan/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {link.icon}
                {link.label}
                {currentPage === link.page && (
                  <span className="ml-1 w-1 h-1 rounded-full bg-nexus-cyan" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isInitializing ? (
              <div className="w-24 h-9 rounded-full bg-secondary animate-pulse" />
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:border-nexus-cyan/40 transition-all"
                    data-ocid="nav.user.button"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs btn-gradient text-white">
                        {shortPrincipal.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {shortPrincipal}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border"
                >
                  <DropdownMenuItem className="gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-mono">{shortPrincipal}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={clear}
                    className="gap-2 text-destructive focus:text-destructive"
                    data-ocid="nav.logout.button"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="btn-gradient rounded-full px-5 py-2 text-sm font-semibold border-0"
                data-ocid="nav.connect.button"
              >
                <Wallet className="w-4 h-4 mr-1.5" />
                {loginStatus === "logging-in"
                  ? "Connecting..."
                  : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center gap-1 pb-2 overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <button
              key={link.page}
              type="button"
              onClick={() => onNavigate(link.page)}
              data-ocid={`nav.mobile.${link.page}.link`}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                currentPage === link.page
                  ? "text-nexus-cyan bg-nexus-cyan/10"
                  : "text-muted-foreground"
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
