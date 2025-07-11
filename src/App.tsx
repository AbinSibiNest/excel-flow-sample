
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import RunDetail from "./pages/RunDetail";
import NotFound from "./pages/NotFound";
import MigrationSyncConfig from "./pages/MigrationSyncConfig";
import FirmDetails from "./pages/FirmDetails";
import RecordDetail from "./pages/RecordDetail";
import PendingMigration from "./pages/PendingMigration";
import MigrationHistory from "./pages/MigrationHistory";

const queryClient = new QueryClient();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#14b8a6',
    },
    background: {
      default: '#1a1f26',
      paper: '#1e2328',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle special routes that don't need sidebar highlighting
  if (location.pathname.startsWith("/run/")) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-[#1a1f26] text-gray-100 dark">
        <header 
          className="h-16 flex items-center justify-between px-6 w-full border-b border-gray-700 fixed top-0 left-0 right-0 z-50"
          style={{ backgroundColor: 'rgb(0, 102, 124)' }}
        >
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:text-gray-200" />
            <span className="text-white font-medium">John Doe</span>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="text-2xl font-bold text-white">
              V.
            </div>
          </div>
          
          <div className="text-white font-medium">
            Migration Sync
          </div>
        </header>
        
        <div className="flex flex-1 pt-16">
          <AppSidebar />
          <main className="flex-1 p-6 bg-[#1a1f26]">
            <Routes>
              <Route path="/run/:id" element={<RunDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#1a1f26] text-gray-100 dark">
      <header 
        className="h-16 flex items-center justify-between px-6 w-full border-b border-gray-700 fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: 'rgb(0, 102, 124)' }}
      >
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:text-gray-200" />
          <span className="text-white font-medium">John Doe</span>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="text-2xl font-bold text-white">
            V.
          </div>
        </div>
        
        <div className="text-white font-medium">
          Migration Sync
        </div>
      </header>
      
      <div className="flex flex-1 pt-16">
        <AppSidebar />
        <main className="flex-1 bg-[#1a1f26]">
          <Routes>
            <Route path="/migration-sync-config" element={<MigrationSyncConfig />} />
            <Route path="/firm/:firmId" element={<FirmDetails />} />
            <Route path="/pending-migration" element={<PendingMigration />} />
            <Route path="/migration-history" element={<MigrationHistory />} />
            <Route path="/record/:id" element={<RecordDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <AppContent />
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
