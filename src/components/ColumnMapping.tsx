import React, { useState } from 'react';
import { ArrowRight, Download, Wand2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ColumnMappingProps {
  headers: string[];
  onExport: (mappings: any) => void;
}

// Sample target schema - in real app this would be configurable
const targetSchema = [
  { id: 'firstName', label: 'First Name', type: 'text', required: true },
  { id: 'lastName', label: 'Last Name', type: 'text', required: true },
  { id: 'email', label: 'Email', type: 'email', required: true },
  { id: 'phone', label: 'Phone', type: 'phone', required: false },
  { id: 'company', label: 'Company', type: 'text', required: false },
  { id: 'position', label: 'Position', type: 'text', required: false },
  { id: 'dateJoined', label: 'Date Joined', type: 'date', required: false },
];

export function ColumnMapping({ headers, onExport }: ColumnMappingProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [transformations, setTransformations] = useState<Record<string, boolean>>({
    trimWhitespace: true,
    standardizeCase: false,
    removeSpecialChars: false,
  });

  const handleMappingChange = (targetField: string, sourceColumn: string) => {
    setMappings(prev => ({
      ...prev,
      [targetField]: sourceColumn === 'none' ? '' : sourceColumn
    }));
  };

  const autoMap = () => {
    const newMappings: Record<string, string> = {};
    
    targetSchema.forEach(target => {
      const possibleMatches = headers.filter(header => 
        header.toLowerCase().includes(target.label.toLowerCase()) ||
        header.toLowerCase().includes(target.id.toLowerCase())
      );
      
      if (possibleMatches.length > 0) {
        newMappings[target.id] = possibleMatches[0];
      }
    });
    
    setMappings(newMappings);
  };

  const getMappingStatus = () => {
    const requiredFields = targetSchema.filter(field => field.required);
    const mappedRequired = requiredFields.filter(field => mappings[field.id]);
    return {
      total: targetSchema.length,
      mapped: Object.keys(mappings).filter(key => mappings[key]).length,
      requiredMapped: mappedRequired.length,
      requiredTotal: requiredFields.length,
    };
  };

  const status = getMappingStatus();
  const canExport = status.requiredMapped === status.requiredTotal;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader className="bg-data-header border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Column Mapping
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={autoMap}>
                <Wand2 className="h-4 w-4" />
                Auto Map
              </Button>
              <Badge 
                variant={canExport ? "success" : "processing"}
                className="px-3 py-1"
              >
                {status.mapped}/{status.total} mapped
                {status.requiredTotal > 0 && ` • ${status.requiredMapped}/${status.requiredTotal} required`}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mapping Interface */}
      <div className="grid gap-4">
        {targetSchema.map((field) => (
          <Card key={field.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {mappings[field.id] ? (
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
                    ) : field.required ? (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    )}
                    <div>
                      <Label className="font-medium">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Type: {field.type}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={mappings[field.id] || 'none'}
                    onValueChange={(value) => handleMappingChange(field.id, value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No mapping</SelectItem>
                      {headers.map((header, index) => (
                        <SelectItem key={index} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transformation Options */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Data Transformations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            trimWhitespace: 'Trim whitespace from all fields',
            standardizeCase: 'Standardize text case (Title Case)',
            removeSpecialChars: 'Remove special characters from names',
          }).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch
                id={key}
                checked={transformations[key]}
                onCheckedChange={(checked) =>
                  setTransformations(prev => ({ ...prev, [key]: checked }))
                }
              />
              <Label htmlFor={key}>{label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Export */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Ready to Export</h3>
              <p className="text-sm text-muted-foreground">
                {canExport 
                  ? 'All required fields are mapped. You can now export your data.'
                  : 'Please map all required fields before exporting.'
                }
              </p>
            </div>
            <Button 
              onClick={() => onExport({ mappings, transformations })}
              disabled={!canExport}
              variant={canExport ? "default" : "outline"}
              size="lg"
              className={canExport ? "bg-gradient-success" : ""}
            >
              <Download className="h-4 w-4" />
              Export Mapped Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}