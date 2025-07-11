import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

export interface ParsedData {
  headers: string[];
  data: any[][];
  fileName: string;
}

export function useExcelParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File): Promise<ParsedData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Get the first worksheet
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      
      // Convert to JSON array
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: '',
        raw: false 
      }) as any[][];

      if (jsonData.length === 0) {
        throw new Error('The file appears to be empty');
      }

      // Extract headers from the first row
      const headers = jsonData[0]?.map((header, index) => 
        header?.toString().trim() || `Column ${index + 1}`
      ) || [];

      // Extract data rows (skip header)
      const data = jsonData.slice(1).filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );

      if (data.length === 0) {
        throw new Error('No data rows found in the file');
      }

      return {
        headers,
        data,
        fileName: file.name
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse file';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    parseFile,
    isLoading,
    error,
  };
}