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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Calendar,
  Hourglass,
} from "lucide-react";
import { Link } from "react-router-dom";

const MigrationHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - would come from API in real implementation
  const migrationRuns = [
    {
      id: "run-001",
      filename: "customers_batch_1.csv",
      status: "Success",
      startTime: "2024-01-15 14:30:00",
      endTime: "2024-01-15 14:32:15",
      recordsProcessed: 1250,
      recordsFailed: 0,
      duration: "2m 15s",
    },
    {
      id: "run-002",
      filename: "products_update.csv",
      status: "Pending Migration",
      startTime: "2024-01-15 15:00:00",
      endTime: null,
      recordsProcessed: 890,
      recordsFailed: 0,
      duration: "30m 45s",
    },
    {
      id: "run-003",
      filename: "orders_export.csv",
      status: "Failed",
      startTime: "2024-01-15 13:15:00",
      endTime: "2024-01-15 13:18:30",
      recordsProcessed: 1875,
      recordsFailed: 225,
      duration: "3m 30s",
    },
    {
      id: "run-004",
      filename: "inventory_sync.csv",
      status: "Success",
      startTime: "2024-01-15 12:00:00",
      endTime: "2024-01-15 12:05:45",
      recordsProcessed: 3200,
      recordsFailed: 15,
      duration: "5m 45s",
    },
    {
      id: "run-005",
      filename: "user_profiles.csv",
      status: "Pending Migration",
      startTime: "2024-01-15 11:30:00",
      endTime: null,
      recordsProcessed: 567,
      recordsFailed: 0,
      duration: "1m 20s",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "Pending Migration":
        return <Hourglass className="h-4 w-4 text-yellow-400" />;
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
      "Pending Migration": "bg-yellow-900/50 text-yellow-400 border-yellow-600",
      Failed: "bg-red-900/50 text-red-400 border-red-600",
    };
    return (
      variants[status as keyof typeof variants] ||
      "bg-gray-900/50 text-gray-400 border-gray-600"
    );
  };

  const filteredRuns = migrationRuns.filter((run) => {
    const matchesSearch = run.filename
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      run.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Migration History</h1>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-gray-100">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending migration">
                  Pending Migration
                </SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Migration Runs Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Migration Runs</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredRuns.length} of {migrationRuns.length} runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Filename</TableHead>
                  <TableHead className="text-gray-300">Start Time</TableHead>
                  <TableHead className="text-gray-300">Duration</TableHead>
                  <TableHead className="text-gray-300">Records</TableHead>
                  <TableHead className="text-gray-300">Failed</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRuns.map((run) => (
                  <TableRow key={run.id} className="border-gray-800">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(run.status)}
                        <Badge className={getStatusBadge(run.status)}>
                          {run.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-100 font-medium">
                      {run.filename}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{run.startTime}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {run.duration}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {run.recordsProcessed.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${
                          run.recordsFailed > 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {run.recordsFailed.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/run/${run.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {migrationRuns.filter((r) => r.status === "Success").length}
              </div>
              <p className="text-sm text-gray-400">Successful Runs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {
                  migrationRuns.filter((r) => r.status === "Pending Migration")
                    .length
                }
              </div>
              <p className="text-sm text-gray-400">Pending Migration</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {migrationRuns.filter((r) => r.status === "In Progress").length}
              </div>
              <p className="text-sm text-gray-400">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {migrationRuns.filter((r) => r.status === "Failed").length}
              </div>
              <p className="text-sm text-gray-400">Failed Runs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MigrationHistory;
