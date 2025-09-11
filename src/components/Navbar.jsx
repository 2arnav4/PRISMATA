import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Search, 
  History, 
  User, 
  LogIn, 
  LogOut,
  Train
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload Documents' },
    { path: '/search', icon: Search, label: 'Smart Search' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-primary text-white shadow-2xl z-50">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Train className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">KOCHI</h1>
              <p className="text-xs opacity-80">METRO RAIL LTD</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Sign In/Out Section */}
        <div className="p-4 border-t border-white/20">
          {user.isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="sidebar-link w-full justify-start"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;