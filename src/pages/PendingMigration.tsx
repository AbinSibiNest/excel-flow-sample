import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Database, FileText, Users, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PendingMigration = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for updated records from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const updatedMatch = hash.match(/updated=(\d+)/);
    if (updatedMatch) {
      const id = parseInt(updatedMatch[1]);
      setSelectedRows(prev => prev.includes(id) ? prev : [...prev, id]);
      // Clean up URL hash
      const cleanHash = hash.replace(/&updated=\d+/, '');
      window.history.replaceState({}, '', window.location.pathname + cleanHash);
    }
  }, []);

  // Mock parsed CSV data
  const parsedData = [
    {
      id: 1,
      referenceId: "REF-001",
      fullName: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0101",
      address: "123 Main St, New York, NY 10001",
      settledAmount: 15000,
      status: "new",
    },
    {
      id: 2,
      referenceId: "REF-002",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0102",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      settledAmount: 22500,
      status: "updated",
    },
    {
      id: 3,
      referenceId: "REF-003",
      fullName: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "+1-555-0103",
      address: "789 Pine Dr, Chicago, IL 60601",
      settledAmount: 18750,
      status: "new",
    },
    {
      id: 4,
      referenceId: "REF-004",
      fullName: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1-555-0104",
      address: "321 Elm St, Houston, TX 77001",
      settledAmount: 31200,
      status: "same",
    },
    {
      id: 5,
      referenceId: "REF-005",
      fullName: "David Wilson",
      email: "david.wilson@email.com",
      phone: "+1-555-0105",
      address: "654 Maple Ln, Phoenix, AZ 85001",
      settledAmount: 27800,
      status: "new",
    },
  ];

  // Filter data based on status filter
  const filteredData = statusFilter === "all" 
    ? parsedData 
    : parsedData.filter(item => item.status === statusFilter);

  const handleRowClick = (id: number) => {
    navigate(`/record/${id}`);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(filteredData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (rowId: number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, rowId]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== rowId));
      setSelectAll(false);
    }
  };

  const handleMigrate = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "No Records Selected",
        description: "Please select at least one record to migrate.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Migration Started",
      description: `${selectedRows.length} records have been queued for migration.`,
    });

    // Here you would typically trigger the actual migration process
    console.log("Migrating records:", selectedRows);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Pending Migration</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-100">
                  {filteredData.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Selected</p>
                <p className="text-2xl font-bold text-blue-400">
                  {selectedRows.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-green-400">
                  $
                  {filteredData
                    .reduce((sum, row) => sum + row.settledAmount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-100">Parsed CSV Data</CardTitle>
              <CardDescription className="text-gray-400">
                Select records to migrate to the main database
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="same">Same</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm text-gray-300">
                  Select All
                </label>
              </div>
              <Button
                onClick={handleMigrate}
                disabled={selectedRows.length === 0}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Database className="h-4 w-4 mr-2" />
                Migrate Selected ({selectedRows.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                 <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Select</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Full Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Phone</TableHead>
                  <TableHead className="text-gray-300">Address</TableHead>
                  <TableHead className="text-gray-300">
                    Settled Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow 
                    key={row.id} 
                    className="border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => handleRowClick(row.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={(checked) =>
                          handleRowSelect(row.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {row.status === "new" && (
                        <Badge className="bg-blue-900/50 text-blue-400 border-blue-600">
                          NEW
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {row.fullName}
                    </TableCell>
                    <TableCell className="text-gray-300">{row.email}</TableCell>
                    <TableCell className="text-gray-300">{row.phone}</TableCell>
                    <TableCell className="text-gray-300">
                      {row.address}
                    </TableCell>
                    <TableCell className="text-green-400 font-medium">
                      ${row.settledAmount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingMigration;
