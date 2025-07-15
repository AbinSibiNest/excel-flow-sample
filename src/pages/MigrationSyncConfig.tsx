
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, Users, FileText, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MigrationSyncConfig = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock firm data
  const firms = [
    {
      id: "firm-001",
      name: "Anderson & Associates",
      location: "New York, NY",
      totalCases: 1247,
      lastSync: "2024-01-10",
      status: "active",
    },
    {
      id: "firm-002",
      name: "Smith Legal Group",
      location: "Los Angeles, CA",
      totalCases: 892,
      lastSync: "2024-01-09",
      status: "pending verification",
    },
    {
      id: "firm-003",
      name: "Johnson Law Firm",
      location: "Chicago, IL",
      totalCases: 634,
      lastSync: "2024-01-08",
      status: "failed",
    },
    {
      id: "firm-004",
      name: "Brown & Partners",
      location: "Houston, TX",
      totalCases: 1156,
      lastSync: "2024-01-10",
      status: "not yet synced",
    },
  ];

  // Filter firms based on search term
  const filteredFirms = firms.filter(firm =>
    firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900/50 text-green-400 border-green-600";
      case "pending verification":
        return "bg-blue-900/50 text-blue-400 border-blue-600";
      case "failed":
        return "bg-red-900/50 text-red-400 border-red-600";
      case "not yet synced":
        return "bg-gray-900/50 text-gray-400 border-gray-600";
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-600";
    }
  };

  const renderStatus = (firm: any) => {
  const { id, status } = firm;

  // Configuration for statuses that should be links and their URL hashes.
  const linkConfig: { [key: string]: string } = {
    "pending verification": "#pending",
    "active": "", // The 'active' status links to the base URL with no hash.
    "failed": "#history",
  };

  // Create the badge component once to avoid repeating code.
  const StatusBadge = (
    <Badge className={getStatusBadge(status)}>
      {status.toUpperCase()}
    </Badge>
  );

  // Check if the current status exists in our link configuration.
  if (Object.prototype.hasOwnProperty.call(linkConfig, status)) {
    const destination = `/firm/${id}${linkConfig[status]}`;
    return (
      <Link to={destination} className="inline-block">
        {StatusBadge}
      </Link>
    );
  }

  // If the status is not in the configuration, return only the badge.
  return StatusBadge;
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">
            Migration Sync Configuration
          </h1>
        </div>
      </div>
      {/* Firms Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-100">Law Firms</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by firm name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Firm Name</TableHead>
                <TableHead className="text-gray-300">Location</TableHead>
                <TableHead className="text-gray-300">Total Cases</TableHead>
                <TableHead className="text-gray-300">Last Sync</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFirms.map((firm) => (
                <TableRow
                  key={firm.id}
                  className="border-gray-700 hover:bg-gray-800/50"
                >
                  <TableCell>
                    <Link
                      to={`/firm/${firm.id}`}
                      className="text-cyan-400 hover:text-cyan-300 font-medium underline"
                    >
                      {firm.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {firm.location}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {firm.totalCases.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {firm.lastSync}
                  </TableCell>
                  <TableCell>
                    {renderStatus(firm)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationSyncConfig;
