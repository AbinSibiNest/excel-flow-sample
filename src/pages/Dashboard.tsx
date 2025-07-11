import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  AlertTriangle,
  Activity,
  Database,
  History,
  Settings,
  Timer,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const isInFirmContext = location.pathname.startsWith("/firm/");

  // Mock data - would come from API in real implementation
  const metrics = {
    filesProcessed24h: 127,
    recordsMigrated: 45231,
    successRate: 94.2,
    failedRecords: 287,
  };

  const recentRuns = [
    {
      id: "run-001",
      filename: "customers_batch_1.csv",
      status: "Success",
      records: 1250,
      time: "2 hours ago",
    },
    {
      id: "run-002",
      filename: "products_update.csv",
      status: "In Progress",
      records: 890,
      time: "30 min ago",
    },
    {
      id: "run-003",
      filename: "orders_export.csv",
      status: "Failed",
      records: 2100,
      time: "1 hour ago",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Success: "bg-green-900/50 text-green-400 border-green-600",
      "In Progress": "bg-blue-900/50 text-blue-400 border-blue-600",
      Failed: "bg-red-900/50 text-red-400 border-red-600",
    };
    return (
      variants[status as keyof typeof variants] ||
      "bg-gray-900/50 text-gray-400 border-gray-600"
    );
  };

  // Helper function to handle tab switching in firm context
  const handleTabSwitch = (tabValue: string) => {
    if (isInFirmContext) {
      // Update URL hash to switch to the desired tab
      const newUrl = `${location.pathname}#${tabValue}`;
      window.location.hash = tabValue;

      // Trigger tab change by dispatching a custom event
      const tabChangeEvent = new CustomEvent("tabChange", {
        detail: { tabValue },
      });
      window.dispatchEvent(tabChangeEvent);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
        </div>
        {!isInFirmContext && (
          <Link to="/upload">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload New File
            </Button>
          </Link>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Files Processed (24h)
            </CardTitle>
            <FileText className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              {metrics.filesProcessed24h}
            </div>
            <p className="text-xs text-green-400 mt-1">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Records Migrated
            </CardTitle>
            <Database className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              {metrics.recordsMigrated.toLocaleString()}
            </div>
            <p className="text-xs text-green-400 mt-1">+8.2% this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Success Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              {metrics.successRate}%
            </div>
            <Progress value={metrics.successRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Failed Records
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">
              {metrics.failedRecords}
            </div>
            <p className="text-xs text-red-400 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Migration Runs */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-100">
                Recent Migration Runs
              </CardTitle>
            </div>
            {!isInFirmContext ? (
              <Link to="/history">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  View All
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => handleTabSwitch("history")}
              >
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(run.status)}
                  <div>
                    <p className="font-medium text-gray-100">{run.filename}</p>
                    <p className="text-sm text-gray-400">
                      {run.records} records • {run.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusBadge(run.status)}>
                    {run.status}
                  </Badge>
                  <Link to={`/run/${run.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {!isInFirmContext ? (
              <Link to="/upload">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-16">
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto mb-1" />
                    <span>Upload File</span>
                  </div>
                </Button>
              </Link>
            ) : (
              <Button
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-16"
                onClick={() => handleTabSwitch("upload")}
              >
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto mb-1" />
                  <span>Upload File</span>
                </div>
              </Button>
            )}

            {!isInFirmContext ? (
              <Link to="/pending">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-16"
                >
                  <div className="text-center">
                    <Timer className="h-6 w-6 mx-auto mb-1" />
                    <span>Pending Migration</span>
                  </div>
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-16"
                onClick={() => handleTabSwitch("pending")}
              >
                <div className="text-center">
                  <Timer className="h-6 w-6 mx-auto mb-1" />
                  <span>Pending Migration</span>
                </div>
              </Button>
            )}

            {!isInFirmContext ? (
              <Link to="/history">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-16"
                >
                  <div className="text-center">
                    <History className="h-6 w-6 mx-auto mb-1" />
                    <span>View History</span>
                  </div>
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-16"
                onClick={() => handleTabSwitch("history")}
              >
                <div className="text-center">
                  <History className="h-6 w-6 mx-auto mb-1" />
                  <span>View History</span>
                </div>
              </Button>
            )}

            {!isInFirmContext ? (
              <Link to="/config">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-16"
                >
                  <div className="text-center">
                    <Settings className="h-6 w-6 mx-auto mb-1" />
                    <span>Configuration</span>
                  </div>
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 h-16"
                onClick={() => handleTabSwitch("config")}
              >
                <div className="text-center">
                  <Settings className="h-6 w-6 mx-auto mb-1" />
                  <span>Configuration</span>
                </div>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
