import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { User, Mail, Phone, Building, MapPin, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || 'John Doe',
    role: user.role || 'Operations Manager',
    department: user.department || 'Operations',
    email: user.email || 'john.doe@kochimetro.org',
    phone: '+91 98765 43210',
    location: 'Kochi, Kerala',
    employeeId: 'KMR-2024-001',
    joinDate: '2020-03-15'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-muted-foreground">{profileData.role}</p>
                <p className="text-sm text-primary">Employee ID: {profileData.employeeId}</p>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={isEditing ? 'btn-primary' : 'btn-secondary'}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2 inline" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2 inline" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="input-field flex-1"
                    />
                  ) : (
                    <span className="font-medium">{profileData.name}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="input-field flex-1"
                    />
                  ) : (
                    <span className="font-medium">{profileData.email}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="input-field flex-1"
                    />
                  ) : (
                    <span className="font-medium">{profileData.phone}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Department</label>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  {isEditing ? (
                    <select
                      value={profileData.department}
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      className="input-field flex-1"
                    >
                      <option>Operations</option>
                      <option>Maintenance</option>
                      <option>Safety</option>
                      <option>HR</option>
                      <option>Finance</option>
                    </select>
                  ) : (
                    <span className="font-medium">{profileData.department}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Location</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="input-field flex-1"
                    />
                  ) : (
                    <span className="font-medium">{profileData.location}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Join Date</label>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{profileData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;