import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  CloudArrowUpIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
  TableCellsIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// Interface for our CSV data
interface ProspectData {
  [key: string]: string;
}

export default function ProspectsPage() {
  // State for CSV data
  const [prospects, setProspects] = useState<ProspectData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    setIsClient(true);
    
    // Retrieve saved data
    const savedProspectsJson = localStorage.getItem('prospectsData');
    const savedHeadersJson = localStorage.getItem('prospectsHeaders');
    const savedFileName = localStorage.getItem('prospectsFileName');

    if (savedProspectsJson && savedHeadersJson) {
      try {
        const savedProspects = JSON.parse(savedProspectsJson);
        const savedHeaders = JSON.parse(savedHeadersJson);
        
        setProspects(savedProspects);
        setHeaders(savedHeaders);
        
        if (savedFileName) {
          setFileName(savedFileName);
        }
      } catch (error) {
        console.error('Error parsing saved prospects data', error);
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        // Parse CSV
        const { headers, data } = parseCSV(content);
        
        if (data.length > 0) {
          // Save to localStorage
          localStorage.setItem('prospectsData', JSON.stringify(data));
          localStorage.setItem('prospectsHeaders', JSON.stringify(headers));
          localStorage.setItem('prospectsFileName', file.name);

          setHeaders(headers);
          setProspects(data);
        } else {
          setError('No data found in CSV file');
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setError('Failed to parse CSV file');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read the file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  // CSV parser function
  const parseCSV = (csvText: string): { headers: string[], data: ProspectData[] } => {
    // Clean the input - handle various newline formats
    const cleanedCsv = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Try to detect the delimiter
    const firstLine = cleanedCsv.split('\n')[0];
    const possibleDelimiters = [',', ';', '\t', '|'];
    
    let bestDelimiter = ',';
    let maxCount = 0;
    
    for (const delimiter of possibleDelimiters) {
      const count = (firstLine.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
      if (count > maxCount) {
        maxCount = count;
        bestDelimiter = delimiter;
      }
    }
    
    // Split into rows
    const rows = cleanedCsv.split('\n').filter(row => row.trim() !== '');
    if (rows.length === 0) {
      throw new Error('No data found in CSV file');
    }
    
    // Parse header row
    const headerRow = rows[0];
    const headerValues = splitCSVRow(headerRow, bestDelimiter);
    
    // Clean up header values and make them unique
    const cleanHeaders: string[] = [];
    const usedHeaders = new Set<string>();
    
    headerValues.forEach((header, index) => {
      // Remove quotes and trim
      let cleaned = header.replace(/^["'](.*)["']$/, '$1').trim();
      
      // If empty or just whitespace, use a default name
      if (!cleaned || cleaned.length === 0) {
        cleaned = `Column ${index + 1}`;
      }
      
      // Ensure header is unique
      if (usedHeaders.has(cleaned)) {
        let uniqueHeader = cleaned;
        let counter = 1;
        while (usedHeaders.has(uniqueHeader)) {
          uniqueHeader = `${cleaned} (${counter})`;
          counter++;
        }
        cleaned = uniqueHeader;
      }
      
      usedHeaders.add(cleaned);
      cleanHeaders.push(cleaned);
    });
    
    // Process data rows
    const parsedData: ProspectData[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;
      
      const values = splitCSVRow(row, bestDelimiter);
      
      // Create object with headers as keys
      const dataObj: ProspectData = {};
      
      cleanHeaders.forEach((header, j) => {
        // Get the value at this position, or empty string if missing
        const value = j < values.length ? values[j] : '';
        
        // Clean the value (remove quotes)
        dataObj[header] = value.replace(/^["'](.*)["']$/, '$1').trim();
      });
      
      parsedData.push(dataObj);
    }
    
    return { headers: cleanHeaders, data: parsedData };
  };
  
  // Helper function to split CSV row properly handling quoted values
  const splitCSVRow = (row: string, delimiter: string): string[] => {
    const result: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      const nextChar = i < row.length - 1 ? row[i + 1] : '';
      
      // Handle quotes
      if ((char === '"' || char === "'") && (!inQuotes || char === quoteChar)) {
        if (inQuotes && nextChar === delimiter) {
          // End of quoted value followed by delimiter
          inQuotes = false;
        } else if (!inQuotes && currentValue === '') {
          // Start of quoted value
          inQuotes = true;
          quoteChar = char;
        } else if (inQuotes && nextChar === quoteChar) {
          // Escaped quote within quoted value
          currentValue += char;
          i++; // Skip the next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          if (inQuotes) quoteChar = char;
        }
      } 
      // Handle delimiter
      else if (char === delimiter && !inQuotes) {
        result.push(currentValue);
        currentValue = '';
      } 
      // Add character to current value
      else {
        currentValue += char;
      }
    }
    
    // Add the last value
    result.push(currentValue);
    
    return result;
  };

  const clearData = () => {
    setProspects([]);
    setHeaders([]);
    setFileName(null);

    // Clear localStorage
    localStorage.removeItem('prospectsData');
    localStorage.removeItem('prospectsHeaders');
    localStorage.removeItem('prospectsFileName');
  };

  // Format headers for display
  const formatHeaderForDisplay = (header: string): string => {
    return header
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  };

  // Function to export current data as Excel-compatible CSV
  const exportToCSV = () => {
    if (prospects.length === 0) return;
    
    // Create CSV content
    let csv = '';
    
    // Add headers
    csv += headers.map(header => `"${header}"`).join(',') + '\n';
    
    // Add data rows
    for (const prospect of prospects) {
      const row = headers.map(header => {
        const value = prospect[header] || '';
        // Quote values that contain commas or quotes
        return value.includes(',') || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',');
      csv += row + '\n';
    }
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName?.split('.')[0] || 'prospects'}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg">
          {/* Header Section */}
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Prospects</h1>
              {fileName && (
                <span className="text-sm text-gray-500 ml-2">
                  {fileName}
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              {prospects.length > 0 && (
                <>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    title="Export CSV"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
                    Export
                  </button>
                  <button
                    onClick={clearData}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <ArrowPathIcon className="h-5 w-5 mr-1" />
                    Clear
                  </button>
                </>
              )}
              <div>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csv-upload"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                >
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Upload CSV
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 flex items-center space-x-2 mx-6 mt-4 rounded">
              <ExclamationCircleIcon className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && prospects.length === 0 && !error && (
            <div className="text-center p-12 text-gray-500">
              <TableCellsIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No data loaded</p>
              <p className="text-sm mt-2">Upload a CSV file to view your data</p>
            </div>
          )}

          {/* Excel-like Table */}
          {!isLoading && prospects.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse table-fixed">
                {/* Column Headers */}
                <thead>
                  <tr className="bg-gray-50 border-b">
                    {/* Row number column */}
                    <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      #
                    </th>
                    
                    {/* Data columns */}
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                      >
                        {formatHeaderForDisplay(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody>
                  {prospects.map((prospect, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className={`border-b hover:bg-gray-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      {/* Row number */}
                      <td className="px-3 py-2 text-sm text-gray-500 border-r text-center">
                        {rowIndex + 1}
                      </td>
                      
                      {/* Data cells */}
                      {headers.map((header, colIndex) => (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          className="px-4 py-2 text-sm text-gray-700 border-r whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {prospect[header] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Footer with row count */}
              <div className="p-4 border-t bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
                <div>
                  Total rows: {prospects.length}
                </div>
                <div>
                  {prospects.length} of {prospects.length} rows
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}