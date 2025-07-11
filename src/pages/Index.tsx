import React, { useState } from 'react';
import { FileSpreadsheet, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { ColumnMapping } from '@/components/ColumnMapping';
import { useExcelParser, ParsedData } from '@/hooks/useExcelParser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type Step = 'upload' | 'preview' | 'mapping' | 'complete';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const { parseFile, isLoading, error } = useExcelParser();
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const result = await parseFile(file);
    
    if (result) {
      setParsedData(result);
      setCurrentStep('preview');
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${result.data.length} rows with ${result.headers.length} columns`,
      });
    } else if (error) {
      toast({
        title: "Upload failed",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setParsedData(null);
    setCurrentStep('upload');
  };

  const handleProceedToMapping = () => {
    setCurrentStep('mapping');
  };

  const handleExport = (mappingConfig: any) => {
    // In a real app, this would process and export the data
    console.log('Export configuration:', mappingConfig);
    setCurrentStep('complete');
    toast({
      title: "Export successful",
      description: "Your data has been processed and exported successfully",
    });
  };

  const steps = [
    { id: 'upload', label: 'Upload File', icon: Upload },
    { id: 'preview', label: 'Preview Data', icon: FileSpreadsheet },
    { id: 'mapping', label: 'Map Columns', icon: ArrowRight },
    { id: 'complete', label: 'Complete', icon: CheckCircle2 },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Excel Migration Tool</h1>
                <p className="text-muted-foreground">Import, map, and transform your spreadsheet data</p>
              </div>
            </div>
            {selectedFile && (
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {selectedFile.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const Icon = step.icon;
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center gap-3">
                      <div className={`
                        p-3 rounded-full transition-all duration-300
                        ${status === 'completed' ? 'bg-gradient-success text-white' : 
                          status === 'current' ? 'bg-gradient-primary text-white' : 
                          'bg-muted text-muted-foreground'}
                      `}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          status === 'current' ? 'text-primary' : 
                          status === 'completed' ? 'text-secondary' : 
                          'text-muted-foreground'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`
                        h-1 flex-1 mx-4 rounded transition-all duration-300
                        ${getStepStatus(steps[index + 1].id) === 'completed' || 
                          getStepStatus(steps[index + 1].id) === 'current' ? 
                          'bg-primary' : 'bg-muted'}
                      `} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'upload' && (
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onRemoveFile={handleRemoveFile}
            />
          )}

          {currentStep === 'preview' && parsedData && (
            <DataPreview
              data={parsedData.data}
              headers={parsedData.headers}
              fileName={parsedData.fileName}
              onProceedToMapping={handleProceedToMapping}
            />
          )}

          {currentStep === 'mapping' && parsedData && (
            <ColumnMapping
              headers={parsedData.headers}
              onExport={handleExport}
            />
          )}

          {currentStep === 'complete' && (
            <Card className="text-center p-12 shadow-card">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-success rounded-full w-fit mx-auto">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Migration Complete!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your Excel data has been successfully processed and exported. 
                    You can now use it in your target system.
                  </p>
                </div>
                <div className="flex gap-3 justify-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentStep('upload');
                      setSelectedFile(null);
                      setParsedData(null);
                    }}
                  >
                    Process Another File
                  </Button>
                  <Button className="bg-gradient-primary">
                    Download Results
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
