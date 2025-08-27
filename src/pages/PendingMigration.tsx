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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Database, FileText, Users, Filter, Search, ArchiveX, Archive, Loader2, AlertCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Fixed Select import and null handling issues

const PendingMigration = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'errors' | 'ready' | 'synced' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("migration-data");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for updated records from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const updatedMatch = hash.match(/updated=(\d+)/);
    const selectMatch = hash.match(/select=(\d+)/);
    
    if (updatedMatch) {
      const id = parseInt(updatedMatch[1]);
      // Update the record status if it was updated
      setParsedData(prev => prev.map(record => {
        if (record.id === id) {
          // This will be updated based on validation in RecordDetail
          return record;
        }
        return record;
      }));
    }
    
    if (selectMatch) {
      const id = parseInt(selectMatch[1]);
      setSelectedRows(prev => prev.includes(id) ? prev : [...prev, id]);
    }
    
    if (updatedMatch || selectMatch) {
      // Clean up URL hash
      let cleanHash = hash.replace(/&updated=\d+/, '').replace(/&select=\d+/, '');
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
      caseStatus: "Draft",
      syncStatus: "Not Synced",
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
      caseStatus: "Active",
      syncStatus: "Ready to Sync",
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
      caseStatus: "Draft",
      syncStatus: "Ready to Sync",
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
      caseStatus: "Draft",
      syncStatus: "Needs Review",
    },
    {
      id: 6,
      referenceId: "REF-006",
      plaintiff: "Lisa Garcia",
      caseType: "Product Liability",
      createDate: "2024-01-28",
      settledAmount: 35000,
      status: "New",
      approval: "Ready to Sync",
      caseStatus: "Draft",
      syncStatus: "Ready to Sync",
    },
    {
      id: 7,
      referenceId: "REF-007",
      plaintiff: "Robert Miller",
      caseType: "Construction Accident",
      createDate: "2024-02-01",
      settledAmount: 42000,
      status: "Updates",
      approval: "Ready to Sync",
      caseStatus: "Active",
      syncStatus: "Ready to Sync",
    },
    {
      id: 8,
      referenceId: "REF-008",
      plaintiff: "Jennifer Taylor",
      caseType: "Medical Malpractice",
      createDate: "2024-02-03",
      settledAmount: 28500,
      status: "New",
      approval: "Needs Review",
      caseStatus: "Draft",
      syncStatus: "Needs Review",
    },
    {
      id: 9,
      referenceId: "REF-009",
      plaintiff: "Thomas Anderson",
      caseType: "Auto Accident",
      createDate: "2024-02-05",
      settledAmount: 19200,
      status: "Updates",
      approval: "Ready to Sync",
      caseStatus: "Active",
      syncStatus: "Ready to Sync",
    },
    {
      id: 11,
      referenceId: "REF-011",
      plaintiff: "James Thompson",
      caseType: "Personal Injury",
      createDate: "2024-02-10",
      settledAmount: 24800,
      status: "New",
      approval: "Ready to Sync",
      caseStatus: "Draft",
      syncStatus: "Ready to Sync",
    },
    {
      id: 12,
      referenceId: "REF-012",
      plaintiff: "Amanda White",
      caseType: "Wrongful Death",
      createDate: "2024-02-12",
      settledAmount: 85000,
      status: "Updates",
      approval: "Needs Review",
      caseStatus: "Draft",
      syncStatus: "Needs Review",
    },
    {
      id: 13,
      referenceId: "REF-013",
      plaintiff: "Daniel Harris",
      caseType: "Workers' Compensation",
      createDate: "2024-02-15",
      settledAmount: 33750,
      status: "New",
      approval: "Needs Review",
      caseStatus: "Draft",
      syncStatus: "Needs Review",
    },
    {
      id: 15,
      referenceId: "REF-015",
      plaintiff: "Kevin Clark",
      caseType: "Auto Accident",
      createDate: "2024-02-20",
      settledAmount: 21600,
      status: "Updates",
      approval: "Ready to Sync",
      caseStatus: "Active",
      syncStatus: "Ready to Sync",
    },
    {
      id: 16,
      referenceId: "REF-016",
      plaintiff: "Rachel Green",
      caseType: "Slip and Fall",
      createDate: "2024-02-22",
      settledAmount: 16800,
      status: "New",
      approval: "Ready to Sync",
      caseStatus: "Draft",
      syncStatus: "Ready to Sync",
    },
    {
      id: 17,
      referenceId: "REF-017",
      plaintiff: "Christopher Lee",
      caseType: "Product Liability",
      createDate: "2024-02-25",
      settledAmount: 39400,
      status: "Updates",
      approval: "Needs Review",
      caseStatus: "Draft",
      syncStatus: "Needs Review",
    },
    {
      id: 18,
      referenceId: "REF-018",
      plaintiff: "Stephanie King",
      caseType: "Construction Accident",
      createDate: "2024-02-28",
      settledAmount: 52100,
      status: "New",
      approval: "Needs Review",
      caseStatus: "Draft",
      syncStatus: "Needs Review",
    },
    {
      id: 20,
      referenceId: "REF-020",
      plaintiff: "Ashley Turner",
      caseType: "Medical Malpractice",
      createDate: "2024-03-05",
      settledAmount: 41700,
      status: "Updates",
      approval: "Ready to Sync",
      caseStatus: "Active",
      syncStatus: "Ready to Sync",
    },
    {
      id: 21,
      referenceId: "REF-021",
      plaintiff: "Mark Johnson",
      caseType: "Auto Accident",
      createDate: "2024-03-08",
      settledAmount: 19500,
      status: "Updates",
      approval: "Sync Failed",
      syncError: "Database connection timeout - please retry",
      caseStatus: "Draft",
      syncStatus: "Sync Failed",
    },
    {
      id: 22,
      referenceId: "REF-022",
      plaintiff: "Linda Davis",
      caseType: "Workers' Compensation",
      createDate: "2024-03-10",
      settledAmount: 31200,
      status: "New",
      approval: "Sync Failed",
      syncError: "Invalid client SSN format - verification failed",
      caseStatus: "Draft",
      syncStatus: "Sync Failed",
    },
  ]);

  // Mock data for "No Update" tab
  const [noUpdateData] = useState([
    {
      id: 101,
      referenceId: "REF-101",
      plaintiff: "No Update Client 1",
      caseType: "Personal Injury",
      createDate: "2024-01-10",
      settledAmount: 12000,
      status: "No Updates",
      approval: "Synced",
      caseStatus: "Active",
      syncStatus: "Synced",
    },
    {
      id: 102,
      referenceId: "REF-102", 
      plaintiff: "No Update Client 2",
      caseType: "Auto Accident",
      createDate: "2024-01-12",
      settledAmount: 15000,
      status: "No Updates",
      approval: "Synced",
      caseStatus: "Active",
      syncStatus: "Synced",
    },
  ]);

  // Filter data based on filter type and search term
  const filteredData = (() => {
    let data = activeTab === "migration-data" ? parsedData : noUpdateData;
    
    // Filter by search term
    if (searchTerm) {
      data = data.filter(item => 
        item.plaintiff.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    switch (filterType) {
      case 'errors':
        return data.filter(item => item.approval === "Needs Review");
      case 'ready':
        return data.filter(item => item.approval === "Ready to Sync");
      case 'synced':
        return data.filter(item => item.approval === "Synced");
      case 'failed':
        return data.filter(item => item.approval === "Sync Failed");
      default:
        return data;
    }
  })();

  const recordsWithErrors = parsedData.filter(item => item.approval === "Needs Review").length;
  const recordsReadyToImport = parsedData.filter(item => item.approval === "Ready to Sync").length;
  const recordsSynced = parsedData.filter(item => item.approval === "Synced").length;
  const recordsSyncFailed = parsedData.filter(item => item.approval === "Sync Failed").length;

  // Format date to MM-DD-YY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const handleRowClick = (id: number, record: any) => {
    // Handle different sync statuses
    if (record.syncStatus === "Synced") {
      const confirmGoToCase = window.confirm(
        "This record is already synced. Would you like to go to the case screen to make changes?"
      );
      if (confirmGoToCase) {
        navigate(`/case/${id}`);
      }
      return;
    }
    
    if (record.syncStatus === "Syncing") {
      // Disabled for syncing records
      return;
    }
    
    // For "No Updates" tab, open with all fields disabled
    if (activeTab === "no-update") {
      navigate(`/record/${id}?disabled=true`);
      return;
    }
    
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

    // First, update approval status for migrated records to "Syncing"
    setParsedData(prevData => 
      prevData.map(item => 
        selectedRows.includes(item.id) 
          ? { ...item, approval: "Syncing", syncStatus: "Syncing" }
          : item
      )
    );

    toast({
      title: "Sync Started",
      description: `${selectedRows.length} records are now syncing.`,
    });

    // After 5 seconds, randomly resolve to either "Synced" or "Sync Failed"
    setTimeout(() => {
      setParsedData(prevData => 
        prevData.map(item => {
          if (selectedRows.includes(item.id) && item.approval === "Syncing") {
            // 70% chance of success, 30% chance of failure
            const isSuccess = Math.random() > 0.3;
            return { 
              ...item, 
              approval: isSuccess ? "Synced" : "Sync Failed",
              syncStatus: isSuccess ? "Synced" : "Sync Failed"
            };
          }
          return item;
        })
      );

      toast({
        title: "Sync Complete",
        description: `${selectedRows.length} records have finished syncing.`,
      });
    }, 5000);

    setSelectedRows([]);
    setSelectAll(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Pending Migration</h1>
      </div>

      {/* Summary Stats - Only show when not on No Update tab */}
      {activeTab === "migration-data" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card 
            className={`bg-gray-900 border-gray-800 cursor-pointer transition-all ${filterType === 'errors' ? 'ring-2 ring-red-500' : 'hover:border-red-600'}`}
            onClick={() => setFilterType(filterType === 'errors' ? 'all' : 'errors')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Needs Review</p>
                  <p className="text-2xl font-bold text-red-400">
                    {recordsWithErrors}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-red-400" />
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
                  <p className="text-sm text-gray-400">Ready to Sync</p>
                  <p className="text-2xl font-bold text-green-400">
                    {recordsReadyToImport}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`bg-gray-900 border-gray-800 cursor-pointer transition-all ${filterType === 'synced' ? 'ring-2 ring-blue-500' : 'hover:border-blue-600'}`}
            onClick={() => setFilterType(filterType === 'synced' ? 'all' : 'synced')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Synced</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {recordsSynced}
                  </p>
                </div>
                <Archive className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`bg-gray-900 border-gray-800 cursor-pointer transition-all ${filterType === 'failed' ? 'ring-2 ring-orange-500' : 'hover:border-orange-600'}`}
            onClick={() => setFilterType(filterType === 'failed' ? 'all' : 'failed')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Sync Failed</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {recordsSyncFailed}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Table with Tabs */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-100">Migration Records</CardTitle>
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
              {activeTab === "migration-data" && (
                <Button
                  onClick={handleMigrate}
                  disabled={selectedRows.length === 0}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Sync Selected ({selectedRows.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="migration-data" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                Migration Data
              </TabsTrigger>
              <TabsTrigger value="no-update" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                No Update
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="migration-data" className="mt-4">
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
                      <TableHead className="text-gray-300">Record Status</TableHead>
                      <TableHead className="text-gray-300">Case Status</TableHead>
                      <TableHead className="text-gray-300">Plaintiff</TableHead>
                      <TableHead className="text-gray-300">Case Type</TableHead>
                      <TableHead className="text-gray-300">Create Date</TableHead>
                      <TableHead className="text-gray-300">Settled Amount</TableHead>
                      <TableHead className="text-gray-300">Sync Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row) => (
                      <TableRow 
                        key={row.id}
                        className={`border-gray-800 ${
                          row.syncStatus === "Syncing" 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:bg-gray-800/50 cursor-pointer"
                        }`}
                        onClick={() => handleRowClick(row.id, row)}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(row.id)}
                            onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                            disabled={row.approval !== "Ready to Sync"}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <Badge
                            className={
                              row.status === "New"
                                ? "bg-blue-900/50 text-blue-400 border-blue-600"
                                : "bg-orange-900/50 text-orange-400 border-orange-600"
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <Badge
                            className={
                              row.caseStatus === "Active"
                                ? "bg-green-900/50 text-green-400 border-green-600"
                                : "bg-gray-900/50 text-gray-400 border-gray-600"
                            }
                          >
                            {row.caseStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-cyan-400 font-medium">
                          {row.plaintiff}
                        </TableCell>
                        <TableCell className="text-gray-300">{row.caseType}</TableCell>
                        <TableCell className="text-gray-300">{formatDate(row.createDate)}</TableCell>
                        <TableCell className="text-gray-300">
                          ${row.settledAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    className={
                                      row.syncStatus === "Needs Review"
                                        ? "bg-red-900/50 text-red-400 border-red-600"
                                        : row.syncStatus === "Ready to Sync"
                                        ? "bg-green-900/50 text-green-400 border-green-600"
                                        : row.syncStatus === "Synced"
                                        ? "bg-blue-900/50 text-blue-400 border-blue-600"
                                        : row.syncStatus === "Sync Failed"
                                        ? "bg-orange-900/50 text-orange-400 border-orange-600"
                                        : row.syncStatus === "Syncing"
                                        ? "bg-yellow-900/50 text-yellow-400 border-yellow-600"
                                        : "bg-gray-900/50 text-gray-400 border-gray-600"
                                    }
                                  >
                                    <div className="flex items-center">
                                      {row.syncStatus === "Syncing" && (
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                      )}
                                      {row.syncStatus === "Sync Failed" && (
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {row.syncStatus === "Synced" && (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {row.syncStatus}
                                    </div>
                                  </Badge>
                                </TooltipTrigger>
                                 <TooltipContent>
                                   {(row as any).syncError && (
                                     <p className="text-sm">{(row as any).syncError}</p>
                                   )}
                                   {!(row as any).syncError && (
                                    <p className="text-sm">
                                      {row.syncStatus === "Syncing" && "Record is currently being synced"}
                                      {row.syncStatus === "Synced" && "Record has been successfully synced"}
                                      {row.syncStatus === "Ready to Sync" && "Record is ready to be synced"}
                                      {row.syncStatus === "Needs Review" && "Record needs to be reviewed before syncing"}
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="no-update" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-300">Record Status</TableHead>
                      <TableHead className="text-gray-300">Plaintiff</TableHead>
                      <TableHead className="text-gray-300">Case Type</TableHead>
                      <TableHead className="text-gray-300">Create Date</TableHead>
                      <TableHead className="text-gray-300">Settled Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row) => (
                      <TableRow 
                        key={row.id}
                        className="border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => handleRowClick(row.id, row)}
                      >
                        <TableCell className="text-gray-300">
                          <Badge className="bg-purple-900/50 text-purple-400 border-purple-600">
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-cyan-400 font-medium">
                          {row.plaintiff}
                        </TableCell>
                        <TableCell className="text-gray-300">{row.caseType}</TableCell>
                        <TableCell className="text-gray-300">{formatDate(row.createDate)}</TableCell>
                        <TableCell className="text-gray-300">
                          ${row.settledAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
};

export default PendingMigration;
