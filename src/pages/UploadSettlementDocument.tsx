import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, File, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const UploadSettlementDocument = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleBack = () => {
    const returnTab = location.state?.returnTab || "settlements";
    navigate("/cases", { state: { activeTab: returnTab } });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#1a1f26] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            GO BACK
          </Button>
          <h1 className="text-2xl font-bold text-white">Upload Settlement Document</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="bg-[#1e2328] rounded-lg border border-gray-700 p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">
                  Drop files here or click to browse
                </h3>
                <p className="text-gray-400">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG
                </p>
                <p className="text-gray-400 text-sm">
                  Maximum file size: 10MB
                </p>
              </div>
              
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="bg-[#1e2328] rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#2a2f36] rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-cyan-400" />
                      <div>
                        <div className="text-white font-medium">{file.name}</div>
                        <div className="text-gray-400 text-sm">
                          {formatFileSize(file.size)}
                        </div>
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
            </div>
          )}

          {/* Form Fields */}
          <div className="bg-[#1e2328] rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Document Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Case Reference
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-[#2a2f36] border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter case reference"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Document Type
                </label>
                <select className="w-full px-3 py-2 bg-[#2a2f36] border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>Settlement Agreement</option>
                  <option>Release Form</option>
                  <option>Court Order</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-[#2a2f36] border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter document description..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={uploadedFiles.length === 0}
            >
              Upload Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSettlementDocument;