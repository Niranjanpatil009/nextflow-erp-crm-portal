import React from 'react';
import { User } from '../types';
import { USERS } from '../server/store';
import { api, setAuthSession } from '../lib/api';
import {
  Building2,
  Users,
  Package,
  FileText,
  LayoutDashboard,
  ShieldAlert,
  Code2,
  LogOut,
  ChevronDown,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lowStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  activeTab,
  setActiveTab,
  lowStockCount,
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const handleSwitchUser = async (u: typeof USERS[0]) => {
    try {
      const res = await api.login(u.email, u.password);
      onUserChange(res.user);
    } catch (err) {
      console.error('Login error during role switch:', err);
      // Fallback
      const userPayload = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        avatarUrl: u.avatarUrl,
      };
      onUserChange(userPayload);
    } finally {
      setShowRoleMenu(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer CRM', icon: Users },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, badge: lowStockCount },
    { id: 'challans', label: 'Sales Challans', icon: FileText },
    { id: 'apidocs', label: 'API & Dev Hub', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#09090b] border-b border-[#27272a] text-zinc-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Quick Role Switcher */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 text-sm">
                Ω
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    OPERA ERP
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    BENTO v2.4
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Operations Portal</p>
              </div>
            </div>

            {/* Role Quick Selector Switcher (Bento Pill Style) */}
            <div className="hidden lg:flex items-center gap-1 bg-[#18181b] p-1 rounded-lg border border-[#27272a]">
              {USERS.map(u => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSwitchUser(u)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'bg-[#27272a] text-white shadow-sm'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {u.role.substring(0, 4)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#18181b] text-white border border-[#27272a] shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-[#18181b]/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Card */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#18181b] hover:bg-[#27272a]/80 border border-[#27272a] transition-all text-left"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-zinc-100">{currentUser.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">{currentUser.role} ROLE</p>
              </div>
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#27272a]"
              />
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {/* Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-[#27272a] mb-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Switch Test Account</p>
                  <p className="text-[11px] text-zinc-400">Instantly switch roles for permissions testing</p>
                </div>

                <div className="space-y-1">
                  {USERS.map(u => {
                    const isCurrent = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all ${
                          isCurrent
                            ? 'bg-[#18181b] text-white border border-[#27272a]'
                            : 'hover:bg-[#18181b]/60 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <p className="font-medium text-zinc-200">{u.name}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">{u.department}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                            u.role === 'Admin'
                              ? 'bg-purple-500/20 text-purple-300'
                              : u.role === 'Sales'
                              ? 'bg-blue-500/20 text-blue-300'
                              : u.role === 'Warehouse'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Tab bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#27272a] text-xs overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-zinc-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
