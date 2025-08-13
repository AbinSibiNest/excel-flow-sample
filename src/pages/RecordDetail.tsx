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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordData {
  id: number;
  referenceId: string;
  firmName: string;
  trustAccountNumber: string;
  grossSettlementAmount: number;
  clientFullName: string;
  clientEmail: string;
  clientPhone: string;
  clientBirthdate: string;
  clientAddressLine1: string;
  clientAddressLine2: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  settledAmount: number;
  lienAmount: number;
  advanceAmount: number;
  defendantName: string;
  defendantFirm: string;
  firms: Array<{
    name: string;
    role: string;
  }>;
}

interface ValidationErrors {
  [key: string]: string;
}

const RecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recordData, setRecordData] = useState<RecordData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    // Mock data - would come from Excel/API in real implementation
    const mockData: RecordData = {
      id: parseInt(id || "1"),
      referenceId: `REF-00${id}`,
      firmName: "Anderson & Associates",
      trustAccountNumber: "TA-001234567",
      grossSettlementAmount: 25000,
      clientFullName: "John Smith",
      clientEmail: "john.smith@email.com",
      clientPhone: "+1-555-0101",
      clientBirthdate: "1985-03-15",
      clientAddressLine1: "123 Main St",
      clientAddressLine2: "Apt 4B",
      clientCity: "New York",
      clientState: "NY",
      clientZip: "10001",
      settledAmount: 15000,
      lienAmount: 7500,
      advanceAmount: 2500,
      defendantName: "XYZ Corporation",
      defendantFirm: "Corporate Legal LLC",
      firms: [
        { name: "Top Dog", role: "Referral" },
        { name: "VLV Law", role: "Co-Counsel" }
      ],
    };
    setRecordData(mockData);
    validateRecord(mockData);
  }, [id]);

  const validateRecord = (data: RecordData) => {
    const newErrors: ValidationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.clientEmail)) {
      newErrors.clientEmail = "Please enter a valid email address";
    }

    // Phone validation (basic format)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(data.clientPhone)) {
      newErrors.clientPhone = "Please enter a valid phone number";
    }

    // Required field validations
    if (!data.clientFullName.trim()) {
      newErrors.clientFullName = "Client name is required";
    }

    if (!data.referenceId.trim()) {
      newErrors.referenceId = "Reference ID is required";
    }

    if (!data.defendantName.trim()) {
      newErrors.defendantName = "Defendant name is required";
    }

    // Amount validations
    if (data.grossSettlementAmount <= 0) {
      newErrors.grossSettlementAmount = "Gross settlement amount must be greater than 0";
    }

    if (data.settledAmount <= 0) {
      newErrors.settledAmount = "Settled amount must be greater than 0";
    }

    if (data.settledAmount > data.grossSettlementAmount) {
      newErrors.settledAmount = "Settled amount cannot exceed gross settlement amount";
    }

    // Address validations
    if (!data.clientAddressLine1.trim()) {
      newErrors.clientAddressLine1 = "Address line 1 is required";
    }

    if (!data.clientCity.trim()) {
      newErrors.clientCity = "City is required";
    }

    if (!data.clientState.trim()) {
      newErrors.clientState = "State is required";
    }

    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(data.clientZip)) {
      newErrors.clientZip = "Please enter a valid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RecordData, value: any) => {
    if (!recordData) return;
    
    const updatedData = { ...recordData, [field]: value };
    setRecordData(updatedData);
    setHasChanges(true);
    validateRecord(updatedData);
  };

  

 

  const handleSave = () => {
    if (!recordData || !validateRecord(recordData)) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before saving.",
        variant: "destructive",
      });
      return;
    }

    // Here you would save the data to the API
    toast({
      title: "Record Updated",
      description: "The record has been successfully updated.",
    });
    
    // Navigate back to pending migration with the record marked as processed
    navigate("/firm/firm-001#pending&updated=" + id);
  };

  const handleApprove = () => {
    if (!recordData || !validateRecord(recordData)) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before approving.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Record Approved",
      description: "The record has been approved for migration.",
    });
    navigate("/firm/firm-001#pending");
  };

  const handleMigrate = () => {
    if (!recordData || !validateRecord(recordData)) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before migrating.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Migration Started",
      description: "The record migration has been initiated.",
    });
    navigate("/firm/firm-001#pending");
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

  const hasErrors = Object.keys(errors).length > 0;

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
            {hasErrors && (
              <div className="flex items-center mt-2 text-red-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Please fix validation errors</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={handleApprove}
            disabled={hasErrors}
            className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600"
          >
            Approve
          </Button>
          <Button
            onClick={handleMigrate}
            disabled={hasErrors}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600"
          >
            Migrate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information - First Priority */}
        <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-100">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
              <Input
                id="fullName"
                value={recordData.clientFullName}
                onChange={(e) => handleInputChange('clientFullName', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.clientFullName && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.clientFullName && (
                <p className="text-red-400 text-sm mt-1">{errors.clientFullName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email *</Label>
              <Input
                id="email"
                type="email"
                value={recordData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.clientEmail && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.clientEmail && (
                <p className="text-red-400 text-sm mt-1">{errors.clientEmail}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone *</Label>
              <Input
                id="phone"
                value={recordData.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.clientPhone && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.clientPhone && (
                <p className="text-red-400 text-sm mt-1">{errors.clientPhone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="birthdate" className="text-gray-300">Birth Date</Label>
              <Input
                id="birthdate"
                type="date"
                value={recordData.clientBirthdate}
                onChange={(e) => handleInputChange('clientBirthdate', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="addressLine1" className="text-gray-300">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                value={recordData.clientAddressLine1}
                onChange={(e) => handleInputChange('clientAddressLine1', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.clientAddressLine1 && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.clientAddressLine1 && (
                <p className="text-red-400 text-sm mt-1">{errors.clientAddressLine1}</p>
              )}
            </div>
            <div>
              <Label htmlFor="addressLine2" className="text-gray-300">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={recordData.clientAddressLine2}
                onChange={(e) => handleInputChange('clientAddressLine2', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-gray-300">City *</Label>
              <Input
                id="city"
                value={recordData.clientCity}
                onChange={(e) => handleInputChange('clientCity', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.clientCity && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.clientCity && (
                <p className="text-red-400 text-sm mt-1">{errors.clientCity}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state" className="text-gray-300">State *</Label>
              <Input
                id="state"
                value={recordData.clientState}
                onChange={(e) => handleInputChange('clientState', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.clientState && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.clientState && (
                <p className="text-red-400 text-sm mt-1">{errors.clientState}</p>
              )}
            </div>
            <div>
              <Label htmlFor="zip" className="text-gray-300">ZIP Code *</Label>
              <Input
                id="zip"
                value={recordData.clientZip}
                onChange={(e) => handleInputChange('clientZip', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.clientZip && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.clientZip && (
                <p className="text-red-400 text-sm mt-1">{errors.clientZip}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settlement Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Settlement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="grossSettlementAmount" className="text-gray-300">Gross Settlement Amount *</Label>
              <Input
                id="grossSettlementAmount"
                type="number"
                value={recordData.grossSettlementAmount}
                onChange={(e) => handleInputChange('grossSettlementAmount', parseFloat(e.target.value) || 0)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.grossSettlementAmount && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.grossSettlementAmount && (
                <p className="text-red-400 text-sm mt-1">{errors.grossSettlementAmount}</p>
              )}
            </div>
            <div>
              <Label htmlFor="settledAmount" className="text-gray-300">Settled Amount *</Label>
              <Input
                id="settledAmount"
                type="number"
                value={recordData.settledAmount}
                onChange={(e) => handleInputChange('settledAmount', parseFloat(e.target.value) || 0)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.settledAmount && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.settledAmount && (
                <p className="text-red-400 text-sm mt-1">{errors.settledAmount}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lien" className="text-gray-300">Lien</Label>
              <Input
                id="lienAmount"
                type="number"
                value={recordData.lienAmount}
                onChange={(e) => handleInputChange('lienAmount', parseFloat(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div> 
            <div>
              <Label htmlFor="advance" className="text-gray-300">Advance</Label>
              <Input
                id="advanceAmount"
                type="number"
                value={recordData.advanceAmount}
                onChange={(e) => handleInputChange('advanceAmount', parseFloat(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div> 
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="referenceId" className="text-gray-300">Reference ID *</Label>
              <Input
                id="referenceId"
                value={recordData.referenceId}
                onChange={(e) => handleInputChange('referenceId', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.referenceId && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.referenceId && (
                <p className="text-red-400 text-sm mt-1">{errors.referenceId}</p>
              )}
            </div>
            <div>
              <Label htmlFor="firmName" className="text-gray-300">Firm Name</Label>
              <Input
                id="firmName"
                value={recordData.firmName}
                onChange={(e) => handleInputChange('firmName', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="trustAccountNumber" className="text-gray-300">Trust Account Number</Label>
              <Input
                id="trustAccountNumber"
                value={recordData.trustAccountNumber}
                onChange={(e) => handleInputChange('trustAccountNumber', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Defendant Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Defendant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="defendantName" className="text-gray-300">Defendant Name *</Label>
              <Input
                id="defendantName"
                value={recordData.defendantName}
                onChange={(e) => handleInputChange('defendantName', e.target.value)}
                className={cn(
                  "bg-gray-800 border-gray-700 text-gray-100",
                  errors.defendantName && "border-red-500 bg-red-50/10"
                )}
              />
              {errors.defendantName && (
                <p className="text-red-400 text-sm mt-1">{errors.defendantName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="defendantFirm" className="text-gray-300">Defendant Firm</Label>
              <Input
                id="defendantFirm"
                value={recordData.defendantFirm}
                onChange={(e) => handleInputChange('defendantFirm', e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Firms Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100">Associated Firms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recordData.firms.map((firm, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-lg">
                <p className="text-gray-100 font-medium">
                  {firm.name} - {firm.role}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordDetail;