import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  AlertTriangle,
  FileText,
  Activity,
  Database,
  RefreshCw,
  Filter,
} from "lucide-react";

const RunDetail = () => {
  const { id } = useParams();
  const [logLevelFilter, setLogLevelFilter] = useState("all");

  // Mock data - would come from API in real implementation
  const runDetails = {
    id: "run-003",
    filename: "orders_export.csv",
    status: "Failed",
    startTime: "2024-01-15 13:15:00",
    endTime: "2024-01-15 13:18:30",
    duration: "3m 30s",
    recordsProcessed: 1875,
    recordsFailed: 225,
    successRate: 89.2,
    stepFunctionUrl:
      "https://console.aws.amazon.com/states/home#/executions/details/arn:aws:states:us-east-1:123456789012:execution:MyStateMachine:run-003",
    logs: [
      {
        timestamp: "13:15:01",
        level: "INFO",
        message: "Migration started for orders_export.csv",
      },
      {
        timestamp: "13:15:15",
        level: "INFO",
        message: "Processing batch 1-500: 500 records",
      },
      {
        timestamp: "13:16:02",
        level: "WARN",
        message: "Invalid date format in row 345: '2024-13-01'",
      },
      {
        timestamp: "13:16:30",
        level: "INFO",
        message: "Processing batch 501-1000: 500 records",
      },
      {
        timestamp: "13:17:15",
        level: "ERROR",
        message: "Foreign key constraint violation in batch 1001-1500",
      },
      {
        timestamp: "13:17:45",
        level: "INFO",
        message: "Processing batch 1501-2000: 375 records",
      },
      {
        timestamp: "13:18:30",
        level: "ERROR",
        message: "Migration completed with errors: 225 failed records",
      },
    ],
    failedRecords: [
      {
        row: 345,
        data: {
          order_id: "ORD-12345",
          customer_id: "CUST-001",
          order_date: "2024-13-01",
          amount: "150.00",
        },
        error: "Invalid date format: '2024-13-01' is not a valid date",
      },
      {
        row: 1123,
        data: {
          order_id: "ORD-67890",
          customer_id: "CUST-999",
          order_date: "2024-01-15",
          amount: "75.50",
        },
        error:
          "Foreign key constraint violation: customer_id 'CUST-999' does not exist",
      },
      {
        row: 1876,
        data: {
          order_id: "ORD-11111",
          customer_id: "CUST-002",
          order_date: "2024-01-14",
          amount: "abc",
        },
        error: "Invalid amount format: 'abc' is not a valid number",
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-400" />;
      case "Failed":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
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

  const getLogLevelStyle = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-red-400 bg-red-900/20";
      case "WARN":
        return "text-yellow-400 bg-yellow-900/20";
      case "INFO":
        return "text-blue-400 bg-blue-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };

  

  const filteredLogs = runDetails.logs.filter((log) => {
    if (logLevelFilter === "all") return true;
    return log.level === logLevelFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">
            Migration Run Details
          </h1>
          <p className="text-gray-400 mt-1">Run ID: {id}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => window.open(runDetails.stepFunctionUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Step Functions
          </Button>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Failed Records
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(runDetails.status)}
                  <Badge className={getStatusBadge(runDetails.status)}>
                    {runDetails.status}
                  </Badge>
                </div>
              </div>
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-2xl font-bold text-gray-100">
                  {runDetails.duration}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Records Processed</p>
                <p className="text-2xl font-bold text-gray-100">
                  {runDetails.recordsProcessed.toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Failed Records</p>
                <p className="text-2xl font-bold text-red-400">
                  {runDetails.recordsFailed.toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Information */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            File Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Filename</p>
              <p className="text-lg font-medium text-gray-100">
                {runDetails.filename}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-lg font-medium text-gray-100">
                {runDetails.successRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Start Time</p>
              <p className="text-lg font-medium text-gray-100">
                {runDetails.startTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">End Time</p>
              <p className="text-lg font-medium text-gray-100">
                {runDetails.endTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Logs and Failed Records */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger
                value="logs"
                className="text-gray-300 data-[state=active]:bg-gray-700"
              >
                Execution Logs
              </TabsTrigger>
              <TabsTrigger
                value="errors"
                className="text-gray-300 data-[state=active]:bg-gray-700"
              >
                Failed Records ({runDetails.recordsFailed})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-100">
                  Execution Logs
                </h3>
                <Select
                  value={logLevelFilter}
                  onValueChange={setLogLevelFilter}
                >
                  <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-gray-100">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by execution level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="WARN">Warn</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="text-xs text-gray-400 font-mono w-16">
                      {log.timestamp}
                    </div>
                    <Badge className={`text-xs ${getLogLevelStyle(log.level)}`}>
                      {log.level}
                    </Badge>
                    <div className="text-sm text-gray-300 flex-1">
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="errors" className="p-6">
              <div className="space-y-4">
                {runDetails.failedRecords.map((record, index) => (
                  <Alert key={index} className="bg-red-900/20 border-red-600">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-red-300">
                            Row {record.row}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            Retry Record
                          </Button>
                        </div>
                        <div className="text-sm text-red-300">
                          <strong>Error:</strong> {record.error}
                        </div>
                        <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded font-mono">
                          <strong>Data:</strong>{" "}
                          {JSON.stringify(record.data, null, 2)}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunDetail;
