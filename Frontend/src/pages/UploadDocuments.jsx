import React, { useState } from 'react';
import { Upload, File, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

const UploadDocuments = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Safety_Report_Q3_2024.pdf', status: 'completed', size: '2.4 MB' },
    { id: 2, name: 'Station_Maintenance_Schedule.docx', status: 'uploading', size: '1.1 MB', progress: 65 },
    { id: 3, name: 'Budget_Analysis_2024.xlsx', status: 'error', size: '3.2 MB' }
  ]);

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

  const handleFiles = (files) => {
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      status: 'uploading',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 0
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(interval);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
            )
          );
        } else {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id ? { ...f, progress } : f
            )
          );
        }
      }, 200);
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'uploading':
        return <Clock className="w-5 h-5 text-secondary animate-spin" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const stats = [
    { label: "Today's Upload", value: 12, color: 'text-accent' },
    { label: 'Pending Reviews', value: 5, color: 'text-destructive' },
    { label: 'Awaiting Assignment', value: 3, color: 'text-secondary' }
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
              Select your file or drag and drop
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              PNG, PDF, JPG, DOCX accepted
            </p>
            <label className="btn-primary cursor-pointer">
              Browse
              <input
                type="file"
                className="hidden"
                multiple
                accept=".png,.pdf,.jpg,.jpeg,.docx"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>

        {/* Document Preview */}
        <div className="glass rounded-xl p-6 border-2 border-primary">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Document Preview
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Title:</span>
              <p className="font-medium">Department Report</p>
            </div>
            <div>
              <span className="text-muted-foreground">Department:</span>
              <p className="font-medium">Operations</p>
            </div>
            <div>
              <span className="text-muted-foreground">Language:</span>
              <p className="font-medium">(English/Malayalam)</p>
            </div>
            <div>
              <span className="text-muted-foreground">Priority:</span>
              <p className="font-medium">(High/Medium/Low)</p>
            </div>
          </div>
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
                {file.status === 'uploading' && (
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
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    Completed
                  </span>
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