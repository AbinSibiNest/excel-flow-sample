import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function Banking() {
  const navigate = useNavigate();
  const [isUnrestrictedDialogOpen, setIsUnrestrictedDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [achAccordionOpen, setAchAccordionOpen] = useState<string[]>(["ach"]);
  const [checkAccordionOpen, setCheckAccordionOpen] = useState<string[]>([]);
  const [editAchAccordionOpen, setEditAchAccordionOpen] = useState<string[]>([]);
  const [editCheckAccordionOpen, setEditCheckAccordionOpen] = useState<string[]>([]);
  const [unrestrictedAccounts, setUnrestrictedAccounts] = useState(() => {
    const saved = localStorage.getItem('unrestrictedAccounts');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        created: "3/12/2025",
        name: "Operating",
        type: "vendor",
        achAccountType: "checking",
        accountNumber: "8771615402",
        routingNumber: "021000021",
        accountStatus: "Active",
        verificationStatus: "Verified",
        vendorType: "expense-reimbursement",
        preferredPaymentMethod: "ach",
        addressLine1: "123 Main Street",
        addressLine2: "Suite 100",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      }
    ];
  });

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    achAccountType: "",
    accountNumber: "",
    routingNumber: "",
    vendorType: "",
    preferredPaymentMethod: "ach",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const [withdrawData, setWithdrawData] = useState({
    from: "",
    to: "",
    amount: "",
    settlement: "",
    lineItem: ""
  });

  // Mock data for dropdowns
  const settlements = [
    { id: "case-123", name: "Case #123 – Lien Payment" },
    { id: "case-456", name: "Case #456 – Settlement Payment" },
    { id: "case-789", name: "Case #789 – Expense Reimbursement" }
  ];

  const lineItems = {
    "case-123": [
      { id: "li-1", name: "Medical Bills", amount: 5000 },
      { id: "li-2", name: "Legal Fees", amount: 2500 }
    ],
    "case-456": [
      { id: "li-3", name: "Plaintiff Settlement", amount: 15000 },
      { id: "li-4", name: "Attorney Fees", amount: 5000 }
    ],
    "case-789": [
      { id: "li-5", name: "Travel Expenses", amount: 500 },
      { id: "li-6", name: "Court Fees", amount: 750 }
    ]
  };

  // Reset form data to defaults when dialog opens
  useEffect(() => {
    if (isUnrestrictedDialogOpen) {
      setFormData({
        name: "",
        type: "",
        achAccountType: "",
        accountNumber: "",
        routingNumber: "",
        vendorType: "",
        preferredPaymentMethod: "ach",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: ""
      });
      // Auto-open ACH accordion by default
      setAchAccordionOpen(["ach"]);
      setCheckAccordionOpen([]);
    }
  }, [isUnrestrictedDialogOpen]);

  // Handle edit form and auto-open accordions
  useEffect(() => {
    if (isEditDialogOpen && selectedAccount) {
      if (selectedAccount.preferredPaymentMethod === "ach") {
        setEditAchAccordionOpen(["ach"]);
        setEditCheckAccordionOpen([]);
      } else if (selectedAccount.preferredPaymentMethod === "check") {
        setEditAchAccordionOpen([]);
        setEditCheckAccordionOpen(["check"]);
      }
    }
  }, [isEditDialogOpen, selectedAccount]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEditFormChange = (field: string, value: string) => {
    if (selectedAccount) {
      const updatedAccount = { ...selectedAccount, [field]: value };
      setSelectedAccount(updatedAccount);
      
      // Auto-open accordions based on preferred payment method in edit
      if (field === "preferredPaymentMethod") {
        if (value === "ach") {
          setEditAchAccordionOpen(["ach"]);
          setEditCheckAccordionOpen([]);
        } else if (value === "check") {
          setEditAchAccordionOpen([]);
          setEditCheckAccordionOpen(["check"]);
        }
      }
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-open accordions based on preferred payment method
    if (field === "preferredPaymentMethod") {
      if (value === "ach") {
        setAchAccordionOpen(["ach"]);
        setCheckAccordionOpen([]);
      } else if (value === "check") {
        setAchAccordionOpen([]);
        setCheckAccordionOpen(["check"]);
      }
    }
  };

  const handleWithdrawChange = (field: string, value: string) => {
    setWithdrawData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-fill amount when line item is selected
      if (field === "lineItem" && value && withdrawData.settlement) {
        const selectedLineItems = lineItems[withdrawData.settlement as keyof typeof lineItems];
        const selectedItem = selectedLineItems?.find(item => item.id === value);
        if (selectedItem) {
          newData.amount = selectedItem.amount.toString();
        }
      }
      
      // Clear line item when settlement changes
      if (field === "settlement") {
        newData.lineItem = "";
        newData.amount = "";
      }
      
      return newData;
    });
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "vendor": return "Vendor";
      case "firm": return "Firm";
      case "other": return "Other External";
      default: return "";
    }
  };

  const getPaymentMethodDisplay = (account: any) => {
    if (account.preferredPaymentMethod === "ach") return "ACH";
    if (account.preferredPaymentMethod === "check") return "Check";
    return "";
  };

  const getSelectedAccount = () => {
    return unrestrictedAccounts.find(acc => acc.id.toString() === withdrawData.to);
  };

  const isFormValid = () => {
    const { name, type, achAccountType, accountNumber, routingNumber, vendorType, preferredPaymentMethod, addressLine1, city, state, zipCode } = formData;
    
    // Basic required fields
    if (!name || !type) return false;
    
    // ACH validation
    if (preferredPaymentMethod === "ach" && (!achAccountType || !accountNumber || !routingNumber)) return false;
    
    // Check validation
    if (preferredPaymentMethod === "check" && (!addressLine1 || !city || !state || !zipCode)) return false;
    
    // Vendor type required if account type is vendor
    if (type === "vendor" && !vendorType) return false;
    
    return true;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const newAccount = {
        id: unrestrictedAccounts.length + 1,
        created: new Date().toLocaleDateString(),
        name: formData.name,
        type: formData.type,
        achAccountType: formData.achAccountType,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
        accountStatus: "Pending",
        verificationStatus: "Pending",
        vendorType: formData.vendorType,
        preferredPaymentMethod: formData.preferredPaymentMethod,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };
      
      const updatedAccounts = [...unrestrictedAccounts, newAccount];
      setUnrestrictedAccounts(updatedAccounts);
      localStorage.setItem('unrestrictedAccounts', JSON.stringify(updatedAccounts));
      setIsUnrestrictedDialogOpen(false);
      setFormData({
        name: "",
        type: "",
        achAccountType: "",
        accountNumber: "",
        routingNumber: "",
        vendorType: "",
        preferredPaymentMethod: "ach",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: ""
      });
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          GO BACK
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-6 mb-8 border-b border-border">
        {['HOME', 'USERS', 'BANKING', 'CASE TYPES', 'QUESTIONNAIRES', 'SNIPPETS', 'CASES', 'CLIENTS', 'DEFENDANTS', 'DOCUMENT REQUESTS', 'SIGNATURE REQUESTS', 'DATA REQUESTS', 'DEDUCTIONS', 'SETTLEMENTS'].map((tab) => (
          <button
            key={tab}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === 'BANKING' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Integration Details */}
        <div className="lg:col-span-1">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Integration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Provisioning</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">COMPLETED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">OFAC</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">VERIFIED</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Accounts */}
        <div className="lg:col-span-3">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">System Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Revenue Recognition */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">Revenue Recognition</h3>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Account Number</div>
                    <div className="text-sm text-foreground">76650000022367</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Routing Number (ABA)</div>
                    <div className="text-sm text-foreground">053101561</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold text-foreground">$880.00</div>
                  </div>
                  <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        $ WITHDRAW FUNDS
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-popover border-border">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">Withdraw Funds</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="from" className="text-foreground">From</Label>
                            <Select value={withdrawData.from} onValueChange={(value) => handleWithdrawChange("from", value)}>
                              <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                <SelectItem value="revenue-recognition">Revenue Recognition</SelectItem>
                                <SelectItem value="expense-reimbursement">Expense Reimbursement</SelectItem>
                                <SelectItem value="lien-resolution">Lien Resolution</SelectItem>
                                <SelectItem value="case-clearing">Case Clearing</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="to" className="text-foreground">To *</Label>
                            <div className="space-y-2">
                              <Select value={withdrawData.to} onValueChange={(value) => handleWithdrawChange("to", value)}>
                                <SelectTrigger className="bg-background border-border text-foreground">
                                  <SelectValue placeholder="Select recipient" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  {unrestrictedAccounts.map((account) => (
                                     <SelectItem key={account.id} value={account.id.toString()}>
                                       {getAccountTypeLabel(account.type)} – {account.name} ({getPaymentMethodDisplay(account)})
                                     </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {withdrawData.to && getSelectedAccount() && (
                                <div className="flex items-center gap-2">
                                   <Badge variant="secondary" className="text-xs">
                                     {getAccountTypeLabel(getSelectedAccount()!.type)}
                                   </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Payment Method: {getPaymentMethodDisplay(getSelectedAccount()!)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="settlement" className="text-foreground">Settlement (Optional)</Label>
                            <Select value={withdrawData.settlement} onValueChange={(value) => handleWithdrawChange("settlement", value)}>
                              <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Select settlement" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                {settlements.map((settlement) => (
                                  <SelectItem key={settlement.id} value={settlement.id}>
                                    {settlement.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lineItem" className="text-foreground">Line Item (Optional)</Label>
                            <Select 
                              value={withdrawData.lineItem} 
                              onValueChange={(value) => handleWithdrawChange("lineItem", value)}
                              disabled={!withdrawData.settlement}
                            >
                              <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder="Select line item" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                {withdrawData.settlement && lineItems[withdrawData.settlement as keyof typeof lineItems]?.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name} - ${item.amount.toLocaleString()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amount" className="text-foreground">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={withdrawData.amount}
                            onChange={(e) => handleWithdrawChange("amount", e.target.value)}
                            className="bg-background border-border text-foreground"
                            placeholder="0"
                          />
                        </div>

                        {/* Confirmation Preview */}
                        {withdrawData.from && withdrawData.to && withdrawData.amount && (
                          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                            <h4 className="font-medium text-foreground">Transaction Preview</h4>
                            <div className="text-sm space-y-1">
                              <div><span className="text-muted-foreground">From:</span> <span className="text-foreground">{withdrawData.from.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</span></div>
                              <div><span className="text-muted-foreground">To:</span> <span className="text-foreground">{getSelectedAccount() && `${getAccountTypeLabel(getSelectedAccount()!.type)} – ${getSelectedAccount()!.name} (${getPaymentMethodDisplay(getSelectedAccount()!)})`}</span></div>
                              <div><span className="text-muted-foreground">Amount:</span> <span className="text-foreground">${Number(withdrawData.amount).toLocaleString()}</span></div>
                              {withdrawData.settlement && (
                                <div><span className="text-muted-foreground">Settlement:</span> <span className="text-foreground">{settlements.find(s => s.id === withdrawData.settlement)?.name}</span></div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsWithdrawDialogOpen(false)}
                            className="text-foreground border-border hover:bg-muted"
                          >
                            Cancel
                          </Button>
                          <Button 
                            disabled={!withdrawData.from || !withdrawData.to || !withdrawData.amount}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Expense Reimbursement */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">Expense Reimbursement</h3>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Account Number</div>
                    <div className="text-sm text-foreground">76650000022368</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Routing Number (ABA)</div>
                    <div className="text-sm text-foreground">053101561</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold text-foreground">$0.00</div>
                  </div>
                  <Button size="sm" variant="secondary" disabled className="opacity-50">
                    $ WITHDRAW FUNDS
                  </Button>
                </div>

                {/* Lien Resolution */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">Lien Resolution</h3>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Account Number</div>
                    <div className="text-sm text-foreground">76650000022357</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Routing Number (ABA)</div>
                    <div className="text-sm text-foreground">053101561</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold text-foreground">$0.00</div>
                  </div>
                  <Button size="sm" variant="secondary" disabled className="opacity-50">
                    $ WITHDRAW FUNDS
                  </Button>
                </div>

                {/* Case Clearing */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">Case Clearing</h3>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                  </div>
                  <div className="text-muted-foreground text-center py-8">
                    No information about this account, or it has not been created yet.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unrestricted Accounts */}
      <Card className="mt-6 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Unrestricted Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Created ↑</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">ACH Account Type</TableHead>
                <TableHead className="text-muted-foreground">Account Number</TableHead>
                <TableHead className="text-muted-foreground">Routing Number</TableHead>
                <TableHead className="text-muted-foreground">Vendor Type</TableHead>
                <TableHead className="text-muted-foreground">Preferred Payment Method</TableHead>
                <TableHead className="text-muted-foreground">Account Status</TableHead>
                <TableHead className="text-muted-foreground">Verification Status</TableHead>
                <TableHead className="text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unrestrictedAccounts.map((account) => (
                <TableRow key={account.id} className="border-border">
                  <TableCell className="text-foreground">{account.created}</TableCell>
                  <TableCell className="text-foreground">{account.name}</TableCell>
                   <TableCell className="text-foreground">{getAccountTypeLabel(account.type)}</TableCell>
                   <TableCell className="text-foreground">{account.achAccountType}</TableCell>
                  <TableCell className="text-foreground">{account.accountNumber}</TableCell>
                  <TableCell className="text-foreground">{account.routingNumber}</TableCell>
                  <TableCell className="text-foreground">{account.vendorType}</TableCell>
                  <TableCell className="text-foreground">{account.preferredPaymentMethod}</TableCell>
                  <TableCell className="text-foreground">{account.accountStatus}</TableCell>
                  <TableCell className="text-foreground">{account.verificationStatus}</TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="text-xs"
                         onClick={() => {
                           setSelectedAccount(account);
                           setIsEditDialogOpen(true);
                         }}
                       >
                         ➜ MORE
                       </Button>
                       <Button variant="ghost" size="sm">
                         <Trash2 className="h-4 w-4" />
                         DELETE
                       </Button>
                     </div>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <Dialog open={isUnrestrictedDialogOpen} onOpenChange={setIsUnrestrictedDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  ADD UNRESTRICTED ACCOUNT
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-popover border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add Unrestricted Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <Separator className="bg-border" />

                   {/* Account Type and Vendor Type */}
                   <div className="grid grid-cols-1 gap-4">
                     <div className="grid grid-cols-2 gap-4 items-end">
                       <div className="space-y-2">
                         <Label htmlFor="accountType" className="text-foreground">Type <span className="text-destructive">*</span></Label>
                         <Select value={formData.type} onValueChange={(value) => handleFormChange("type", value)}>
                           <SelectTrigger className="bg-background border-border text-foreground">
                             <SelectValue placeholder="Select type" />
                           </SelectTrigger>
                           <SelectContent className="bg-popover border-border">
                             <SelectItem value="vendor">Vendor</SelectItem>
                             <SelectItem value="other">Other</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       
                       {formData.type === "vendor" && (
                         <div className="space-y-2">
                           <Label htmlFor="vendorType" className="text-foreground">Vendor Type <span className="text-destructive">*</span></Label>
                           <Select value={formData.vendorType} onValueChange={(value) => handleFormChange("vendorType", value)}>
                             <SelectTrigger className="bg-background border-border text-foreground">
                               <SelectValue placeholder="Select vendor type" />
                             </SelectTrigger>
                             <SelectContent className="bg-popover border-border">
                               <SelectItem value="expense-reimbursement">Expense Reimbursement</SelectItem>
                               <SelectItem value="lien-resolution">Lien Resolution</SelectItem>
                               <SelectItem value="service-provider">Service Provider</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                       )}
                     </div>
                   </div>

                  <Separator className="bg-border" />

                   {/* Preferred Payment Method and Related Fields */}
                   <div className="space-y-4">
                     <div className="space-y-2">
                       <Label className="text-foreground">Preferred Payment Method <span className="text-destructive">*</span></Label>
                       <RadioGroup value={formData.preferredPaymentMethod} onValueChange={(value) => handleFormChange("preferredPaymentMethod", value)}>
                         <div className="flex items-center space-x-2">
                           <RadioGroupItem value="ach" id="ach" />
                           <Label htmlFor="ach" className="text-foreground">ACH</Label>
                         </div>
                         <div className="flex items-center space-x-2">
                           <RadioGroupItem value="check" id="check" />
                           <Label htmlFor="check" className="text-foreground">Check</Label>
                         </div>
                       </RadioGroup>
                     </div>

                       <Accordion type="multiple" value={achAccordionOpen} onValueChange={setAchAccordionOpen} className="w-full">
                         {/* ACH Accordion */}
                         <AccordionItem value="ach">
                           <AccordionTrigger className="text-foreground">ACH</AccordionTrigger>
                          <AccordionContent>
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="status">Status</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="details" className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="achAccountType" className="text-foreground">
                                    Account Type {formData.preferredPaymentMethod === "ach" && <span className="text-destructive">*</span>}
                                  </Label>
                                  <Select value={formData.achAccountType} onValueChange={(value) => handleFormChange("achAccountType", value)}>
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                      <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                      <SelectItem value="savings">Savings</SelectItem>
                                      <SelectItem value="checking">Checking</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="accountNumber" className="text-foreground">
                                      Account Number {formData.preferredPaymentMethod === "ach" && <span className="text-destructive">*</span>}
                                    </Label>
                                    <Input
                                      id="accountNumber"
                                      value={formData.accountNumber}
                                      onChange={(e) => handleFormChange("accountNumber", e.target.value)}
                                      className="bg-background border-border text-foreground"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="routingNumber" className="text-foreground">
                                      Routing Number {formData.preferredPaymentMethod === "ach" && <span className="text-destructive">*</span>}
                                    </Label>
                                    <Input
                                      id="routingNumber"
                                      value={formData.routingNumber}
                                      onChange={(e) => handleFormChange("routingNumber", e.target.value)}
                                      className="bg-background border-border text-foreground"
                                    />
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="status" className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h4 className="font-medium text-foreground">Integration Details</h4>
                                    <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
                                      <div className="flex items-center justify-between">
                                        <span className="text-foreground font-medium">Provisioning</span>
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">COMPLETED</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <h4 className="font-medium text-foreground">External Account</h4>
                                    <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
                                      <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Account Status</span>
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">EWS Status</span>
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">OPEN</span>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-muted-foreground text-sm">Bank Name:</div>
                                        <div className="text-foreground">US BANK NA</div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-muted-foreground text-sm">Bank Routing Number:</div>
                                        <div className="text-foreground">{formData.routingNumber || "021000021"}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Check Mailing Address Accordion */}
                      </Accordion>
                      
                      <Accordion type="multiple" value={checkAccordionOpen} onValueChange={setCheckAccordionOpen} className="w-full">
                        <AccordionItem value="check">
                          <AccordionTrigger className="text-foreground">Check mailing address</AccordionTrigger>
                         <AccordionContent>
                           <div className="space-y-4 pt-4">
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                 <Label htmlFor="addressLine1" className="text-foreground">
                                   Address Line 1 {formData.preferredPaymentMethod === "check" && <span className="text-destructive">*</span>}
                                 </Label>
                                 <Input
                                   id="addressLine1"
                                   value={formData.addressLine1}
                                   onChange={(e) => handleFormChange("addressLine1", e.target.value)}
                                   className="bg-background border-border text-foreground"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label htmlFor="addressLine2" className="text-foreground">Address Line 2</Label>
                                 <Input
                                   id="addressLine2"
                                   value={formData.addressLine2}
                                   onChange={(e) => handleFormChange("addressLine2", e.target.value)}
                                   className="bg-background border-border text-foreground"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label htmlFor="city" className="text-foreground">
                                   City {formData.preferredPaymentMethod === "check" && <span className="text-destructive">*</span>}
                                 </Label>
                                 <Input
                                   id="city"
                                   value={formData.city}
                                   onChange={(e) => handleFormChange("city", e.target.value)}
                                   className="bg-background border-border text-foreground"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label htmlFor="state" className="text-foreground">
                                   State {formData.preferredPaymentMethod === "check" && <span className="text-destructive">*</span>}
                                 </Label>
                                 <Input
                                   id="state"
                                   value={formData.state}
                                   onChange={(e) => handleFormChange("state", e.target.value)}
                                   className="bg-background border-border text-foreground"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label htmlFor="zipCode" className="text-foreground">
                                   ZIP Code {formData.preferredPaymentMethod === "check" && <span className="text-destructive">*</span>}
                                 </Label>
                                 <Input
                                   id="zipCode"
                                   value={formData.zipCode}
                                   onChange={(e) => handleFormChange("zipCode", e.target.value)}
                                   className="bg-background border-border text-foreground"
                                 />
                               </div>
                             </div>
                           </div>
                         </AccordionContent>
                       </AccordionItem>
                     </Accordion>
                   </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={() => setIsUnrestrictedDialogOpen(false)} className="text-foreground">
                      CANCEL
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!isFormValid()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      SAVE
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Edit Account Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-4xl bg-popover border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Unrestricted Account</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="edit">EDIT</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit" className="space-y-6 mt-6">
                    {/* Edit Tab - Same fields as Add dialog but name enabled, rest disabled */}
                    <div className="space-y-2">
                      <Label htmlFor="editName" className="text-foreground">Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="editName"
                        defaultValue={selectedAccount?.name || ""}
                        className="bg-background border-border text-foreground"
                      />
                    </div>

                    <Separator className="bg-border" />

                     <div className="grid grid-cols-1 gap-4">
                       <div className="grid grid-cols-2 gap-4 items-end">
                         <div className="space-y-2">
                           <Label htmlFor="editAccountType" className="text-foreground">Type <span className="text-destructive">*</span></Label>
                           <Select value={selectedAccount?.type || ""} disabled>
                             <SelectTrigger className="bg-muted border-border text-muted-foreground">
                               <SelectValue placeholder="Select type" />
                             </SelectTrigger>
                             <SelectContent className="bg-popover border-border">
                               <SelectItem value="vendor">Vendor</SelectItem>
                               <SelectItem value="other">Other</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                         
                         {selectedAccount?.type === "vendor" && (
                           <div className="space-y-2">
                             <Label htmlFor="editVendorType" className="text-foreground">Vendor Type <span className="text-destructive">*</span></Label>
                             <Select value={selectedAccount?.vendorType || ""} disabled>
                               <SelectTrigger className="bg-muted border-border text-muted-foreground">
                                 <SelectValue placeholder="Select vendor type" />
                               </SelectTrigger>
                               <SelectContent className="bg-popover border-border">
                                 <SelectItem value="expense-reimbursement">Expense Reimbursement</SelectItem>
                                 <SelectItem value="lien-resolution">Lien Resolution</SelectItem>
                                 <SelectItem value="service-provider">Service Provider</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                         )}
                       </div>
                     </div>

                    <Separator className="bg-border" />

                     <div className="space-y-4">
                       <div className="space-y-2">
                         <Label className="text-foreground">Preferred Payment Method <span className="text-destructive">*</span></Label>
                         <RadioGroup value={selectedAccount?.preferredPaymentMethod || "ach"} disabled>
                           <div className="flex items-center space-x-2">
                             <RadioGroupItem value="ach" id="editAch" disabled />
                             <Label htmlFor="editAch" className="text-muted-foreground">ACH</Label>
                           </div>
                           <div className="flex items-center space-x-2">
                             <RadioGroupItem value="check" id="editCheck" disabled />
                             <Label htmlFor="editCheck" className="text-muted-foreground">Check</Label>
                           </div>
                         </RadioGroup>
                       </div>

                         <Accordion type="multiple" value={editAchAccordionOpen} onValueChange={setEditAchAccordionOpen} className="w-full">
                           {/* ACH Accordion */}
                           <AccordionItem value="ach">
                             <AccordionTrigger className="text-foreground">ACH</AccordionTrigger>
                            <AccordionContent>
                              <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="status">Status</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="editAchAccountType" className="text-foreground">Account Type</Label>
                                    <Select value={selectedAccount?.achAccountType || ""} disabled>
                                      <SelectTrigger className="bg-muted border-border text-muted-foreground">
                                        <SelectValue placeholder="Select account type" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-popover border-border">
                                        <SelectItem value="savings">Savings</SelectItem>
                                        <SelectItem value="checking">Checking</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="editAccountNumber" className="text-foreground">Account Number</Label>
                                      <Input
                                        id="editAccountNumber"
                                        value={selectedAccount?.accountNumber || ""}
                                        disabled
                                        className="bg-muted border-border text-muted-foreground"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="editRoutingNumber" className="text-foreground">Routing Number</Label>
                                      <Input
                                        id="editRoutingNumber"
                                        value={selectedAccount?.routingNumber || ""}
                                        disabled
                                        className="bg-muted border-border text-muted-foreground"
                                      />
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="status" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <h4 className="font-medium text-foreground">Integration Details</h4>
                                      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-foreground font-medium">Provisioning</span>
                                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">COMPLETED</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <h4 className="font-medium text-foreground">External Account</h4>
                                      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-muted-foreground">Account Status</span>
                                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">ACTIVE</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                          <span className="text-muted-foreground">EWS Status</span>
                                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">OPEN</span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <div className="text-muted-foreground text-sm">Bank Name:</div>
                                          <div className="text-foreground">US BANK NA</div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <div className="text-muted-foreground text-sm">Bank Routing Number:</div>
                                          <div className="text-foreground">{selectedAccount?.routingNumber || "021000021"}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Check Mailing Address Accordion */}
                        </Accordion>
                        
                        <Accordion type="multiple" value={editCheckAccordionOpen} onValueChange={setEditCheckAccordionOpen} className="w-full">
                          <AccordionItem value="check">
                            <AccordionTrigger className="text-foreground">Check mailing address</AccordionTrigger>
                           <AccordionContent>
                             <div className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="editAddressLine1" className="text-foreground">Address Line 1</Label>
                                    <Input
                                      id="editAddressLine1"
                                      value={selectedAccount?.addressLine1 || ""}
                                      disabled
                                      className="bg-muted border-border text-muted-foreground"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editAddressLine2" className="text-foreground">Address Line 2</Label>
                                    <Input
                                      id="editAddressLine2"
                                      value={selectedAccount?.addressLine2 || ""}
                                      disabled
                                      className="bg-muted border-border text-muted-foreground"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editCity" className="text-foreground">City</Label>
                                    <Input
                                      id="editCity"
                                      value={selectedAccount?.city || ""}
                                      disabled
                                      className="bg-muted border-border text-muted-foreground"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editState" className="text-foreground">State</Label>
                                    <Input
                                      id="editState"
                                      value={selectedAccount?.state || ""}
                                      disabled
                                      className="bg-muted border-border text-muted-foreground"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="editZipCode" className="text-foreground">ZIP Code</Label>
                                    <Input
                                      id="editZipCode"
                                      value={selectedAccount?.zipCode || ""}
                                      disabled
                                      className="bg-muted border-border text-muted-foreground"
                                    />
                                  </div>
                                </div>
                             </div>
                           </AccordionContent>
                         </AccordionItem>
                       </Accordion>
                     </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="text-foreground">
                        CANCEL
                      </Button>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        SAVE
                      </Button>
                    </div>
                  </TabsContent>
                  
                </Tabs>
              </DialogContent>
            </Dialog>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select defaultValue="20">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">1-1 of 1</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>←</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm" disabled>→</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Accounts */}
      <Card className="mt-6 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Trust Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Created ↑</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Account Type</TableHead>
                <TableHead className="text-muted-foreground">Account Number</TableHead>
                <TableHead className="text-muted-foreground">Routing Number</TableHead>
                <TableHead className="text-muted-foreground">Account Status</TableHead>
                <TableHead className="text-muted-foreground">Verification Status</TableHead>
                <TableHead className="text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell className="text-foreground">3/12/2025</TableCell>
                <TableCell className="text-foreground">IOLTA 2025</TableCell>
                <TableCell className="text-foreground">Checking</TableCell>
                <TableCell className="text-foreground">1122334455</TableCell>
                <TableCell className="text-foreground">021000021</TableCell>
                <TableCell className="text-foreground">Active</TableCell>
                <TableCell className="text-foreground">Verified</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      ➜ MORE
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                      DELETE
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              ADD TRUST ACCOUNT
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select defaultValue="20">
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">1-1 of 1</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>←</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm" disabled>→</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}