import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AgentRegistrationPage } from "./pages/AgentRegistrationPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { MyTasksPage } from "./pages/MyTasksPage";

type Page = "marketplace" | "register" | "tasks" | "dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("marketplace");

  const navigate = (page: string) => setCurrentPage(page as Page);

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{ backgroundColor: "oklch(0.138 0.030 248)" }}
    >
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="flex-1">
        {currentPage === "marketplace" && (
          <MarketplacePage onNavigate={navigate} />
        )}
        {currentPage === "register" && <AgentRegistrationPage />}
        {currentPage === "tasks" && <MyTasksPage />}
        {currentPage === "dashboard" && <DashboardPage />}
      </main>
      <Footer />
      <Toaster richColors theme="dark" />
    </div>
  );
}
