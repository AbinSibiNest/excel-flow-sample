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
import { CheckCircle, Database, FileText, Users, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
// Fixed Select import and null handling issues

const PendingMigration = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'errors' | 'ready'>('all');
  const [searchTerm, setSearchTerm] = useState("");
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

  // Mock parsed CSV data with new status and approval structure
  const [parsedData, setParsedData] = useState([
    {
      id: 1,
      referenceId: "REF-001",
      plaintiff: "John Smith",
      caseType: "Personal Injury",
      createDate: "2024-01-15",
      settledAmount: 15000,
      status: "New",
      approval: "Needs Review",
    },
    {
      id: 2,
      referenceId: "REF-002",
      plaintiff: "Sarah Johnson",
      caseType: "Medical Malpractice",
      createDate: "2024-01-18",
      settledAmount: 22500,
      status: "Updates",
      approval: "Ready to Sync",
    },
    {
      id: 3,
      referenceId: "REF-003",
      plaintiff: "Michael Brown",
      caseType: "Auto Accident",
      createDate: "2024-01-20",
      settledAmount: 18750,
      status: "New",
      approval: "Ready to Sync",
    },
    {
      id: 4,
      referenceId: "REF-004",
      plaintiff: "Emily Davis",
      caseType: "Slip and Fall",
      createDate: "2024-01-22",
      settledAmount: null,
      status: "No Updates",
      approval: "Synced",
    },
    {
      id: 5,
      referenceId: "REF-005",
      plaintiff: "David Wilson",
      caseType: "Workers' Compensation",
      createDate: "2024-01-25",
      settledAmount: 27800,
      status: "Updates",
      approval: "Needs Review",
    },
  ]);

  // Filter data based on filter type and search term
  const filteredData = (() => {
    let data = parsedData;
    
    // Filter by search term
    if (searchTerm) {
      data = data.filter(item => 
        item.plaintiff.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (showNewOnly) {
      data = data.filter(item => item.status === "New" || item.status === "Updates");
    }
    
    switch (filterType) {
      case 'errors':
        return data.filter(item => item.approval === "Needs Review");
      case 'ready':
        return data.filter(item => item.approval === "Ready to Sync");
      default:
        return data;
    }
  })();

  // Count records with errors and ready to import
  const recordsWithErrors = parsedData.filter(item => item.approval === "Needs Review").length;
  const recordsReadyToImport = parsedData.filter(item => item.approval === "Ready to Sync").length;

  // Format date to MM-DD-YY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const handleRowClick = (id: number) => {
    navigate(`/record/${id}`);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      // Only select rows that are "Ready to Sync"
      setSelectedRows(filteredData.filter(row => row.approval === "Ready to Sync").map((row) => row.id));
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

    // Update approval status for migrated records
    setParsedData(prevData => 
      prevData.map(item => 
        selectedRows.includes(item.id) 
          ? { ...item, approval: Math.random() > 0.8 ? "Sync Failed" : "Synced" }
          : item
      )
    );

    toast({
      title: "Migration Started",
      description: `${selectedRows.length} records have been queued for migration.`,
    });

    setSelectedRows([]);
    setSelectAll(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Pending Migration</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <Card 
          className={`bg-gray-900 border-gray-800 cursor-pointer transition-all ${filterType === 'errors' ? 'ring-2 ring-red-500' : 'hover:border-red-600'}`}
          onClick={() => setFilterType(filterType === 'errors' ? 'all' : 'errors')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Review Required</p>
                <p className="text-2xl font-bold text-red-400">
                  {recordsWithErrors}
                </p>
              </div>
              <Filter className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gray-900 border-gray-800 cursor-pointer transition-all ${filterType === 'ready' ? 'ring-2 ring-green-500' : 'hover:border-green-600'}`}
          onClick={() => setFilterType(filterType === 'ready' ? 'all' : 'ready')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ready to Export</p>
                <p className="text-2xl font-bold text-green-400">
                  {recordsReadyToImport}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-cyan-400">
                  $
                  {filteredData
                    .reduce((sum, row) => sum + (row.settledAmount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-cyan-400" />
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
              {/* <CardDescription className="text-gray-400">
                Select records to migrate to the main database
              </CardDescription> */}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by plaintiff name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
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
                  <TableHead className="text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all-header"
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                      <span>Select All</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Plaintiff</TableHead>
                  <TableHead className="text-gray-300">Case Type</TableHead>
                  <TableHead className="text-gray-300">Create Date</TableHead>
                  <TableHead className="text-gray-300">
                    Settled Amount
                  </TableHead>
                  <TableHead className="text-gray-300">Approval</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow 
                    key={row.id} 
                    className={`border-gray-800 hover:bg-gray-800/50 cursor-pointer ${
                      row.approval === "Needs Review" ? 'bg-red-900/20 border-red-800/30' : ''
                    }`}
                    onClick={() => handleRowClick(row.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        disabled={row.approval !== "Ready to Sync"}
                        onCheckedChange={(checked) =>
                          handleRowSelect(row.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {row.status === "New" && (
                        <Badge className="bg-blue-900/50 text-blue-400 border-blue-600">
                          {row.status}
                        </Badge>
                      )}
                      {row.status === "Updates" && (
                        <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-600">
                          {row.status}
                        </Badge>
                      )}
                      {row.status === "No Updates" && (
                        <Badge className="bg-gray-900/50 text-gray-400 border-gray-600">
                          {row.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className={`${row.approval === "Needs Review" ? 'text-red-300' : 'text-gray-300'}`}>
                      {row.plaintiff}
                    </TableCell>
                    <TableCell className={`font-mono text-sm ${row.approval === "Needs Review" ? 'text-red-300' : 'text-gray-300'}`}>
                      {row.caseType}
                    </TableCell>
                    <TableCell className={`font-mono text-sm ${row.approval === "Needs Review" ? 'text-red-300' : 'text-gray-300'}`}>
                      {formatDate(row.createDate)}
                    </TableCell>
                    <TableCell className="text-green-400 font-medium">
                      {row.settledAmount ? `$${row.settledAmount.toLocaleString()}` : '$--'}
                    </TableCell>
                    <TableCell>
                      {row.approval === "Ready to Sync" && (
                        <Badge className="bg-green-900/50 text-green-400 border-green-600">
                          Ready to Sync
                        </Badge>
                      )}
                      {row.approval === "Needs Review" && (
                        <Badge className="bg-red-900/50 text-red-400 border-red-600">
                          Needs Review
                        </Badge>
                      )}
                      {row.approval === "Synced" && (
                        <Badge className="bg-blue-900/50 text-blue-400 border-blue-600">
                          Synced
                        </Badge>
                      )}
                      {row.approval === "Sync Failed" && (
                        <Badge className="bg-red-900/50 text-red-400 border-red-600">
                          Sync Failed
                        </Badge>
                      )}
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
