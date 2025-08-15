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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, AlertCircle, Eye, EyeOff } from "lucide-react";
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
  clientSSN: string;
  clientAddressLine1: string;
  clientAddressLine2: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  settledAmount: number;
  lienAmount: number;
  advanceAmount: number;
  defendant: string;
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
  const [showDOB, setShowDOB] = useState(false);
  const [showSSN, setShowSSN] = useState(false);

  useEffect(() => {
    // Mock data with different examples based on ID
    const hasErrors = id === "1";
    
    const mockData: RecordData = {
      id: parseInt(id || "1"),
      referenceId: `REF-00${id}`,
      firmName: "Anderson & Associates",
      trustAccountNumber: "TA-001234567",
      grossSettlementAmount: 25000,
      clientFullName: "John Smith",
      clientEmail: "john.smith@email.com",
      clientPhone: hasErrors ? "555-INVALID" : "+1-555-0101", // Error example
      clientBirthdate: "1985-03-15",
      clientSSN: hasErrors ? "123-45-678" : "123-45-6789", // Error example - missing digit
      clientAddressLine1: "123 Main St",
      clientAddressLine2: "Apt 4B",
      clientCity: "New York",
      clientState: "NY",
      clientZip: "10001",
      settledAmount: 15000,
      lienAmount: 7500,
      advanceAmount: 2500,
      defendant: "XYZ Corporation",
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

    // Phone validation (proper format)
    const phoneRegex = /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    if (!phoneRegex.test(data.clientPhone)) {
      newErrors.clientPhone = "Please enter a valid phone number (e.g., +1-555-0101)";
    }

    // SSN validation (must be 9 digits)
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    if (!ssnRegex.test(data.clientSSN)) {
      newErrors.clientSSN = "SSN must be in format XXX-XX-XXXX with 9 digits";
    }

    // Required field validations
    if (!data.clientFullName.trim()) {
      newErrors.clientFullName = "Client name is required";
    }

    if (!data.referenceId.trim()) {
      newErrors.referenceId = "Reference ID is required";
    }

    if (!data.defendant.trim()) {
      newErrors.defendant = "Defendant is required";
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

    toast({
      title: "Record Updated",
      description: "The record has been successfully updated.",
    });
    
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

  const maskSSN = (ssn: string) => {
    if (!showSSN) {
      return "***-**-****";
    }
    return ssn;
  };

  const maskDOB = (dob: string) => {
    if (!showDOB) {
      return "****-**-**";
    }
    return dob;
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
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pending Migration
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Record Details</h1>
            <p className="text-muted-foreground mt-1">Reference ID: {recordData.referenceId}</p>
            {hasErrors && (
              <div className="flex items-center mt-2 text-destructive">
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={handleApprove}
            disabled={hasErrors}
            variant="approve"
          >
            Approve
          </Button>
          <Button
            onClick={handleMigrate}
            disabled={hasErrors}
            variant="migrate"
          >
            Migrate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Details - First */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="referenceId" className="text-muted-foreground">Reference ID *</Label>
              <Input
                id="referenceId"
                value={recordData.referenceId}
                onChange={(e) => handleInputChange('referenceId', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.referenceId && "border-destructive bg-destructive/10"
                )}
              />
              {errors.referenceId && (
                <p className="text-destructive text-sm mt-1">{errors.referenceId}</p>
              )}
            </div>
            <div>
              <Label htmlFor="firmName" className="text-muted-foreground">Firm Name</Label>
              <Input
                id="firmName"
                value={recordData.firmName}
                onChange={(e) => handleInputChange('firmName', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="trustAccountNumber" className="text-muted-foreground">Trust Account Number</Label>
              <Input
                id="trustAccountNumber"
                value={recordData.trustAccountNumber}
                onChange={(e) => handleInputChange('trustAccountNumber', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="defendant" className="text-muted-foreground">Defendant *</Label>
              <Input
                id="defendant"
                value={recordData.defendant}
                onChange={(e) => handleInputChange('defendant', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.defendant && "border-destructive bg-destructive/10"
                )}
              />
              {errors.defendant && (
                <p className="text-destructive text-sm mt-1">{errors.defendant}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Client Information - Second */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="text-muted-foreground">Full Name *</Label>
              <Input
                id="fullName"
                value={recordData.clientFullName}
                onChange={(e) => handleInputChange('clientFullName', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.clientFullName && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientFullName && (
                <p className="text-destructive text-sm mt-1">{errors.clientFullName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-muted-foreground">Email *</Label>
              <Input
                id="email"
                type="email"
                value={recordData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.clientEmail && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientEmail && (
                <p className="text-destructive text-sm mt-1">{errors.clientEmail}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-muted-foreground">Phone *</Label>
              <Input
                id="phone"
                value={recordData.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.clientPhone && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientPhone && (
                <p className="text-destructive text-sm mt-1">{errors.clientPhone}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="birthdate" className="text-muted-foreground">Birth Date</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDOB(!showDOB)}
                  className="h-6 w-6 p-0"
                >
                  {showDOB ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <Input
                id="birthdate"
                type={showDOB ? "date" : "text"}
                value={showDOB ? recordData.clientBirthdate : maskDOB(recordData.clientBirthdate)}
                onChange={(e) => handleInputChange('clientBirthdate', e.target.value)}
                className="bg-input border-border text-foreground"
                readOnly={!showDOB}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ssn" className="text-muted-foreground">Social Security Number *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSSN(!showSSN)}
                  className="h-6 w-6 p-0"
                >
                  {showSSN ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <Input
                id="ssn"
                value={showSSN ? recordData.clientSSN : maskSSN(recordData.clientSSN)}
                onChange={(e) => handleInputChange('clientSSN', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.clientSSN && "border-destructive bg-destructive/10"
                )}
                readOnly={!showSSN}
                placeholder="XXX-XX-XXXX"
              />
              {errors.clientSSN && (
                <p className="text-destructive text-sm mt-1">{errors.clientSSN}</p>
              )}
            </div>
            <div>
              <Label htmlFor="addressLine1" className="text-muted-foreground">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                value={recordData.clientAddressLine1}
                onChange={(e) => handleInputChange('clientAddressLine1', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.clientAddressLine1 && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientAddressLine1 && (
                <p className="text-destructive text-sm mt-1">{errors.clientAddressLine1}</p>
              )}
            </div>
            <div>
              <Label htmlFor="addressLine2" className="text-muted-foreground">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={recordData.clientAddressLine2}
                onChange={(e) => handleInputChange('clientAddressLine2', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-muted-foreground">City *</Label>
              <Input
                id="city"
                value={recordData.clientCity}
                onChange={(e) => handleInputChange('clientCity', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.clientCity && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientCity && (
                <p className="text-destructive text-sm mt-1">{errors.clientCity}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state" className="text-muted-foreground">State *</Label>
              <Input
                id="state"
                value={recordData.clientState}
                onChange={(e) => handleInputChange('clientState', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.clientState && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientState && (
                <p className="text-destructive text-sm mt-1">{errors.clientState}</p>
              )}
            </div>
            <div>
              <Label htmlFor="zip" className="text-muted-foreground">ZIP Code *</Label>
              <Input
                id="zip"
                value={recordData.clientZip}
                onChange={(e) => handleInputChange('clientZip', e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.clientZip && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientZip && (
                <p className="text-destructive text-sm mt-1">{errors.clientZip}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Associated Firms - Third */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Associated Firms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recordData.firms.map((firm, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <p className="text-foreground font-medium">
                  {firm.name} - {firm.role}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Settlement - Fourth */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Settlement</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grossSettlementAmount" className="text-muted-foreground">Gross Settlement Amount *</Label>
              <Input
                id="grossSettlementAmount"
                type="number"
                value={recordData.grossSettlementAmount}
                onChange={(e) => handleInputChange('grossSettlementAmount', parseFloat(e.target.value) || 0)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.grossSettlementAmount && "border-destructive bg-destructive/10"
                )}
              />
              {errors.grossSettlementAmount && (
                <p className="text-destructive text-sm mt-1">{errors.grossSettlementAmount}</p>
              )}
            </div>
            <div>
              <Label htmlFor="settledAmount" className="text-muted-foreground">Settled Amount *</Label>
              <Input
                id="settledAmount"
                type="number"
                value={recordData.settledAmount}
                onChange={(e) => handleInputChange('settledAmount', parseFloat(e.target.value) || 0)}
                className={cn(
                  "bg-input border-border text-foreground",
                  errors.settledAmount && "border-destructive bg-destructive/10"
                )}
              />
              {errors.settledAmount && (
                <p className="text-destructive text-sm mt-1">{errors.settledAmount}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lien" className="text-muted-foreground">Lien</Label>
              <Input
                id="lienAmount"
                type="number"
                value={recordData.lienAmount}
                onChange={(e) => handleInputChange('lienAmount', parseFloat(e.target.value) || 0)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="advance" className="text-muted-foreground">Advance</Label>
              <Input
                id="advanceAmount"
                type="number"
                value={recordData.advanceAmount}
                onChange={(e) => handleInputChange('advanceAmount', parseFloat(e.target.value) || 0)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordDetail;