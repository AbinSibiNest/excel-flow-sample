import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, Plus, AlertTriangle, RotateCcw, ExternalLink, RefreshCw, Download, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Settlements() {
  const navigate = useNavigate();

  // State management
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [paymentMethods, setPaymentMethods] = useState<{[key: number]: string}>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [includeVendorDetails, setIncludeVendorDetails] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBatchError, setShowBatchError] = useState(false);
  const [selectAllItems, setSelectAllItems] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Mock data for payments
  const [paymentsData, setPaymentsData] = useState({
    liens: [
      {
        id: 1,
        vendor: "Medical Lien LLC",
        lineItem: "Hospital treatment for case #12345",
        amount: 15000,
        preferredMethod: "ACH",
        accountHint: "****1234",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 15000
      },
      {
        id: 2,
        vendor: "Legal Services Corp",
        lineItem: "Attorney fees - settlement negotiation",
        amount: 8500,
        preferredMethod: "Check",
        accountHint: "New York, NY 10001",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 8500
      },
      {
        id: 11,
        vendor: "Rehabilitation Center",
        lineItem: "Occupational therapy",
        amount: 3500,
        preferredMethod: "ACH",
        accountHint: "****5555",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 3500
      },
      {
        id: 5,
        vendor: "Healthcare Provider Inc",
        lineItem: "Physical therapy services",
        amount: 4200,
        preferredMethod: "ACH",
        accountHint: "****9876",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 4200
      },
      {
        id: 12,
        vendor: "Diagnostic Imaging",
        lineItem: "MRI and X-ray services",
        amount: 2200,
        preferredMethod: "Check",
        accountHint: "Seattle, WA 98101",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 2200
      },
      {
        id: 13,
        vendor: "Orthopedic Specialists",
        lineItem: "Surgery consultation",
        amount: 1500,
        preferredMethod: "ACH",
        accountHint: "****3333",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 1500
      },
      {
        id: 6,
        vendor: "Pharmacy Solutions",
        lineItem: "Prescription medications",
        amount: 850,
        preferredMethod: "Check",
        accountHint: "Boston, MA 02115",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 850
      },
      {
        id: 7,
        vendor: "Medical Equipment Co",
        lineItem: "Wheelchair rental - 6 months",
        amount: 1800,
        preferredMethod: "ACH",
        accountHint: "****4321",
        status: "To Be Paid",
        hasAccountDetails: false,
        remainingBalance: 1800
      }
    ],
    expenses: [
      {
        id: 3,
        vendor: "Expert Witness Co",
        lineItem: "Medical expert testimony",
        amount: 3200,
        preferredMethod: "ACH",
        accountHint: "****5678",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 3200
      },
      {
        id: 4,
        vendor: "Court Filing Services",
        lineItem: "Document filing fees",
        amount: 450,
        preferredMethod: "Check",
        accountHint: "Chicago, IL 60601",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 450
      },
      {
        id: 16,
        vendor: "Process Server Inc",
        lineItem: "Legal document service",
        amount: 275,
        preferredMethod: "Check",
        accountHint: "Austin, TX 78701",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 275
      },
      {
        id: 8,
        vendor: "Investigation Services",
        lineItem: "Accident reconstruction analysis",
        amount: 2500,
        preferredMethod: "ACH",
        accountHint: "****7890",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 2500
      },
      {
        id: 17,
        vendor: "Medical Records Co",
        lineItem: "Record retrieval service",
        amount: 350,
        preferredMethod: "ACH",
        accountHint: "****4444",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 350
      },
      {
        id: 18,
        vendor: "Copy Services Inc",
        lineItem: "Document duplication",
        amount: 125,
        preferredMethod: "Check",
        accountHint: "Portland, OR 97201",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 125
      },
      {
        id: 14,
        vendor: "Deposition Services",
        lineItem: "Court reporter fees",
        amount: 850,
        preferredMethod: "ACH",
        accountHint: "****2222",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 850
      },
      {
        id: 9,
        vendor: "Document Review LLC",
        lineItem: "Medical records review",
        amount: 1200,
        preferredMethod: "Check",
        accountHint: "Miami, FL 33101",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 1200
      },
      {
        id: 10,
        vendor: "Travel Reimbursement",
        lineItem: "Client travel expenses",
        amount: 650,
        preferredMethod: "ACH",
        accountHint: "****1111",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 650
      },
      {
        id: 15,
        vendor: "Legal Research Co",
        lineItem: "Case law research",
        amount: 500,
        preferredMethod: "Check",
        accountHint: "Denver, CO 80202",
        status: "To Be Paid",
        hasAccountDetails: true,
        remainingBalance: 500
      }
    ]
  });

  // Initialize payment methods from data
  useEffect(() => {
    const methods: {[key: number]: string} = {};
    [...paymentsData.liens, ...paymentsData.expenses].forEach(item => {
      methods[item.id] = item.preferredMethod;
    });
    setPaymentMethods(methods);
  }, [paymentsData]);

  // Helper functions
  const formatCurrency = (amount: number) => `$${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "To Be Paid": return "secondary";
      case "Queued": return "default";
      case "Sent": return "success";
      case "Processing": return "processing";
      case "Failed": return "destructive";
      default: return "secondary";
    }
  };

  const handleItemSelect = (itemId: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleGroupSelect = (groupData: any[], checked: boolean) => {
    const newSelected = new Set(selectedItems);
    groupData.forEach(item => {
      if ((item.status === "To Be Paid" || item.status === "Failed") && item.hasAccountDetails) {
        if (checked) {
          newSelected.add(item.id);
        } else {
          newSelected.delete(item.id);
        }
      }
    });
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAllItems(checked);
    const newSelected = new Set<number>();
    if (checked) {
      [...paymentsData.liens, ...paymentsData.expenses].forEach(item => {
        if ((item.status === "To Be Paid" || item.status === "Failed") && item.hasAccountDetails) {
          newSelected.add(item.id);
        }
      });
    }
    setSelectedItems(newSelected);
  };

  const getAllSelectableItems = () => {
    const allItems = [...paymentsData.liens, ...paymentsData.expenses];
    return allItems.filter(item => (item.status === "To Be Paid" || item.status === "Failed") && item.hasAccountDetails);
  };

  const isAllSelected = () => {
    const selectableItems = getAllSelectableItems();
    return selectableItems.length > 0 && selectableItems.every(item => selectedItems.has(item.id));
  };

  const isSomeSelected = () => {
    const selectableItems = getAllSelectableItems();
    return selectableItems.some(item => selectedItems.has(item.id));
  };

  const handlePaymentMethodChange = (itemId: number, method: string) => {
    setPaymentMethods(prev => ({ ...prev, [itemId]: method }));
  };

  const getSelectedItems = () => {
    const allItems = [...paymentsData.liens, ...paymentsData.expenses];
    return allItems.filter(item => selectedItems.has(item.id));
  };

  const getSelectedTotal = () => {
    return getSelectedItems().reduce((total, item) => total + item.remainingBalance, 0);
  };

  const hasValidationErrors = () => {
    return getSelectedItems().some(item => {
      const method = paymentMethods[item.id];
      return !item.hasAccountDetails && method === "ACH";
    });
  };

  const handleReleasePayments = () => {
    if (hasValidationErrors()) {
      setShowBatchError(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmPaymentRelease = () => {
    setShowConfirmModal(false);
    setIsProcessing(true);
    setBatchProgress(0);
    
    // Simulate payment processing
    const interval = setInterval(() => {
      setBatchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // First move selected items to Queued status
          const selectedItemIds = Array.from(selectedItems);
          setPaymentsData(prevData => ({
            liens: prevData.liens.map(item => 
              selectedItems.has(item.id) ? { ...item, status: "Queued" } : item
            ),
            expenses: prevData.expenses.map(item => 
              selectedItems.has(item.id) ? { ...item, status: "Queued" } : item
            )
          }));
          
          // Move items to Processing status one by one with 1 second delay
          selectedItemIds.forEach((itemId, index) => {
            setTimeout(() => {
              setPaymentsData(prevData => ({
                liens: prevData.liens.map(item => 
                  item.id === itemId ? { ...item, status: "Processing" } : item
                ),
                expenses: prevData.expenses.map(item => 
                  item.id === itemId ? { ...item, status: "Processing" } : item
                )
              }));
            }, (index + 1) * 1000);
          });
          
          setSelectedItems(new Set());
          setSelectAllItems(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRefresh = (itemId: number) => {
    // Randomly assign Sent (80%) or Failed (20%)
    const finalStatus = Math.random() > 0.2 ? "Sent" : "Failed";
    const remainingBalance = finalStatus === "Sent" ? 0 : undefined;
    
    setPaymentsData(prevData => ({
      liens: prevData.liens.map(item => 
        item.id === itemId ? { 
          ...item, 
          status: finalStatus,
          ...(remainingBalance !== undefined && { remainingBalance })
        } : item
      ),
      expenses: prevData.expenses.map(item => 
        item.id === itemId ? { 
          ...item, 
          status: finalStatus,
          ...(remainingBalance !== undefined && { remainingBalance })
        } : item
      )
    }));
  };

  const handleRetryFailed = (itemId?: number) => {
    if (itemId) {
      // Retry single item
      setPaymentsData(prevData => ({
        liens: prevData.liens.map(item => 
          item.id === itemId ? { ...item, status: "Processing" } : item
        ),
        expenses: prevData.expenses.map(item => 
          item.id === itemId ? { ...item, status: "Processing" } : item
        )
      }));
    } else {
      // Retry all failed items
      setPaymentsData(prevData => ({
        liens: prevData.liens.map(item => 
          item.status === "Failed" ? { ...item, status: "Processing" } : item
        ),
        expenses: prevData.expenses.map(item => 
          item.status === "Failed" ? { ...item, status: "Processing" } : item
        )
      }));
    }
  };

  const getFilteredData = () => {
    const allItems = [...paymentsData.liens, ...paymentsData.expenses];
    
    if (!activeFilter) {
      return allItems;
    }
    
    switch (activeFilter) {
      case "to-be-paid":
        return allItems.filter(item => item.status === "To Be Paid");
      case "processing":
        return allItems.filter(item => item.status === "Queued" || item.status === "Processing");
      case "completed":
        return allItems.filter(item => item.status === "Sent" || item.remainingBalance === 0);
      case "needs-setup":
        return allItems.filter(item => !item.hasAccountDetails || item.status === "Failed");
      default:
        return allItems;
    }
  };

  const getFilterCounts = () => {
    const allItems = [...paymentsData.liens, ...paymentsData.expenses];
    return {
      "to-be-paid": allItems.filter(item => item.status === "To Be Paid").length,
      "processing": allItems.filter(item => item.status === "Queued" || item.status === "Processing").length,
      "completed": allItems.filter(item => item.status === "Sent" || item.remainingBalance === 0).length,
      "needs-setup": allItems.filter(item => !item.hasAccountDetails || item.status === "Failed").length
    };
  };

  const PaymentTable = ({ data, title }: { data: any[], title: string }) => {
    const selectableItems = data.filter(item => (item.status === "To Be Paid" || item.status === "Failed") && item.hasAccountDetails);
    const groupSelected = selectableItems.length > 0 && selectableItems.every(item => selectedItems.has(item.id));
    const someSelected = selectableItems.some(item => selectedItems.has(item.id));

    return (
      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col gap-3">
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No {title.toLowerCase()} available for payment.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Checkbox
                        checked={groupSelected}
                        onCheckedChange={(checked) => handleGroupSelect(data, checked as boolean)}
                        className={someSelected && !groupSelected ? "data-[state=checked]:bg-primary/50" : ""}
                      />
                      <Label className="text-sm">Select all {title.toLowerCase()}</Label>
                    </div>
                  </TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Line Item</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Preferred Method</TableHead>
                  <TableHead>Payee Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  const isSelectable = item.status === "To Be Paid" || item.status === "Failed";
                  const method = paymentMethods[item.id] || item.preferredMethod;
                  const hasError = !item.hasAccountDetails && method === "ACH";
                  
                  return (
                    <TableRow key={item.id} className={hasError ? "bg-destructive/5" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                          disabled={!isSelectable}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.vendor}</TableCell>
                      <TableCell>{item.lineItem}</TableCell>
                      <TableCell>{formatCurrency(item.remainingBalance)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Select
                            value={method}
                            onValueChange={(value) => handlePaymentMethodChange(item.id, value)}
                            disabled={!isSelectable}
                          >
                            <SelectTrigger className={`w-24 ${hasError ? "border-destructive" : ""}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACH">ACH</SelectItem>
                              <SelectItem value="Check">Check</SelectItem>
                            </SelectContent>
                          </Select>
                          {hasError && (
                            <div className="flex items-center gap-1 text-xs text-destructive">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Missing details</span>
                              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Edit Account
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.accountHint}</TableCell>
                       <TableCell>
                         <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                       </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2">
                           {item.status === "Failed" && (
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleRetryFailed(item.id)}
                             >
                               <RotateCcw className="h-3 w-3 mr-1" />
                               Retry
                             </Button>
                           )}
                         </div>
                       </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1f26] text-gray-100">
      {/* Settlement Header */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-gray-300 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="home" className="h-full flex flex-col">
        <div className="border-b border-gray-700 px-6">
          <TabsList className="grid w-full max-w-5xl grid-cols-5 bg-transparent h-12 p-0">
            <TabsTrigger
              value="home"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              Home
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              Vendor Payments
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="text-gray-300 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none h-12 hover:text-white transition-colors"
            >
              Timeline
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-6">
          <TabsContent value="home" className="h-full m-0">
            <div className="text-center py-8 text-gray-400">
              Settlement home overview will be displayed here.
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="h-full m-0">
            <div className="text-center py-8 text-gray-400">
              Detailed settlement information will be displayed here.
            </div>
          </TabsContent>
          
          <TabsContent value="vendor-payments" className="h-full m-0">
            <div className="text-center py-8 text-gray-400">
              Vendor payment details will be displayed here.
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="h-full m-0">
            <div className="space-y-6">
              {/* Filter Banners */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const counts = getFilterCounts();
                  return [
                    {
                      key: "to-be-paid",
                      title: "To Be Paid",
                      count: counts["to-be-paid"],
                      icon: FileText,
                      color: "bg-blue-600 border-blue-500",
                      description: "Payable items with remaining balance"
                    },
                    {
                      key: "processing",
                      title: "Processing",
                      count: counts["processing"],
                      icon: RefreshCw,
                      color: "bg-orange-600 border-orange-500",
                      description: "Items in queued/processing states"
                    },
                    {
                      key: "completed",
                      title: "Completed",
                      count: counts["completed"],
                      icon: Download,
                      color: "bg-green-600 border-green-500",
                      description: "Sent/settled items"
                    },
                    {
                      key: "needs-setup",
                      title: "Needs Setup",
                      count: counts["needs-setup"],
                      icon: AlertCircle,
                      color: "bg-red-600 border-red-500",
                      description: "Missing vendor account or details"
                    }
                  ].map(({ key, title, count, icon: Icon, color, description }) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all border-2 ${
                        activeFilter === key
                          ? `${color} bg-opacity-20`
                          : "bg-gray-800 border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => setActiveFilter(activeFilter === key ? null : key)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-white" />
                              <h3 className="font-semibold text-white">{title}</h3>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{description}</p>
                          </div>
                          <div className="text-2xl font-bold text-white">{count}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ));
                })()}
              </div>
              {/* Global Selection Controls */}
              <Card className="mb-6 bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isAllSelected()}
                          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                          className={isSomeSelected() && !isAllSelected() ? "data-[state=checked]:bg-primary/50" : ""}
                        />
                        <Label className="text-sm text-gray-300">
                          Select all items ({getAllSelectableItems().length} available)
                        </Label>
                      </div>
                      {selectedItems.size > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300">
                            {selectedItems.size} selected
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItems(new Set());
                              setSelectAllItems(false);
                            }}
                            className="text-gray-300 border-gray-600 hover:bg-gray-700"
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                     </div>
                     <div className="flex items-center gap-2">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           const allItems = [...paymentsData.liens, ...paymentsData.expenses];
                           const processingItems = allItems.filter(item => item.status === "Processing");
                           processingItems.forEach(item => handleRefresh(item.id));
                         }}
                         className="text-gray-300 border-gray-600 hover:bg-gray-700"
                       >
                         <RefreshCw className="h-4 w-4 mr-2" />
                         Refresh All
                       </Button>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           // Export based on current filter
                           const filteredData = getFilteredData();
                           console.log('Exporting filtered data:', filteredData);
                           // Add actual export logic here
                         }}
                         className="text-gray-300 border-gray-600 hover:bg-gray-700"
                       >
                         <Download className="h-4 w-4 mr-2" />
                         Export
                       </Button>
                       {selectedItems.size > 0 && (
                         <Button
                           onClick={handleReleasePayments}
                           disabled={selectedItems.size === 0 || hasValidationErrors()}
                           className="bg-blue-600 hover:bg-blue-700 text-white"
                         >
                           Release Payments ({selectedItems.size})
                         </Button>
                       )}
                     </div>
                  </div>
                </CardHeader>
              </Card>

              {/* List Content - Grouped Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Liens Group */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Liens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pre-Disbursement */}
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-3">Pre-Disbursement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Available</span>
                          <span className="text-sm text-white">{formatCurrency(4000000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Allocated (Platform)</span>
                          <span className="text-sm text-white">{formatCurrency(paymentsData.liens.reduce((sum, item) => sum + item.remainingBalance, 0))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Unallocated</span>
                          <span className="text-sm text-white">{formatCurrency(4000000 - paymentsData.liens.reduce((sum, item) => sum + item.remainingBalance, 0))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Vendor Payments To Be Done</span>
                          <span className="text-sm text-white">{paymentsData.liens.filter(item => item.remainingBalance > 0 && (item.status === "To Be Paid" || item.status === "Failed")).length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Post-Disbursement */}
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-3">Post-Disbursement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Remaining After Disbursement</span>
                          <span className="text-sm text-white">{formatCurrency(3500000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Disbursed</span>
                          <span className="text-sm text-white">{formatCurrency(paymentsData.liens.filter(item => item.status === "Sent").reduce((sum, item) => sum + item.amount, 0))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Manual/Alternate Required</span>
                          <span className="text-sm text-white">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Failed Transactions</span>
                          <span className="text-sm text-white">{paymentsData.liens.filter(item => item.status === "Failed").length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expenses Group */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pre-Disbursement */}
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-3">Pre-Disbursement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Available</span>
                          <span className="text-sm text-white">{formatCurrency(1000000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Allocated (Platform)</span>
                          <span className="text-sm text-white">{formatCurrency(paymentsData.expenses.reduce((sum, item) => sum + item.remainingBalance, 0))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Unallocated</span>
                          <span className="text-sm text-white">{formatCurrency(1000000 - paymentsData.expenses.reduce((sum, item) => sum + item.remainingBalance, 0))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Vendor Payments To Be Done</span>
                          <span className="text-sm text-white">{paymentsData.expenses.filter(item => item.remainingBalance > 0 && (item.status === "To Be Paid" || item.status === "Failed")).length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Post-Disbursement */}
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-3">Post-Disbursement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Remaining After Disbursement</span>
                          <span className="text-sm text-white">{formatCurrency(900000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Total Disbursed</span>
                          <span className="text-sm text-white">{formatCurrency(paymentsData.expenses.filter(item => item.status === "Sent").reduce((sum, item) => sum + item.amount, 0))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Manual/Alternate Required</span>
                          <span className="text-sm text-white">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Failed Transactions</span>
                          <span className="text-sm text-white">{paymentsData.expenses.filter(item => item.status === "Failed").length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Batch Error Banner */}
              {showBatchError && (
                <Alert className="border-red-600 bg-red-600/10">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-400">
                    Failed to create payment batch. Please try again or contact support.
                    <Button variant="link" className="p-0 ml-2 h-auto text-red-400 underline">
                      View Details
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Empty State */}
              {[...paymentsData.liens, ...paymentsData.expenses].length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No payment items available</h3>
                  <p className="text-gray-400 mb-4">There are currently no payable items for this settlement.</p>
                  <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                    Add Payment Item
                  </Button>
                </div>
              )}

              {/* Processing Progress */}
              {isProcessing && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Processing payment batch...</span>
                      <span className="text-sm text-gray-400">{batchProgress}%</span>
                    </div>
                    <Progress value={batchProgress} className="bg-gray-700" />
                  </CardContent>
                </Card>
              )}

              {(() => {
                const filteredData = getFilteredData();
                const liens = filteredData.filter(item => paymentsData.liens.includes(item));
                const expenses = filteredData.filter(item => paymentsData.expenses.includes(item));
                
                return (
                  <>
                    {liens.length > 0 && <PaymentTable data={liens} title="Liens" />}
                    {expenses.length > 0 && <PaymentTable data={expenses} title="Expenses" />}
                    {filteredData.length === 0 && (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">
                          No items in {activeFilter.replace("-", " ")} category
                        </h3>
                        <p className="text-gray-400">
                          {activeFilter === "to-be-paid" && "All payable items have been processed."}
                          {activeFilter === "processing" && "No items are currently being processed."}
                          {activeFilter === "completed" && "No payments have been completed yet."}
                          {activeFilter === "needs-setup" && "All items have proper vendor setup."}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Failed Items Retry */}
              {[...paymentsData.liens, ...paymentsData.expenses].some(item => item.status === "Failed") && (
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => handleRetryFailed()} className="text-gray-300 border-gray-600 hover:bg-gray-700">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry All Failed
                  </Button>
                </div>
              )}
            </div>


            {/* Confirmation Modal */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
              <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Confirm Payment Release</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-white">Payment Summary</h4>
                      <p className="text-sm text-gray-400">
                        {selectedItems.size} items • {formatCurrency(getSelectedTotal())}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Source Accounts</h4>
                      <div className="text-sm text-gray-400 space-y-1">
                        {getSelectedItems().some(item => paymentsData.liens.includes(item)) && (
                          <p>Liens → Lien Resolution Account</p>
                        )}
                        {getSelectedItems().some(item => paymentsData.expenses.includes(item)) && (
                          <p>Expenses → Expense Reimbursement Account</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-600 bg-gray-700/20 rounded-lg p-3 max-h-48 overflow-y-auto">
                    <h4 className="font-medium mb-2 text-white">Selected Items</h4>
                    <div className="space-y-2">
                      {getSelectedItems().map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-300">{item.vendor} - {item.lineItem}</span>
                          <span className="text-white">{formatCurrency(item.remainingBalance)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="vendor-details"
                      checked={includeVendorDetails}
                      onCheckedChange={setIncludeVendorDetails}
                    />
                    <Label htmlFor="vendor-details" className="text-sm text-gray-300">
                      Include vendor details in payment notifications
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="text-gray-300 border-gray-600 hover:bg-gray-700">
                    Cancel
                  </Button>
                  <Button onClick={confirmPaymentRelease} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Release {selectedItems.size} Payment{selectedItems.size !== 1 ? 's' : ''}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="timeline" className="h-full m-0">
            <div className="text-center py-8 text-gray-400">
              Settlement timeline and milestones will be displayed here.
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}