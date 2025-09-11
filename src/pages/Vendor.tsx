import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Vendor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    tinEid: "",
    bankAccount: "",
    preferredPayment: "",
    vendorType: ""
  });

  // Mock data for bank accounts from unrestricted accounts
  const [bankAccounts, setBankAccounts] = useState<Array<{
    id: number;
    name: string;
    achAccountType: string;
  }>>([]);

  // Load bank accounts from localStorage (simulating API call)
  useEffect(() => {
    const savedAccounts = localStorage.getItem('unrestrictedAccounts');
    if (savedAccounts) {
      const accounts = JSON.parse(savedAccounts);
      setBankAccounts(accounts);
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving vendor:", formData);
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
          <h1 className="text-xl font-semibold">Create Vendor</h1>
        </div>
      </div>

      <div className="p-6 max-w-4xl">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                placeholder="Enter vendor name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter vendor address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tinEid">TIN/EID *</Label>
              <Input
                id="tinEid"
                placeholder="Enter unique TIN/EID"
                value={formData.tinEid}
                onChange={(e) => handleInputChange("tinEid", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bankAccount">Bank Account *</Label>
              <Select onValueChange={(value) => handleInputChange("bankAccount", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name} - {account.achAccountType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preferredPayment">Preferred Payment Option *</Label>
              <Select onValueChange={(value) => handleInputChange("preferredPayment", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ach">ACH</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vendorType">Type of Vendor *</Label>
              <Select onValueChange={(value) => handleInputChange("vendorType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lienholder">Lien holder</SelectItem>
                  <SelectItem value="serviceprovider">Service provider</SelectItem>
                </SelectContent>
              </Select>
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