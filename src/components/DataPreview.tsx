import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Download, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DataPreviewProps {
  data: any[][];
  headers: string[];
  fileName: string;
  onProceedToMapping: () => void;
}

export function DataPreview({ data, headers, fileName, onProceedToMapping }: DataPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  const paginatedData = data.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <Card className="shadow-card">
      <CardHeader className="bg-data-header border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Data Preview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing data from <span className="font-medium">{fileName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {data.length} rows × {headers.length} columns
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-data-header">
              <tr>
                {headers.map((header, index) => (
                  <th 
                    key={index}
                    className="text-left p-4 font-medium text-foreground border-r border-border last:border-r-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[150px]">{header}</span>
                      <Badge variant="outline" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex}
                      className="p-4 border-r border-border last:border-r-0"
                    >
                      <div className="max-w-[200px] truncate text-sm">
                        {cell?.toString() || '—'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between p-4 border-t bg-muted/30">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export Raw Data
            </Button>
            <Button onClick={onProceedToMapping} className="bg-gradient-primary hover:opacity-90">
              <Settings2 className="h-4 w-4" />
              Configure Mapping
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}