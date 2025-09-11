import React, { useState } from 'react';
import { Search, Filter, ChevronDown, FileText, Calendar, Tag, Building } from 'lucide-react';

const SmartSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    department: '',
    type: '',
    priority: '',
    dateRange: '',
    language: '',
    status: ''
  });

  const filterOptions = {
    department: ['Operations', 'Maintenance', 'Safety', 'HR', 'Finance'],
    type: ['Report', 'Policy', 'Memo', 'Schedule', 'Budget'],
    priority: ['High', 'Medium', 'Low'],
    dateRange: ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year'],
    language: ['English', 'Malayalam', 'Both'],
    status: ['Active', 'Archived', 'Draft', 'Under Review']
  };

  // Dummy search results
  const searchResults = [
    {
      id: 1,
      title: 'Q3 2024 Safety Compliance Report',
      type: 'Report',
      department: 'Safety',
      date: '2024-09-15',
      priority: 'High',
      description: 'Comprehensive safety audit and compliance assessment for third quarter operations.'
    },
    {
      id: 2,
      title: 'Station Maintenance Schedule Update',
      type: 'Schedule',
      department: 'Maintenance',
      date: '2024-09-10',
      priority: 'Medium',
      description: 'Updated maintenance schedule for all metro stations including preventive measures.'
    },
    {
      id: 3,
      title: 'Employee Training Program Guidelines',
      type: 'Policy',
      department: 'HR',
      date: '2024-09-05',
      priority: 'Medium',
      description: 'New guidelines for employee training and development programs across all departments.'
    },
    {
      id: 4,
      title: 'Budget Allocation FY 2024-25',
      type: 'Budget',
      department: 'Finance',
      date: '2024-08-28',
      priority: 'High',
      description: 'Annual budget allocation and financial planning for fiscal year 2024-25.'
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High':
        return 'bg-destructive/20 text-destructive';
      case 'Medium':
        return 'bg-secondary/20 text-secondary';
      case 'Low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Smart Search</h1>

      {/* Search Bar */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents, policies, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filter By
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-6 p-4 bg-white/30 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(filterOptions).map(([filterType, options]) => (
                <div key={filterType}>
                  <label className="block text-sm font-medium text-muted-foreground mb-2 capitalize">
                    {filterType}
                  </label>
                  <select
                    value={selectedFilters[filterType]}
                    onChange={(e) => handleFilterChange(filterType, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All</option>
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {Object.values(selectedFilters).some(filter => filter) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(selectedFilters).map(([key, value]) => 
            value && (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {value}
                <button
                  onClick={() => handleFilterChange(key, value)}
                  className="ml-1 hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            )
          )}
          <button
            onClick={() => setSelectedFilters({
              department: '',
              type: '',
              priority: '',
              dateRange: '',
              language: '',
              status: ''
            })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Found {searchResults.length} results
        </p>
        
        {searchResults.map((result) => (
          <div key={result.id} className="glass rounded-xl p-6 hover-scale cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(result.priority)}`}>
                {result.priority}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {result.type}
              </div>
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {result.department}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {result.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartSearch;