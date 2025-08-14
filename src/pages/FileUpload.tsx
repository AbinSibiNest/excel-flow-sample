import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Play,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [caseType, setCaseType] = useState<string>("");
  const [caseTypeSearchValue, setCaseTypeSearchValue] = useState<string>(""); // Renamed for clarity
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const { toast } = useToast();

  // Sample data for preview (in real app, this would come from parsing the CSV)
  const samplePreviewData = [
    {
      projectId: "12302892",
      date: "01-15-24",
      phase: "In Treatment",
      projectType: "Personal Injury",
      grossSettlement: "458000",
      defendant: "Cigna ltd",
      fullName: "Maria Lopez Joynaas Noah Peter",
      clientEmails: "kj.69@myshoo.com",
      clientPhones: "+13873256967",
      clientDetails: "505-12-1773",
      socialSecurity: "9747",
      clientAddress1: "Bird Ive Road",
      clientDateOfBirth: "02-15-98",
      referralSource: "VLX Law",
      settlementAmount: "12000",
      orgClients: "Layfly Law Firm",
      firstPrimary: "Harry Max",
      clientName: "John",
      clientDateDeath: "03-20-23"
    }
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setUploadStatus("idle");
    // In real app, parse CSV here and set preview data
    if (acceptedFiles.length > 0) {
      setPreviewData(samplePreviewData);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDrop(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onDrop(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setPreviewData([]);
    }
  };

  const caseTypes = [
    "Personal Injury",
    "Medical Malpractice",
    "Workers' Compensation",
    "Auto Accident",
    "Product Liability",
    "Wrongful Death"
  ];

  // UPDATED: Filter logic now correctly uses the search input's value
  const filteredCaseTypes = caseTypes.filter(type =>
    type.toLowerCase().includes(caseTypeSearchValue.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    // Convert to MM-DD-YY format
    return dateStr;
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const success = Math.random() > 0.2; // 80% success rate
    if (success) {
      setUploadStatus("success");
      toast({
        title: "Upload Successful",
        description: "Files uploaded successfully and migration started.",
      });
    } else {
      setUploadStatus("error");
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });
    }

    setIsUploading(false);
  };

  const startMigration = () => {
    if (!caseType) {
      toast({
        title: "Case Type Required",
        description: "Please select a case type before starting migration.",
        variant: "destructive",
      });
      return;
    }
    
    if (files.length > 0) {
      simulateUpload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">
          File Upload & Execution
        </h1>
      </div>

      {/* Main Upload Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Upload Files</CardTitle>
          <CardDescription className="text-gray-400">
            Select a case type, then drag and drop your CSV files below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* MOVED: Case Type selector is now here */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="case-type-search" className="text-gray-300">
              Case Type <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Input
                id="case-type-search"
                placeholder="Type to search case types..."
                value={caseTypeSearchValue}
                onChange={(e) => {
                  setCaseTypeSearchValue(e.target.value);
                  setCaseType(""); // Clear final selection while user is typing
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  if (caseTypeSearchValue) setIsDropdownOpen(true);
                }}
                onBlur={() => {
                  // Delay hiding to allow click event on dropdown items
                  setTimeout(() => setIsDropdownOpen(false), 150);
                }}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
              {isDropdownOpen && caseTypeSearchValue && filteredCaseTypes.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCaseTypes.map((type) => (
                    <div
                      key={type}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-700 text-gray-100"
                      onMouseDown={() => { // Use onMouseDown to register click before onBlur hides the dropdown
                        setCaseTypeSearchValue(type);
                        setCaseType(type); // UPDATED: This now sets the final caseType state
                        setIsDropdownOpen(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? "border-cyan-500 bg-cyan-500/10" 
                // MODIFIED: Added hover background color
                : "border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/10"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${
              isDragActive ? "text-cyan-400" : "text-gray-400"
            }`} />
            <p className="text-lg text-gray-300 mb-2">
              Drop your CSV files here
            </p>
            <p className="text-sm text-gray-500">or click to browse files</p>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-medium text-gray-100">
                Selected Files
              </h3>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="font-medium text-gray-100">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress, Status Messages, and Preview Table... (rest of the code is unchanged) */}
          
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">
                  Uploading files...
                </span>
                <span className="text-sm text-gray-300">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadStatus === "success" && (
            <Alert className="mt-6 bg-green-900/50 border-green-600">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">
                Files uploaded successfully! Migration workflow has been
                triggered.
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="mt-6 bg-red-900/50 border-red-600">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                Upload failed. Please try again or check your file format.
              </AlertDescription>
            </Alert>
          )}

          {previewData.length > 0 && (
            <div className="mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100">File Preview - First 5 Rows</CardTitle>
                  <CardDescription className="text-gray-400">
                    Please verify the data below before uploading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Project ID</TableHead>
                          <TableHead className="text-gray-300">Date Filed</TableHead>
                          <TableHead className="text-gray-300">Phase</TableHead>
                          <TableHead className="text-gray-300">Project Type</TableHead>
                          <TableHead className="text-gray-300">Gross Settlement</TableHead>
                          <TableHead className="text-gray-300">Defendant</TableHead>
                          <TableHead className="text-gray-300">Client Full Name</TableHead>
                          <TableHead className="text-gray-300">Client Emails</TableHead>
                          <TableHead className="text-gray-300">Client Phones</TableHead>
                          <TableHead className="text-gray-300">Client Details- Social Security Number</TableHead>
                          <TableHead className="text-gray-300">Client Address 1</TableHead>
                          <TableHead className="text-gray-300">Client Date of Birth</TableHead>
                          <TableHead className="text-gray-300">Referral Source</TableHead>
                          <TableHead className="text-gray-300">Settlement Amount</TableHead>
                          <TableHead className="text-gray-300">Org Clients</TableHead>
                          <TableHead className="text-gray-300">First Primary</TableHead>
                          <TableHead className="text-gray-300">Client Name</TableHead>
                          <TableHead className="text-gray-300">Client Date of Death</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 5).map((row, index) => (
                          <TableRow key={index} className="border-gray-700">
                            <TableCell className="text-gray-300">{row.projectId}</TableCell>
                            <TableCell className="text-gray-300">{formatDate(row.date)}</TableCell>
                            <TableCell className="text-gray-300">{row.phase}</TableCell>
                            <TableCell className="text-gray-300">{row.projectType}</TableCell>
                            <TableCell className="text-gray-300">{row.grossSettlement}</TableCell>
                            <TableCell className="text-gray-300">{row.defendant}</TableCell>
                            <TableCell className="text-gray-300">{row.fullName}</TableCell>
                            <TableCell className="text-gray-300">{row.clientEmails}</TableCell>
                            <TableCell className="text-gray-300">{row.clientPhones}</TableCell>
                            <TableCell className="text-gray-300">{row.clientDetails}</TableCell>
                            <TableCell className="text-gray-300">{row.clientAddress1}</TableCell>
                            <TableCell className="text-gray-300">{formatDate(row.clientDateOfBirth)}</TableCell>
                            <TableCell className="text-gray-300">{row.referralSource}</TableCell>
                            <TableCell className="text-gray-300">{row.settlementAmount}</TableCell>
                            <TableCell className="text-gray-300">{row.orgClients}</TableCell>
                            <TableCell className="text-gray-300">{row.firstPrimary}</TableCell>
                            <TableCell className="text-gray-300">{row.clientName}</TableCell>
                            <TableCell className="text-gray-300">{formatDate(row.clientDateDeath)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={startMigration}
              disabled={files.length === 0 || isUploading || !caseType}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Migration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start space-x-2">
              <Badge className="bg-purple-900/50 text-purple-400 border-purple-600 mt-0.5">
                CSV
              </Badge>
              <span>Only CSV files are supported for migration</span>
            </div>
            <div className="flex items-start space-x-2">
              <Badge className="bg-blue-900/50 text-blue-400 border-blue-600 mt-0.5">
                SIZE
              </Badge>
              <span>Maximum file size is 100MB per file</span>
            </div>
            <div className="flex items-start space-x-2">
              <Badge className="bg-green-900/50 text-green-400 border-green-600 mt-0.5">
                FORMAT
              </Badge>
              <span>Ensure your CSV has proper headers and UTF-8 encoding</span>
            </div>
            <div className="flex items-start space-x-2">
              <Badge className="bg-orange-900/50 text-orange-400 border-orange-600 mt-0.5">
                CONFIG
              </Badge>
              <span>
                Make sure your mapping.json configuration is set up correctly
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;