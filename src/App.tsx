import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Visitors from "./pages/Visitors";
import Guards from "./pages/Guards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/visitors" element={<Visitors />} />
                  <Route path="/guards" element={<Guards />} />
                  <Route path="/payments" element={<div className="p-6"><h1 className="text-2xl font-bold">Payments & Payroll</h1><p className="text-muted-foreground">Feature coming soon...</p></div>} />
                  <Route path="/clients" element={<div className="p-6"><h1 className="text-2xl font-bold">Client Management</h1><p className="text-muted-foreground">Feature coming soon...</p></div>} />
                  <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-muted-foreground">Feature coming soon...</p></div>} />
                  <Route path="/attendance" element={<div className="p-6"><h1 className="text-2xl font-bold">Guard Attendance</h1><p className="text-muted-foreground">Feature coming soon...</p></div>} />
                  <Route path="/schedule" element={<div className="p-6"><h1 className="text-2xl font-bold">Shift Schedule</h1><p className="text-muted-foreground">Feature coming soon...</p></div>} />
                  <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Feature coming soon...</p></div>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
