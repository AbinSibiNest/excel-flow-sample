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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Database, FileText, Users, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
// Fixed Select import and null handling issues

const PendingMigration = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
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
      plaintiff: "John Smith",
      caseType: "Personal Injury",
      createDate: "2024-01-15",
      settledAmount: 15000,
      status: "new",
    },
    {
      id: 2,
      referenceId: "REF-002",
      plaintiff: "Sarah Johnson",
      caseType: "Medical Malpractice",
      createDate: "2024-01-18",
      settledAmount: 22500,
      status: "updated",
    },
    {
      id: 3,
      referenceId: "REF-003",
      plaintiff: "Michael Brown",
      caseType: "Auto Accident",
      createDate: "2024-01-20",
      settledAmount: 18750,
      status: "new",
    },
    {
      id: 4,
      referenceId: "REF-004",
      plaintiff: "Emily Davis",
      caseType: "Slip and Fall",
      createDate: "2024-01-22",
      settledAmount: null,
      status: "same",
    },
    {
      id: 5,
      referenceId: "REF-005",
      plaintiff: "David Wilson",
      caseType: "Workers' Compensation",
      createDate: "2024-01-25",
      settledAmount: 27800,
      status: "new",
    },
  ];

  // Filter data based on new status filter
  const filteredData = showNewOnly 
    ? parsedData.filter(item => item.status === "new")
    : parsedData;

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
                    .reduce((sum, row) => sum + (row.settledAmount || 0), 0)
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
                <label htmlFor="show-new-only" className="text-sm text-gray-300 flex items-center space-x-2">
                  <span>Show NEW Only</span>
                </label>
                <Switch
                  id="show-new-only"
                  checked={showNewOnly}
                  onCheckedChange={setShowNewOnly}
                />
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
                  <TableHead className="text-gray-300">Plaintiff</TableHead>
                  <TableHead className="text-gray-300">Case Type</TableHead>
                  <TableHead className="text-gray-300">Create Date</TableHead>
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
                      {row.plaintiff}
                    </TableCell>
                    <TableCell className="text-gray-300">{row.caseType}</TableCell>
                    <TableCell className="text-gray-300">{row.createDate}</TableCell>
                    <TableCell className="text-green-400 font-medium">
                      {row.settledAmount ? `$${row.settledAmount.toLocaleString()}` : '$--'}
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
