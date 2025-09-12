import React, { useState } from 'react';
import { Upload, File, CheckCircle, XCircle, Clock, FileText, Brain } from 'lucide-react';

// Backend API URL - adjust this to match your backend server
const API_BASE_URL = 'http://127.0.0.1:5000';

const UploadDocuments = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingInfo, setProcessingInfo] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const uploadFileToBackend = async (file) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(`${API_BASE_URL}/process/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload and processing successful:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleFiles = async (files) => {
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      status: 'uploading',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 10
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload each file to backend and process with LLM
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newFile = newFiles[i];
      
      try {
        // Show processing status
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id ? { ...f, status: 'processing', progress: 50 } : f
          )
        );

        // Upload to backend for LLM processing
        const result = await uploadFileToBackend(file);
        
        if (result.success) {
          // Upload and processing successful
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id ? { 
                ...f, 
                status: 'completed', 
                progress: 100,
                processingResult: result.data
              } : f
            )
          );
          
          // Set the latest processing info for display
          setProcessingInfo(result.data);
        } else {
          // Upload/processing failed
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id ? { ...f, status: 'error', progress: 0 } : f
            )
          );
        }
      } catch (error) {
        // Upload failed
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id ? { ...f, status: 'error', progress: 0 } : f
          )
        );
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'uploading':
        return <Clock className="w-5 h-5 text-secondary animate-spin" />;
      case 'processing':
        return <Brain className="w-5 h-5 text-primary animate-pulse" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // Calculate stats from uploaded files
  const completedFiles = uploadedFiles.filter(f => f.status === 'completed').length;
  const processingFiles = uploadedFiles.filter(f => f.status === 'processing' || f.status === 'uploading').length;
  const errorFiles = uploadedFiles.filter(f => f.status === 'error').length;

  const stats = [
    { label: "Completed", value: completedFiles, color: 'text-accent' },
    { label: 'Processing', value: processingFiles, color: 'text-primary' },
    { label: 'Errors', value: errorFiles, color: 'text-destructive' }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Upload Documents</h1>

      {/* Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div
            className={`glass rounded-xl p-12 text-center transition-all ${
              isDragging ? 'border-2 border-primary bg-primary/5' : 'border-2 border-dashed border-border'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">
              Upload Document for AI Processing
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              PDF files supported. AI will automatically extract text, detect language, summarize, and categorize your document.
            </p>
            <label className="btn-primary cursor-pointer">
              Browse
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>

        {/* LLM Processing Results */}
        <div className="glass rounded-xl p-6 border-2 border-primary">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Processing Results
          </h3>
          {processingInfo ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Department:</span>
                <p className="font-medium text-primary">{processingInfo.department_label}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Language:</span>
                <p className="font-medium">{processingInfo.language || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Summary:</span>
                <p className="font-medium text-xs bg-background/50 p-2 rounded mt-1 max-h-20 overflow-y-auto">
                  {processingInfo.summary || 'No summary available'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Text Length:</span>
                <p className="font-medium text-xs">
                  {processingInfo.original_text ? `${processingInfo.original_text.length} characters` : '0 characters'}
                </p>
              </div>
              {processingInfo.translated_text && processingInfo.translated_text !== processingInfo.original_text && (
                <div>
                  <span className="text-muted-foreground">Translated:</span>
                  <p className="font-medium text-xs bg-background/30 p-2 rounded mt-1 max-h-16 overflow-y-auto">
                    {processingInfo.translated_text.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Upload a document to see AI analysis results</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="glass rounded-xl p-6 text-center hover-scale">
            <h3 className="text-sm text-muted-foreground mb-2">{stat.label}</h3>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Uploaded Files List */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">Uploaded Files</h3>
        <div className="space-y-3">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(file.status)}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {(file.status === 'uploading' || file.status === 'processing') && (
                  <div className="w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{file.progress}%</span>
                    </div>
                  </div>
                )}
                {file.status === 'completed' && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                      Completed
                    </span>
                    {file.processingResult && (
                      <span className="text-xs text-muted-foreground">
                        → {file.processingResult.department_label}
                      </span>
                    )}
                  </div>
                )}
                {file.status === 'error' && (
                  <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">
                    Failed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;