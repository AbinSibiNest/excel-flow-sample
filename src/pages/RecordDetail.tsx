import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

interface RecordData {
  id: number;
  referenceId: string;
  firmId: string;
  trustAccountId: string;
  grossSettlementAmount: number;
  fullName: string;
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  settledAmount: number;
  lienAmount:number;
  advanceAmount:number;
}

const RecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recordData, setRecordData] = useState<RecordData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Mock data - would come from API in real implementation
    const mockData: RecordData = {
      id: parseInt(id || "1"),
      referenceId: `REF-00${id}`,
      firmId: "FIRM-001",
      trustAccountId: "TRUST-001",
      grossSettlementAmount: 25000,
      fullName: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0101",
      birthdate: "1985-03-15",
      address: "123 Main St, New York, NY 10001",
      settledAmount: 15000,
      lienAmount:7500,
      advanceAmount:2500,
    };
    setRecordData(mockData);
  }, [id]);

  const handleInputChange = (field: keyof RecordData, value: any) => {
    if (!recordData) return;
    
    setRecordData(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  };

  

 

  const handleSave = () => {
    // Here you would save the data to the API
    toast({
      title: "Record Updated",
      description: "The record has been successfully updated.",
    });
    
    // Navigate back to pending migration with the record marked as processed
    navigate("/firm/firm-001#pending&updated=" + id);
  };

  const handleBack = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate("/firm/firm-001#pending");
  };

  if (!recordData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-300 hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pending Migration
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Record Details</h1>
            <p className="text-gray-400 mt-1">Reference ID: {recordData.referenceId}</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Confirm & Save
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="referenceId" className="text-gray-300">Reference ID</Label>
              <Input
                id="referenceId"
                value={recordData.referenceId}
                onChange={(e) => handleInputChange('referenceId', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="firmId" className="text-gray-300">Firm ID</Label>
              <Input
                id="firmId"
                value={recordData.firmId}
                onChange={(e) => handleInputChange('firmId', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="trustAccountId" className="text-gray-300">Trust Account ID</Label>
              <Input
                id="trustAccountId"
                value={recordData.trustAccountId}
                onChange={(e) => handleInputChange('trustAccountId', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Defendants Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Settlement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="grossSettlementAmount" className="text-gray-300">Gross Settlement Amount</Label>
              <Input
                id="grossSettlementAmount"
                type="number"
                value={recordData.grossSettlementAmount}
                onChange={(e) => handleInputChange('grossSettlementAmount', parseFloat(e.target.value))}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="settledAmount" className="text-gray-300">Settled Amount</Label>
              <Input
                id="settledAmount"
                type="number"
                value={recordData.settledAmount}
                onChange={(e) => handleInputChange('settledAmount', parseFloat(e.target.value))}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Client Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                value={recordData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={recordData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input
                id="phone"
                value={recordData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="birthdate" className="text-gray-300">Birth Date</Label>
              <Input
                id="birthdate"
                type="date"
                value={recordData.birthdate}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-gray-300">Address</Label>
              <Textarea
                id="address"
                value={recordData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settlement Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Deduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
           <div>
              <Label htmlFor="lien" className="text-gray-300">Lien</Label>
              <Input
                id="lienAmount"
                type="number"
                value={recordData.lienAmount}
                onChange={(e) => handleInputChange('lienAmount', parseFloat(e.target.value))}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div> 
            <div>
              <Label htmlFor="advance" className="text-gray-300">Advance</Label>
              <Input
                id="advanceAmount"
                type="number"
                value={recordData.advanceAmount}
                onChange={(e) => handleInputChange('advanceAmount', parseFloat(e.target.value))}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div> 
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordDetail;