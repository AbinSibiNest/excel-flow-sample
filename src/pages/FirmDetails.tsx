import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import FileUpload from "./FileUpload";
import PendingMigration from "./PendingMigration";
import MigrationHistory from "./MigrationHistory";
import Configuration from "./Configuration";

const FirmDetails = () => {
  const { firmId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Determine active tab from current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) {
      setActiveTab("dashboard");
    } else if (path.includes("/upload")) {
      setActiveTab("upload");
    } else if (path.includes("/pending")) {
      setActiveTab("pending");
    } else if (path.includes("/history")) {
      setActiveTab("history");
    } else if (path.includes("/config")) {
      setActiveTab("config");
    } else {
      // Default to dashboard if no specific tab in URL
      setActiveTab("dashboard");
    }
  }, [location.pathname]);

  // Listen for tab change events from Dashboard quick actions
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      const tabValue = event.detail.tabValue;
      navigate(`/firm/${firmId}/${tabValue}`);
    };

    window.addEventListener("tabChange", handleTabChange as EventListener);

    return () => {
      window.removeEventListener("tabChange", handleTabChange as EventListener);
    };
  }, [firmId, navigate]);

  // Handle tab change by navigating to new route
  const handleTabChange = (tabValue: string) => {
    navigate(`/firm/${firmId}/${tabValue}`);
  };

  // Mock firm data - in real app would fetch based on firmId
  const firmData = {
    "firm-001": {
      name: "Anderson & Associates",
      location: "New York, NY",
      address: "123 Legal Street, New York, NY 10001",
      phone: "(555) 123-4567",
      email: "contact@andersonlaw.com",
      totalCases: 1247,
      activeMigrations: 3,
      lastSync: "2024-01-10",
    },
    "firm-002": {
      name: "Smith Legal Group",
      location: "Los Angeles, CA",
      address: "456 Justice Ave, Los Angeles, CA 90210",
      phone: "(555) 234-5678",
      email: "info@smithlegal.com",
      totalCases: 892,
      activeMigrations: 1,
      lastSync: "2024-01-09",
    },
  };

  const firm =
    firmData[firmId as keyof typeof firmData] || firmData["firm-001"];

  return (
    <div className="min-h-screen bg-[#1a1f26] text-gray-100">
      {/* Firm Header */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/migration-sync-config")}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Firms
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="h-full flex flex-col"
      >
        <div className="border-b border-gray-700 px-6">
          <TabsList className="grid w-full max-w-5xl grid-cols-5 bg-transparent h-12 p-0">
            <TabsTrigger
              value="dashboard"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              File Upload
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              Pending Migration
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              Migration History
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              Configuration
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-6">
          <TabsContent value="dashboard" className="h-full m-0">
            <Dashboard />
          </TabsContent>
          <TabsContent value="upload" className="h-full m-0">
            <FileUpload />
          </TabsContent>
          <TabsContent value="pending" className="h-full m-0">
            <PendingMigration />
          </TabsContent>
          <TabsContent value="history" className="h-full m-0">
            <MigrationHistory />
          </TabsContent>
          <TabsContent value="config" className="h-full m-0">
            <Configuration />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FirmDetails;
