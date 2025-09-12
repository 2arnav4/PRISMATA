import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import {
  Train,
  Users,
  FileText,
  Calendar,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const API_BASE_URL = 'http://127.0.0.1:5000';

const Dashboard = () => {
  const { user } = useUser();
  const [criticalDocs, setCriticalDocs] = useState([]);

  useEffect(() => {
    const fetchCriticalDocs = async () => {
      if (user.department) {
        try {
          const response = await fetch(`${API_BASE_URL}/documents/latest?department=${user.department}`);
          if (response.ok) {
            const data = await response.json();
            // Assuming the API returns an object with a 'documents' key which is an array
            if (data.documents) {
              // Limiting to the latest 3 documents for display on the dashboard
              setCriticalDocs(data.documents.slice(0, 3));
            }
          } else {
            console.error('Failed to fetch documents');
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      }
    };

    fetchCriticalDocs();
  }, [user.department]);


  // Dummy data for charts
  const visitorData = [
    { day: 'Mo', visitors: 2400 },
    { day: 'Tu', visitors: 1398 },
    { day: 'We', visitors: 3200 },
    { day: 'Th', visitors: 2780 },
    { day: 'Fr', visitors: 3908 },
    { day: 'Sa', visitors: 3800 },
    { day: 'Su', visitors: 2430 }
  ];

  const taskCompletionData = [
    { name: 'Completed', value: 63, color: '#14B8A6' },
    { name: 'Pending', value: 25, color: '#8B5CF6' },
    { name: 'In Progress', value: 12, color: '#2E4C8B' }
  ];

  const tasks = [
    { name: 'Station UI Flow', status: 'Approved', date: '18 Apr 2021', progress: 100 },
    { name: 'Horizon UI Free', status: 'Disable', date: '18 Apr 2021', progress: 30 },
    { name: 'Marketplace', status: 'Error', date: '20 May 2021', progress: 65 },
    { name: 'Weekly Updates', status: 'Approved', date: '12 Jul 2021', progress: 100 }
  ];

  const notifications = [
    { id: 1, text: 'Aiden Parkson', subtext: 'Creative Director', icon: Users },
    { id: 2, text: 'Christian Marl', subtext: 'Project Designer', icon: Users },
    { id: 3, text: 'Jason Statham', subtext: 'Lead UI/UX Designer', icon: Users }
  ];

  // Calendar days
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Hello, {user.name}!
        </h1>
        <p className="text-muted-foreground">Welcome to Kochi Metro Rail Dashboard</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="metric-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Trains Today</p>
              <p className="text-3xl font-bold">21/25</p>
            </div>
            <div className="p-3 bg-accent/20 rounded-lg">
              <Train className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Trains in IBL</p>
              <p className="text-3xl font-bold">3</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Employees Today</p>
              <p className="text-3xl font-bold">432</p>
            </div>
            <div className="p-3 bg-primary/20 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Visitors Chart */}
        <div className="lg:col-span-1 glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Daily Visitors</h3>
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-bold mb-2">2,579</div>
          <p className="text-sm text-muted-foreground mb-4">visitors</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="visitors" fill="#2E4C8B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Critical Documents */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Recent Critical Documents</h3>
          <div className="space-y-3">
            {criticalDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{doc.file_name}</span>
                </div>
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">
                  {doc.department_label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Completion Pie Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Task Completion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={taskCompletionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {taskCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {taskCompletionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="glass rounded-xl p-6 mb-8">
        <h3 className="font-semibold mb-4">Task Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">NAME</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">STATUS</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">DATE</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">PROGRESS</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">
                    <span className="font-medium">{task.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      task.status === 'Approved' ? 'bg-accent/20 text-accent' :
                      task.status === 'Error' ? 'bg-destructive/20 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {task.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                      {task.status === 'Error' && <AlertCircle className="w-3 h-3" />}
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{task.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{task.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calendar and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">September 2024</h3>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day) => (
              <div
                key={day}
                className={`py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                  day === 25 ? 'bg-primary text-primary-foreground' :
                  day === 18 ? 'bg-secondary text-secondary-foreground' :
                  'hover:bg-muted'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Notifications</h3>
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors cursor-pointer">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <notif.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{notif.text}</p>
                  <p className="text-xs text-muted-foreground">{notif.subtext}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 transition-colors">
            See more →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;