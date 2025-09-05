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
import { ChevronLeft, Plus, AlertTriangle, RotateCcw, ExternalLink } from "lucide-react";
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
        hasAccountDetails: false,
        remainingBalance: 8500
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
        id: 9,
        vendor: "Document Review LLC",
        lineItem: "Medical records review",
        amount: 1200,
        preferredMethod: "Check",
        accountHint: "Miami, FL 33101",
        status: "To Be Paid",
        hasAccountDetails: false,
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
      if (item.status === "To Be Paid" || item.status === "Failed") {
        if (checked) {
          newSelected.add(item.id);
        } else {
          newSelected.delete(item.id);
        }
      }
    });
    setSelectedItems(newSelected);
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
          
          // Update selected items to Processing status
          setPaymentsData(prevData => ({
            liens: prevData.liens.map(item => 
              selectedItems.has(item.id) ? { ...item, status: "Processing" } : item
            ),
            expenses: prevData.expenses.map(item => 
              selectedItems.has(item.id) ? { ...item, status: "Processing" } : item
            )
          }));
          
          setSelectedItems(new Set());
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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

  const PaymentTable = ({ data, title }: { data: any[], title: string }) => {
    const selectableItems = data.filter(item => item.status === "To Be Paid" || item.status === "Failed");
    const groupSelected = selectableItems.length > 0 && selectableItems.every(item => selectedItems.has(item.id));
    const someSelected = selectableItems.some(item => selectedItems.has(item.id));

    return (
      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col gap-3">
            <CardTitle className="text-lg">{title}</CardTitle>
            {selectableItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={groupSelected}
                  onCheckedChange={(checked) => handleGroupSelect(data, checked as boolean)}
                  className={someSelected && !groupSelected ? "data-[state=checked]:bg-primary/50" : ""}
                />
                <Label className="text-sm">Select all {title.toLowerCase()}</Label>
              </div>
            )}
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
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Line Item</TableHead>
                  <TableHead>Amount (Remaining)</TableHead>
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
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                          {item.status === "Processing" && (
                            <div className="w-16">
                              <Progress value={75} className="h-1" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
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
              {/* Selection Controls */}
              {selectedItems.size > 0 && (
                <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-300">
                      {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItems(new Set())}
                      className="text-gray-300 border-gray-600 hover:bg-gray-700"
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <Button
                    onClick={handleReleasePayments}
                    disabled={selectedItems.size === 0 || hasValidationErrors()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Release Payments ({selectedItems.size})
                  </Button>
                </div>
              )}

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

              {paymentsData.liens.length > 0 && <PaymentTable data={paymentsData.liens} title="Liens" />}
              {paymentsData.expenses.length > 0 && <PaymentTable data={paymentsData.expenses} title="Expenses" />}

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