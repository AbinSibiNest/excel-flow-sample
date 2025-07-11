import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, onRemoveFile }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  if (selectedFile) {
    return (
      <Card className="p-6 bg-gradient-upload border-upload-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemoveFile}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      {...getRootProps()} 
      className={cn(
        "p-8 cursor-pointer transition-all duration-300 bg-gradient-upload border-2 border-dashed",
        isDragActive 
          ? "border-primary shadow-upload scale-105" 
          : "border-upload-border hover:border-primary/50 hover:shadow-card"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={cn(
          "p-4 rounded-full transition-all duration-300",
          isDragActive ? "bg-primary/20 scale-110" : "bg-primary/10"
        )}>
          <Upload className={cn(
            "h-8 w-8 transition-colors duration-300",
            isDragActive ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {isDragActive ? 'Drop your file here' : 'Upload Excel File'}
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Drag and drop your Excel file (.xlsx, .xls) or CSV file here, or click to browse
          </p>
        </div>
        <Button variant="upload" className="transition-all duration-300">
          <Upload className="h-4 w-4" />
          Choose File
        </Button>
        <p className="text-xs text-muted-foreground">
          Supported formats: .xlsx, .xls, .csv (Max 10MB)
        </p>
      </div>
    </Card>
  );
}