// src/pages/files.tsx
import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  DocumentIcon, 
  TrashIcon, 
  EyeIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

// Define supported file types
const SUPPORTED_EXTENSIONS = [
  '.csv', 
  '.pdf', 
  '.xlsx', 
  '.xls', 
  '.docx', 
  '.doc', 
  '.txt'
];

// File Interface
interface FileItem {
  id: string;
  name: string;
  extension: string;
  size: number;
  uploadedAt: Date;
  file: File;
}

export default function FilesPage() {
  // Files State initialized with empty array
  const [files, setFiles] = useState<FileItem[]>([]);
  // Flag to track if we're in browser environment
  const [isClient, setIsClient] = useState(false);

  // Preview State
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  // Run this effect only on client-side after component mounts
  useEffect(() => {
    setIsClient(true);
    // Load files from localStorage only after component has mounted
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles).map((file: Omit<FileItem, 'file'> & { file: string }) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt),
          file: null // We'll need to re-upload files
        }));
        setFiles(parsedFiles);
      } catch (error) {
        console.error('Error parsing saved files:', error);
        // If there's an error, clear localStorage
        localStorage.removeItem('uploadedFiles');
      }
    }
  }, []);

  // Save files to localStorage whenever files change, but only on client-side
  useEffect(() => {
    if (isClient) {
      // Convert File to a storable format
      const storableFiles = files.map(({ file, ...rest }) => rest);
      
      if (storableFiles.length > 0) {
        localStorage.setItem('uploadedFiles', JSON.stringify(storableFiles));
      } else {
        // Remove localStorage item if no files
        localStorage.removeItem('uploadedFiles');
      }
    }
  }, [files, isClient]);

  // File Upload Handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles: FileItem[] = Array.from(uploadedFiles)
      .filter(file => {
        const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        return SUPPORTED_EXTENSIONS.includes(extension);
      })
      .map(file => ({
        id: `file-${Date.now()}-${file.name}`,
        name: file.name.split('.')[0],
        extension: file.name.split('.').pop()?.toLowerCase() || '',
        size: file.size,
        uploadedAt: new Date(),
        file: file
      }));

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  // File Delete Handler
  const handleDeleteFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    
    // Update state and localStorage in one go
    setFiles(updatedFiles);
  };

  // File Download Handler
  const handleDownloadFile = (file: FileItem) => {
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(file.file);
    downloadLink.href = url;
    downloadLink.download = `${file.name}.${file.extension}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // File Preview Handler
  const handlePreviewFile = (file: FileItem) => {
    // For PDF and images, we can create a blob URL
    if (['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(file.extension)) {
      const url = URL.createObjectURL(file.file);
      window.open(url, '_blank');
    } 
    // For text and CSV files, we can read and display content
    else if (['txt', 'csv'].includes(file.extension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        // Create a modal or new window to display content
        const previewWindow = window.open('', '_blank');
        previewWindow?.document.write(`
          <html>
            <head>
              <title>File Preview</title>
              <style>
                body { font-family: monospace; white-space: pre-wrap; margin: 20px; }
              </style>
            </head>
            <body>${content}</body>
          </html>
        `);
      };
      reader.readAsText(file.file);
    }
  };

  // File Size Formatter
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg">
          {/* File Upload Section */}
          <div className="p-6 border-b flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Files</h1>
            <div>
              <input 
                type="file" 
                multiple 
                accept={SUPPORTED_EXTENSIONS.join(',')}
                className="hidden" 
                id="file-upload"
                onChange={handleFileUpload}
              />
              <label 
                htmlFor="file-upload" 
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Upload Files
              </label>
            </div>
          </div>

          {/* File List */}
          <div className="p-6">
            {files.length === 0 ? (
              <div className="text-center text-gray-500">
                <FolderIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <DocumentIcon className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{file.name}.{file.extension}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • Uploaded {file.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePreviewFile(file)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDownloadFile(file)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}