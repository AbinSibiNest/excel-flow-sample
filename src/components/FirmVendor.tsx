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
import { useState, useEffect } from "react";

export default function FirmVendor() {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Create Vendor</h2>
        <p className="text-gray-400">Add a new vendor for this firm</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="space-y-4 p-6">
          <div>
            <Label htmlFor="name" className="text-gray-200">Vendor Name *</Label>
            <Input
              id="name"
              placeholder="Enter vendor name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-gray-200">Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter vendor address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="tinEid" className="text-gray-200">TIN/EID *</Label>
            <Input
              id="tinEid"
              placeholder="Enter unique TIN/EID"
              value={formData.tinEid}
              onChange={(e) => handleInputChange("tinEid", e.target.value)}
              className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="bankAccount" className="text-gray-200">Bank Account *</Label>
            <Select onValueChange={(value) => handleInputChange("bankAccount", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select bank account" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()} className="text-white">
                    {account.name} - {account.achAccountType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="preferredPayment" className="text-gray-200">Preferred Payment Option *</Label>
            <Select onValueChange={(value) => handleInputChange("preferredPayment", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select payment option" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="ach" className="text-white">ACH</SelectItem>
                <SelectItem value="check" className="text-white">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vendorType" className="text-gray-200">Type of Vendor *</Label>
            <Select onValueChange={(value) => handleInputChange("vendorType", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select vendor type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="lienholder" className="text-white">Lien holder</SelectItem>
                <SelectItem value="serviceprovider" className="text-white">Service provider</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div>
        <Button 
          onClick={handleSave}
          className="bg-cyan-600 text-white hover:bg-cyan-700"
        >
          📁 SAVE
        </Button>
      </div>
    </div>
  );
}