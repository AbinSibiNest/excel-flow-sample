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

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setUploadStatus("idle");
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
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
    setFiles(files.filter((_, i) => i !== index));
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Simulate success/error
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

      {/* Upload Area */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Upload Files</CardTitle>
          <CardDescription className="text-gray-400">
            Drag and drop your CSV files here or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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

          {/* Upload Progress */}
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

          {/* Status Messages */}
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

          {/* Action Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={startMigration}
              disabled={files.length === 0 || isUploading}
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
