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
        status: "Queued",
        hasAccountDetails: false,
        remainingBalance: 8500
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
        status: "Sent",
        hasAccountDetails: true,
        remainingBalance: 0
      },
      {
        id: 4,
        vendor: "Court Filing Services",
        lineItem: "Document filing fees",
        amount: 450,
        preferredMethod: "Check",
        accountHint: "Chicago, IL 60601",
        status: "Failed",
        hasAccountDetails: true,
        remainingBalance: 450
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
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
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
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            GO BACK
          </Button>
          <h1 className="text-xl font-semibold">Settlements</h1>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Settlement Details</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Settlement
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="home">HOME</TabsTrigger>
                <TabsTrigger value="details">DETAILS</TabsTrigger>
                <TabsTrigger value="payments">PAYMENTS</TabsTrigger>
                <TabsTrigger value="timeline">TIMELINE</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Settlement overview and summary information will be displayed here.
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Detailed settlement information and documentation will be displayed here.
                </div>
              </TabsContent>
              
              <TabsContent value="payments" className="mt-6">
                <div className="space-y-6">
                  {/* Batch Error Alert */}
                  {showBatchError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Please fix validation errors before releasing payments. Some items are missing account details for ACH payments.
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 ml-2"
                          onClick={() => setShowBatchError(false)}
                        >
                          Dismiss
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Processing Progress */}
                  {isProcessing && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Processing payment batch...</span>
                          <span className="text-sm text-muted-foreground">{batchProgress}%</span>
                        </div>
                        <Progress value={batchProgress} />
                      </CardContent>
                    </Card>
                  )}

                  <PaymentTable data={paymentsData.liens} title="Liens" />
                  <PaymentTable data={paymentsData.expenses} title="Expenses" />

                  {/* Failed Items Retry */}
                  {[...paymentsData.liens, ...paymentsData.expenses].some(item => item.status === "Failed") && (
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={() => handleRetryFailed()}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry All Failed
                      </Button>
                    </div>
                  )}
                </div>

                {/* Sticky Summary Bar */}
                {selectedItems.size > 0 && (
                  <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-50">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                        </span>
                        <span className="text-muted-foreground">
                          Total: {formatCurrency(getSelectedTotal())}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setSelectedItems(new Set())}>
                          Clear Selection
                        </Button>
                        <Button 
                          onClick={handleReleasePayments}
                          disabled={selectedItems.size === 0 || isProcessing}
                        >
                          Release Payments ({selectedItems.size})
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirmation Modal */}
                <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Confirm Payment Release</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium">Payment Summary</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedItems.size} items • {formatCurrency(getSelectedTotal())}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Source Accounts</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {getSelectedItems().some(item => paymentsData.liens.includes(item)) && (
                              <p>Liens → Lien Resolution Account</p>
                            )}
                            {getSelectedItems().some(item => paymentsData.expenses.includes(item)) && (
                              <p>Expenses → Expense Reimbursement Account</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border border-border bg-muted/20 rounded-lg p-3 max-h-48 overflow-y-auto">
                        <h4 className="font-medium mb-2">Selected Items</h4>
                        <div className="space-y-2">
                          {getSelectedItems().map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.vendor} - {item.lineItem}</span>
                              <span>{formatCurrency(item.remainingBalance)}</span>
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
                        <Label htmlFor="vendor-details" className="text-sm">
                          Include vendor details in payment notifications
                        </Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={confirmPaymentRelease}>
                        Release {selectedItems.size} Payment{selectedItems.size !== 1 ? 's' : ''}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>
              
              <TabsContent value="timeline" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Settlement timeline and milestones will be displayed here.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}