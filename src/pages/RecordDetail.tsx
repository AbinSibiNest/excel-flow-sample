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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, AlertCircle, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordData {
  id: number;
  referenceId: string;
  plaintiff: string;
  caseType: string;
  createDate: string;
  settledAmount: number;
  status: string;
  approval: string;
  caseStatus: string;
  syncStatus: string;
  syncError?: string;
  // Additional fields for form
  firmName: string;
  trustAccountNumber: string;
  grossSettlementAmount: number;
  clientFullName: string;
  clientFirstName: string;
  clientMiddleName: string;
  clientLastName: string;
  clientSuffix: string;
  clientEmail: string;
  clientPhone: string;
  clientBirthdate: string;
  clientSSN: string;
  clientAddressLine1: string;
  clientAddressLine2: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
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
  
  // Check if this is from "No Update" tab (all fields disabled)
  const searchParams = new URLSearchParams(window.location.search);
  const isDisabled = searchParams.get('disabled') === 'true';
  const urlCaseStatus = searchParams.get('caseStatus');

  useEffect(() => {
    // Use same mock data as PendingMigration screen
    const mockRecords = [
      {
        id: 1,
        referenceId: "REF-001",
        plaintiff: "John Smith",
        caseType: "Personal Injury",
        createDate: "2024-01-15",
        settledAmount: 15000,
        status: "New",
        approval: "Needs Review",
        caseStatus: "Draft",
        syncStatus: "Needs Review",
        firmName: "Anderson & Associates",
        trustAccountNumber: "TA-001234567",
        grossSettlementAmount: 25000,
        clientFullName: "John Smith",
        clientFirstName: "John",
        clientMiddleName: "",
        clientLastName: "Smith",
        clientSuffix: "",
        clientEmail: "john.smith@email.com",
        clientPhone: "555-INVALID",
        clientBirthdate: "1985-03-15",
        clientSSN: "123-45-678",
        clientAddressLine1: "123 Main St",
        clientAddressLine2: "Apt 4B",
        clientCity: "New York",
        clientState: "NY",
        clientZip: "10001",
        lienAmount: 7500,
        advanceAmount: 2500,
        defendant: "XYZ Corporation",
        firms: [
          { name: "Top Dog", role: "Referral" },
          { name: "VLV Law", role: "Co-Counsel" }
        ],
      },
      {
        id: 2,
        referenceId: "REF-002",
        plaintiff: "Sarah Johnson",
        caseType: "Medical Malpractice",
        createDate: "2024-01-18",
        settledAmount: 22500,
        status: "Updates",
        approval: "Ready to Sync",
        caseStatus: "Active",
        syncStatus: "Ready to Sync",
        firmName: "Johnson Legal Group",
        trustAccountNumber: "TA-002345678",
        grossSettlementAmount: 35000,
        clientFullName: "Sarah Johnson",
        clientFirstName: "Sarah",
        clientMiddleName: "Marie",
        clientLastName: "Johnson",
        clientSuffix: "",
        clientEmail: "sarah.johnson@email.com",
        clientPhone: "+1-555-555-0102",
        clientBirthdate: "1990-07-22",
        clientSSN: "987-65-4321",
        clientAddressLine1: "456 Oak Avenue",
        clientAddressLine2: "Suite 201",
        clientCity: "Los Angeles",
        clientState: "CA",
        clientZip: "90210",
        lienAmount: 8500,
        advanceAmount: 4000,
        defendant: "ABC Medical Center",
        firms: [
          { name: "Elite Law", role: "Lead Counsel" },
          { name: "Medical Experts LLC", role: "Expert Witness" }
        ],
      },
      {
        id: 3,
        referenceId: "REF-003",
        plaintiff: "Michael Brown",
        caseType: "Auto Accident",
        createDate: "2024-01-20",
        settledAmount: 18750,
        status: "New",
        approval: "Ready to Sync",
        caseStatus: "Draft",
        syncStatus: "Ready to Sync",
        firmName: "Brown & Associates",
        trustAccountNumber: "TA-003456789",
        grossSettlementAmount: 30000,
        clientFullName: "Michael Brown",
        clientFirstName: "Michael",
        clientMiddleName: "James",
        clientLastName: "Brown",
        clientSuffix: "Jr.",
        clientEmail: "michael.brown@email.com",
        clientPhone: "+1-555-555-0103",
        clientBirthdate: "1988-11-10",
        clientSSN: "111-22-3333",
        clientAddressLine1: "789 Pine St",
        clientAddressLine2: "",
        clientCity: "Chicago",
        clientState: "IL",
        clientZip: "60601",
        lienAmount: 9000,
        advanceAmount: 2250,
        defendant: "DEF Insurance Co",
        firms: [
          { name: "Auto Law Firm", role: "Lead Counsel" }
        ],
      },
      {
        id: 4,
        referenceId: "REF-004",
        plaintiff: "Emily Davis",
        caseType: "Slip and Fall",
        createDate: "2024-01-22",
        settledAmount: 0,
        status: "No Updates",
        approval: "Synced",
        caseStatus: "Active",
        syncStatus: "Synced",
        firmName: "Davis Legal",
        trustAccountNumber: "TA-004567890",
        grossSettlementAmount: 0,
        clientFullName: "Emily Davis",
        clientFirstName: "Emily",
        clientMiddleName: "Rose",
        clientLastName: "Davis",
        clientSuffix: "",
        clientEmail: "emily.davis@email.com",
        clientPhone: "+1-555-555-0104",
        clientBirthdate: "1992-05-08",
        clientSSN: "444-55-6666",
        clientAddressLine1: "321 Elm Ave",
        clientAddressLine2: "Unit 12",
        clientCity: "Houston",
        clientState: "TX",
        clientZip: "77001",
        lienAmount: 0,
        advanceAmount: 0,
        defendant: "GHI Property Management",
        firms: [
          { name: "Slip & Fall Experts", role: "Lead Counsel" }
        ],
      },
      {
        id: 5,
        referenceId: "REF-005",
        plaintiff: "David Wilson",
        caseType: "Workers' Compensation",
        createDate: "2024-01-25",
        settledAmount: 27800,
        status: "Updates",
        approval: "Needs Review",
        caseStatus: "Draft",
        syncStatus: "Needs Review",
        firmName: "Wilson Workers Law",
        trustAccountNumber: "TA-005678901",
        grossSettlementAmount: 40000,
        clientFullName: "David Wilson",
        clientFirstName: "David",
        clientMiddleName: "",
        clientLastName: "Wilson",
        clientSuffix: "Sr.",
        clientEmail: "david.wilson@email.com",
        clientPhone: "+1-555-555-0105",
        clientBirthdate: "1980-09-15",
        clientSSN: "777-88-9999",
        clientAddressLine1: "654 Maple Dr",
        clientAddressLine2: "",
        clientCity: "Phoenix",
        clientState: "AZ",
        clientZip: "85001",
        lienAmount: 10000,
        advanceAmount: 2200,
        defendant: "JKL Manufacturing",
        firms: [
          { name: "Workers Comp Specialists", role: "Lead Counsel" }
        ],
      }
    ];

    const recordId = parseInt(id || "1");
    const mockData = mockRecords.find(record => record.id === recordId) || mockRecords[0];
    
    // Override case status with URL parameter if provided
    if (urlCaseStatus) {
      mockData.caseStatus = urlCaseStatus;
    }
    
    setRecordData(mockData);
    validateRecord(mockData);
  }, [id, urlCaseStatus]);

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
      newErrors.clientPhone = "Please enter a valid phone number (e.g., +1-555-555-0101)";
    }

    // SSN validation (must be 9 digits)
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    if (!ssnRegex.test(data.clientSSN)) {
      newErrors.clientSSN = "SSN must be in format XXX-XX-XXXX with 9 digits";
    }

    // Required field validations
    if (!data.clientFirstName.trim()) {
      newErrors.clientFirstName = "First name is required";
    }
    
    if (!data.clientLastName.trim()) {
      newErrors.clientLastName = "Last name is required";
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
    if (!recordData) return;
    
    const isValid = validateRecord(recordData);
    setHasChanges(false);
    
    // Always save the changes regardless of validation
    const newApproval = isValid ? "Ready to Sync" : "Needs Review";
    
    toast({
      title: "Record Saved",
      description: isValid 
        ? "All errors fixed. Record is ready to sync."
        : "Record saved with validation errors. Status remains 'Needs Review'.",
      variant: isValid ? "default" : "destructive",
    });
    
    // Navigate back with updated record info and select checkbox if ready to sync
    const hash = isValid ? `#pending&updated=${id}&select=${id}` : `#pending&updated=${id}`;
    navigate(`/firm/firm-001${hash}`);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  const handleBack = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  const maskSSN = (ssn: string) => {
    if (!showSSN) {
      return "***-**-****";
    }
    return ssn;
  };

  const maskDOB = (dob: string) => {
    if (!showDOB) {
      return "**-**-****";
    }
    return dob;
  };

  if (!recordData) {
    return <div>Loading...</div>;
  }

  const hasErrors = Object.keys(errors).length > 0;
  const isNewCase = recordData.status === "New";
  const isUpdatedCase = recordData.status === "Updates";
  const isActiveCase = recordData.caseStatus === "Active";
  
  // For disabled records (from "No Update" tab), nothing is editable
  if (isDisabled) {
    var isAllFieldsEditable = false;
    var isSettlementEditable = false;
    var isClientInfoEditable = false;
  } else {
    // For Active case status: only Name and Address in client information are editable
    // For Draft case status: follows normal rules (New = all editable, Updates = client info editable)
    if (isActiveCase) {
      var isAllFieldsEditable = false;
      var isSettlementEditable = false;
      var isClientInfoEditable = true; // But only name and address fields
    } else {
      // Draft case status follows normal rules
      var isAllFieldsEditable = isNewCase;
      var isSettlementEditable = isNewCase;
      var isClientInfoEditable = isNewCase || isUpdatedCase;
    }
  }

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
            <h1 className="text-3xl font-bold text-foreground">Case Details</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-muted-foreground">Reference ID: {recordData.referenceId}</p>
              {!isDisabled && (
                <Badge 
                  variant={recordData.caseStatus === "Active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  Case Status: {recordData.caseStatus}
                </Badge>
              )}
            </div>
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
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
                onChange={isAllFieldsEditable ? (e) => handleInputChange('referenceId', e.target.value) : undefined}
                readOnly={!isAllFieldsEditable}
                className={cn(
                  isAllFieldsEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
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
                onChange={isAllFieldsEditable ? (e) => handleInputChange('firmName', e.target.value) : undefined}
                readOnly={!isAllFieldsEditable}
                className={cn(
                  isAllFieldsEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.firmName && "border-destructive bg-destructive/10"
                )}
              />
              {errors.firmName && (
                <p className="text-destructive text-sm mt-1">{errors.firmName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="trustAccountNumber" className="text-muted-foreground">Trust Account Number</Label>
              <Input
                id="trustAccountNumber"
                value={recordData.trustAccountNumber}
                onChange={isAllFieldsEditable ? (e) => handleInputChange('trustAccountNumber', e.target.value) : undefined}
                readOnly={!isAllFieldsEditable}
                className={cn(
                  isAllFieldsEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.trustAccountNumber && "border-destructive bg-destructive/10"
                )}
              />
              {errors.trustAccountNumber && (
                <p className="text-destructive text-sm mt-1">{errors.trustAccountNumber}</p>
              )}
            </div>
            <div>
              <Label htmlFor="defendant" className="text-muted-foreground">Defendant *</Label>
              <Input
                id="defendant"
                value={recordData.defendant}
                onChange={isAllFieldsEditable ? (e) => handleInputChange('defendant', e.target.value) : undefined}
                readOnly={!isAllFieldsEditable}
                className={cn(
                  isAllFieldsEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
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
              <Label htmlFor="firstName" className="text-muted-foreground">First Name *</Label>
              <Input
                id="firstName"
                value={recordData.clientFirstName}
                onChange={isClientInfoEditable ? (e) => handleInputChange('clientFirstName', e.target.value) : undefined}
                readOnly={!isClientInfoEditable}
                className={cn(
                  isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.clientFirstName && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientFirstName && (
                <p className="text-destructive text-sm mt-1">{errors.clientFirstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="middleName" className="text-muted-foreground">Middle Name</Label>
              <Input
                id="middleName"
                value={recordData.clientMiddleName}
                onChange={isClientInfoEditable ? (e) => handleInputChange('clientMiddleName', e.target.value) : undefined}
                readOnly={!isClientInfoEditable}
                className={isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium"}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-muted-foreground">Last Name *</Label>
              <Input
                id="lastName"
                value={recordData.clientLastName}
                onChange={isClientInfoEditable ? (e) => handleInputChange('clientLastName', e.target.value) : undefined}
                readOnly={!isClientInfoEditable}
                className={cn(
                  isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.clientLastName && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientLastName && (
                <p className="text-destructive text-sm mt-1">{errors.clientLastName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="suffix" className="text-muted-foreground">Suffix</Label>
              <Select
                value={recordData.clientSuffix}
                onValueChange={isClientInfoEditable ? (value) => handleInputChange('clientSuffix', value) : undefined}
                disabled={!isClientInfoEditable}
              >
                <SelectTrigger className={cn(
                  isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium cursor-default",
                  "h-10"
                )}>
                  <SelectValue placeholder="Select suffix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="Jr.">Jr.</SelectItem>
                  <SelectItem value="Sr.">Sr.</SelectItem>
                  <SelectItem value="II">II</SelectItem>
                  <SelectItem value="III">III</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email" className="text-muted-foreground">Email *</Label>
              <Input
                id="email"
                type="email"
                value={recordData.clientEmail}
                onChange={isClientInfoEditable && !isActiveCase ? (e) => handleInputChange('clientEmail', e.target.value) : undefined}
                readOnly={!isClientInfoEditable || isActiveCase}
                className={cn(
                  (isClientInfoEditable && !isActiveCase) ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
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
                onChange={isClientInfoEditable && !isActiveCase ? (e) => handleInputChange('clientPhone', e.target.value) : undefined}
                readOnly={!isClientInfoEditable || isActiveCase}
                className={cn(
                  (isClientInfoEditable && !isActiveCase) ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.clientPhone && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientPhone && (
                <p className="text-destructive text-sm mt-1">{errors.clientPhone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="addressLine1" className="text-muted-foreground">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                value={recordData.clientAddressLine1}
                onChange={isClientInfoEditable ? (e) => handleInputChange('clientAddressLine1', e.target.value) : undefined}
                readOnly={!isClientInfoEditable}
                className={cn(
                  isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
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
                onChange={isClientInfoEditable ? (e) => handleInputChange('clientAddressLine2', e.target.value) : undefined}
                readOnly={!isClientInfoEditable}
                className={isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium"}
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-muted-foreground">City *</Label>
              <Input
                id="city"
                value={recordData.clientCity}
                onChange={isClientInfoEditable ? (e) => handleInputChange('clientCity', e.target.value) : undefined}
                readOnly={!isClientInfoEditable}
                className={cn(
                  isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
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
                onChange={isClientInfoEditable ? (e) => handleInputChange('clientState', e.target.value) : undefined}
                readOnly={!isClientInfoEditable}
                className={cn(
                  isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
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
                onChange={isClientInfoEditable ? (e) => handleInputChange('clientZip', e.target.value) : undefined}
                readOnly={!isClientInfoEditable}
                className={cn(
                  isClientInfoEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.clientZip && "border-destructive bg-destructive/10"
                )}
              />
              {errors.clientZip && (
                <p className="text-destructive text-sm mt-1">{errors.clientZip}</p>
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
                onChange={isClientInfoEditable && !isActiveCase ? (e) => handleInputChange('clientBirthdate', e.target.value) : undefined}
                className={(isClientInfoEditable && !isActiveCase) ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium"}
                readOnly={!showDOB || !isClientInfoEditable || isActiveCase}
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
                onChange={isClientInfoEditable && !isActiveCase ? (e) => handleInputChange('clientSSN', e.target.value) : undefined}
                className={cn(
                  (isClientInfoEditable && !isActiveCase) ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.clientSSN && "border-destructive bg-destructive/10"
                )}
                readOnly={!showSSN || !isClientInfoEditable || isActiveCase}
                placeholder="XXX-XX-XXXX"
              />
              {errors.clientSSN && (
                <p className="text-destructive text-sm mt-1">{errors.clientSSN}</p>
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
            <Label htmlFor="associatedFirms" className="text-muted-foreground">Firm - Role</Label>
            {recordData.firms.map((firm, index) => (
              <div>
                <Input
                id={"Associated Firm"+{index}}
                type="text"
                value= {firm.name+' - '+firm.role}
                readOnly
                className="p-3 bg-card rounded-lg text-foreground font-medium"
              />
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
                onChange={isSettlementEditable ? (e) => handleInputChange('grossSettlementAmount', parseFloat(e.target.value) || 0) : undefined}
                readOnly={!isSettlementEditable}
                className={cn(
                  isSettlementEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
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
                onChange={isSettlementEditable ? (e) => handleInputChange('settledAmount', parseFloat(e.target.value) || 0) : undefined}
                readOnly={!isSettlementEditable}
                className={cn(
                  isSettlementEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
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
                onChange={isSettlementEditable ? (e) => handleInputChange('lienAmount', parseFloat(e.target.value) || 0) : undefined}
                value={recordData.lienAmount}
               readOnly={!isSettlementEditable}
                className={cn(
                  isSettlementEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.lienAmount && "border-destructive bg-destructive/10"
                )}/>
            </div>
            <div>
              <Label htmlFor="advance" className="text-muted-foreground">Advance</Label>
              <Input
                id="advanceAmount"
                type="number"
                value={recordData.advanceAmount}
                onChange={isSettlementEditable ? (e) => handleInputChange('advanceAmount', parseFloat(e.target.value) || 0) : undefined}
                readOnly={!isSettlementEditable}
                className={cn(
                  isSettlementEditable ? "border-border text-foreground bg-background" : "p-3 bg-card rounded-lg text-foreground font-medium",
                  errors.advanceAmount && "border-destructive bg-destructive/10"
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordDetail;