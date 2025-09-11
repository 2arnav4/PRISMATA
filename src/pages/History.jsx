import React, { useState } from 'react';
import { History as HistoryIcon, FileText, Download, Eye, Filter, Calendar } from 'lucide-react';

const History = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Dummy history data
  const historyData = [
    {
      id: 1,
      fileName: 'Annual_Safety_Report_2024.pdf',
      type: 'Report',
      date: '2024-09-20',
      status: 'Approved',
      uploadedBy: 'John Doe',
      department: 'Safety',
      size: '4.2 MB'
    },
    {
      id: 2,
      fileName: 'Station_Maintenance_Q3.docx',
      type: 'Schedule',
      date: '2024-09-18',
      status: 'Under Review',
      uploadedBy: 'Jane Smith',
      department: 'Maintenance',
      size: '2.1 MB'
    },
    {
      id: 3,
      fileName: 'Budget_Proposal_2025.xlsx',
      type: 'Budget',
      date: '2024-09-15',
      status: 'Approved',
      uploadedBy: 'Mike Johnson',
      department: 'Finance',
      size: '3.5 MB'
    },
    {
      id: 4,
      fileName: 'Employee_Training_Manual.pdf',
      type: 'Policy',
      date: '2024-09-12',
      status: 'Draft',
      uploadedBy: 'Sarah Williams',
      department: 'HR',
      size: '1.8 MB'
    },
    {
      id: 5,
      fileName: 'Emergency_Response_Protocol.pdf',
      type: 'Policy',
      date: '2024-09-10',
      status: 'Approved',
      uploadedBy: 'Robert Brown',
      department: 'Safety',
      size: '2.4 MB'
    },
    {
      id: 6,
      fileName: 'Vendor_Assessment_Report.docx',
      type: 'Report',
      date: '2024-09-08',
      status: 'Under Review',
      uploadedBy: 'Emily Davis',
      department: 'Operations',
      size: '1.6 MB'
    },
    {
      id: 7,
      fileName: 'Monthly_Performance_Metrics.xlsx',
      type: 'Report',
      date: '2024-09-05',
      status: 'Approved',
      uploadedBy: 'David Wilson',
      department: 'Operations',
      size: '2.8 MB'
    },
    {
      id: 8,
      fileName: 'Station_Expansion_Plan.pdf',
      type: 'Schedule',
      date: '2024-09-02',
      status: 'Draft',
      uploadedBy: 'Lisa Anderson',
      department: 'Planning',
      size: '5.1 MB'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved':
        return 'bg-accent/20 text-accent';
      case 'Under Review':
        return 'bg-secondary/20 text-secondary';
      case 'Draft':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Report':
        return '📊';
      case 'Schedule':
        return '📅';
      case 'Budget':
        return '💰';
      case 'Policy':
        return '📋';
      default:
        return '📄';
    }
  };

  const filteredData = selectedPeriod === 'all' 
    ? historyData 
    : historyData.filter(item => {
        const date = new Date(item.date);
        const now = new Date();
        const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (selectedPeriod === '7days') return daysDiff <= 7;
        if (selectedPeriod === '30days') return daysDiff <= 30;
        if (selectedPeriod === '90days') return daysDiff <= 90;
        return true;
      });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Document History</h1>
          <p className="text-muted-foreground">View and manage your previously uploaded documents</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{historyData.length}</p>
          <p className="text-sm text-muted-foreground">Total Documents</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-accent">
            {historyData.filter(d => d.status === 'Approved').length}
          </p>
          <p className="text-sm text-muted-foreground">Approved</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-secondary">
            {historyData.filter(d => d.status === 'Under Review').length}
          </p>
          <p className="text-sm text-muted-foreground">Under Review</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">
            {historyData.filter(d => d.status === 'Draft').length}
          </p>
          <p className="text-sm text-muted-foreground">Drafts</p>
        </div>
      </div>

      {/* History Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/30 border-b">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">File Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Department</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Uploaded By</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Size</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id} className={`border-b hover:bg-white/20 transition-colors ${
                  index % 2 === 0 ? 'bg-white/5' : ''
                }`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(item.type)}</span>
                      <span className="font-medium">{item.fileName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">{item.type}</td>
                  <td className="py-4 px-6 text-sm">{item.department}</td>
                  <td className="py-4 px-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {item.date}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">{item.uploadedBy}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{item.size}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-accent" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;