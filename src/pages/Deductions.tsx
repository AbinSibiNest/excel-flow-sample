import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Deductions() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    case: "",
    defendant: "",
    assigned: false,
    amount: "",
    type: "",
    vendorAccount: "",
    description: ""
  });

  // Mock data - in real app this would come from API
  const [vendorAccounts, setVendorAccounts] = useState<Array<{
    id: number;
    name: string;
    achAccountType: string;
    type: string;
  }>>([]);

  // Load vendor accounts from localStorage (simulating API call)
  useEffect(() => {
    const savedAccounts = localStorage.getItem('unrestrictedAccounts');
    if (savedAccounts) {
      const accounts = JSON.parse(savedAccounts);
      const vendors = accounts.filter((account: any) => account.type.toLowerCase() === 'vendor');
      setVendorAccounts(vendors);
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving deduction:", formData);
    // Here you would typically save to API
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
          <h1 className="text-xl font-semibold">Create Deduction</h1>
        </div>
      </div>

      <div className="p-6 max-w-4xl">
        <Card>
          <CardContent className="space-y-4 p-6">
            <Button 
              variant="outline" 
              className="w-full bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
            >
              🔍 FIND CASE
            </Button>
            
            <div>
              <Label htmlFor="defendant">Defendant</Label>
              <Select onValueChange={(value) => handleInputChange("defendant", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select defendant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defendant1">John Doe</SelectItem>
                  <SelectItem value="defendant2">Jane Smith</SelectItem>
                  <SelectItem value="defendant3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="assigned"
                checked={formData.assigned}
                onCheckedChange={(checked) => handleInputChange("assigned", checked)}
              />
              <Label htmlFor="assigned">Assigned</Label>
            </div>

            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Payee Type *</Label>
              <Select onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advance">Advance</SelectItem>
                  <SelectItem value="lien">Lien</SelectItem>
                  <SelectItem value="serviceProvider">Service Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vendorAccount">Vendor Account</Label>
              <Select onValueChange={(value) => handleInputChange("vendorAccount", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor account" />
                </SelectTrigger>
                <SelectContent>
                  {vendorAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name} - {account.achAccountType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter line item description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6">
          <Button 
            onClick={handleSave}
            className="bg-muted text-muted-foreground hover:bg-muted/80"
          >
            📁 SAVE
          </Button>
        </div>
      </div>
    </div>
  );
}