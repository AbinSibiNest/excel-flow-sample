import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Vendor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: "",
    tinEid: "",
    bankAccount: "",
    preferredPayment: "",
    vendorType: "",
    achEnabled: false,
    checkEnabled: false
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Vendor data:", formData);
    // Handle form submission
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
        {['HOME', 'USERS', 'BANKING', 'VENDOR', 'CASE TYPES', 'QUESTIONNAIRES', 'SNIPPETS', 'CASES', 'CLIENTS', 'DEFENDANTS', 'DOCUMENT REQUESTS', 'SIGNATURE REQUESTS', 'DATA REQUESTS', 'DEDUCTIONS', 'SETTLEMENTS'].map((tab) => (
          <button
            key={tab}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === 'VENDOR' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Vendor Creation Form */}
      <div className="max-w-2xl">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Create New Vendor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground">Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter vendor address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="bg-background border-border text-foreground"
                rows={3}
              />
            </div>

            {/* TIN/EID */}
            <div className="space-y-2">
              <Label htmlFor="tinEid" className="text-foreground">TIN/EID *</Label>
              <Input
                id="tinEid"
                placeholder="Enter TIN/EID"
                value={formData.tinEid}
                onChange={(e) => handleInputChange("tinEid", e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* Bank Account */}
            <div className="space-y-2">
              <Label htmlFor="bankAccount" className="text-foreground">Bank Account (Link from Unrestricted Accounts) *</Label>
              <Select value={formData.bankAccount} onValueChange={(value) => handleInputChange("bankAccount", value)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="operating">Operating Account - 8771615402</SelectItem>
                  <SelectItem value="client-trust">Client Trust Account - 8771615403</SelectItem>
                  <SelectItem value="expense">Expense Account - 8771615404</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Payment Option */}
            <div className="space-y-3">
              <Label className="text-foreground">Preferred Payment Option *</Label>
              <RadioGroup value={formData.preferredPayment} onValueChange={(value) => handleInputChange("preferredPayment", value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ach" id="ach" />
                    <Label htmlFor="ach" className="text-foreground">ACH</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="check" id="check" />
                    <Label htmlFor="check" className="text-foreground">Check</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Type of Vendor */}
            <div className="space-y-3">
              <Label className="text-foreground">Type of Vendor *</Label>
              <RadioGroup value={formData.vendorType} onValueChange={(value) => handleInputChange("vendorType", value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lien-holder" id="lien-holder" />
                    <Label htmlFor="lien-holder" className="text-foreground">Lien holder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="service-provider" id="service-provider" />
                    <Label htmlFor="service-provider" className="text-foreground">Service provider</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Method Checkboxes */}
            <div className="space-y-3">
              <Label className="text-foreground">Payment Methods</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ach-enabled" 
                    checked={formData.achEnabled}
                    onCheckedChange={(checked) => handleInputChange("achEnabled", !!checked)}
                  />
                  <Label htmlFor="ach-enabled" className="text-foreground">Enable ACH payments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="check-enabled" 
                    checked={formData.checkEnabled}
                    onCheckedChange={(checked) => handleInputChange("checkEnabled", !!checked)}
                  />
                  <Label htmlFor="check-enabled" className="text-foreground">Enable Check payments</Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!formData.address || !formData.tinEid || !formData.bankAccount || !formData.preferredPayment || !formData.vendorType}
              >
                Create Vendor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}