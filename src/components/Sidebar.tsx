import React from 'react';
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Bot,
  Scale,
  GitFork,
  BookOpen,
  FileSpreadsheet,
  Search,
  Users,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  LogIn,
  LogOut,
  User as UserIcon,
  Plus,
  MessageSquare,
  Clock,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { Signal87Logo } from './Signal87Logo';
import { auth, googleProvider, signInWithPopup, signOut, User } from '../lib/firebase';

export type NavTab =
  | 'dashboard'
  | 'documents'
  | 'projects'
  | 'research'
  | 'compare'
  | 'reports'
  | 'searches'
  | 'team'
  | 'organization'
  | 'admin';

export interface ChatSessionSummary {
  id: string;
  title: string;
  timestamp: string;
  preview?: string;
}

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  documentCount: number;
  projectCount: number;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  currentUser?: User | null;
  onNewSession?: () => void;
  recentSessions?: ChatSessionSummary[];
  activeSessionId?: string | null;
  onSelectSession?: (id: string) => void;
  onDeleteSession?: (id: string) => void;
  onOpenDrivePicker?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  documentCount,
  projectCount,
  mobileMenuOpen = false,
  onCloseMobileMenu,
  currentUser,
  onNewSession,
  recentSessions = [],
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onOpenDrivePicker
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<any>; badge?: string | number; isFlagship?: boolean }[] = [
    { id: 'research', label: 'AI Workspace', icon: Bot, isFlagship: true, badge: 'Unified' },
    { id: 'documents', label: 'Documents', icon: FileText, badge: documentCount },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: projectCount },
    { id: 'admin', label: 'Settings & Admin', icon: Settings }
  ];

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      if (onCloseMobileMenu) onCloseMobileMenu();
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (onCloseMobileMenu) onCloseMobileMenu();
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const mainContent = (
    <div className="flex flex-col justify-between h-full bg-[#1e1f20] text-[#e3e3e3] select-none">
      {/* Brand & New Chat Header */}
      <div className="space-y-3">
        {/* Top Header */}
        <div className="h-14 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <button
              onClick={() => {
                onSelectTab('dashboard');
                if (onCloseMobileMenu) onCloseMobileMenu();
              }}
              className="p-2 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <Signal87Logo size={28} />
            {(!collapsed || mobileMenuOpen) && (
              <span className="font-semibold text-[#e3e3e3] text-sm tracking-tight truncate">
                Signal87 AI
              </span>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-2 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          {mobileMenuOpen && (
            <button
              onClick={onCloseMobileMenu}
              className="md:hidden p-2 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* New Chat Pill Button */}
        <div className="px-1">
          <button
            onClick={() => {
              if (onNewSession) onNewSession();
              onSelectTab('research');
              if (onCloseMobileMenu) onCloseMobileMenu();
            }}
            className={`w-full rounded-full bg-[#1a1a1c] hover:bg-[#28292a] text-[#e3e3e3] px-4 py-3 flex items-center gap-3 text-sm font-medium transition-all cursor-pointer shadow-xs border border-[#37393b]/40 ${
              collapsed && !mobileMenuOpen ? 'justify-center px-2' : ''
            }`}
            title="Start new chat"
          >
            <Plus size={18} strokeWidth={2.2} className="flex-shrink-0 text-[#7dd3fc]" />
            {(!collapsed || mobileMenuOpen) && <span>New chat</span>}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="px-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobileMenu) onCloseMobileMenu();
                }}
                className={`w-full rounded-full px-3.5 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#004a77] text-[#e3e3e3]'
                    : 'text-[#c4c7c5] hover:bg-[#28292a] hover:text-[#e3e3e3]'
                } ${collapsed && !mobileMenuOpen ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {(!collapsed || mobileMenuOpen) && (
                  <span className="truncate flex-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="text-[10px] bg-[#37393b] text-[#c4c7c5] px-2 py-0.5 rounded-full font-mono font-medium">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}

          {onOpenDrivePicker && (
            <button
              onClick={() => {
                if (onCloseMobileMenu) onCloseMobileMenu();
                onOpenDrivePicker();
              }}
              className={`w-full rounded-full px-3.5 py-2 text-xs font-semibold flex items-center gap-3 transition-colors text-left cursor-pointer text-sky-300 hover:bg-[#28292a] bg-sky-950/30 border border-sky-800/40 mt-1 ${
                collapsed && !mobileMenuOpen ? 'justify-center px-2' : ''
              }`}
              title={collapsed ? 'Google Drive Hub' : undefined}
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 87.3 78">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.9 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.4.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.4-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                <path d="m43.65 25 13.75 23.8h27.5c0-1.55-.4-3.1-1.2-4.5l-25.4-44c-.8-1.4-1.9-2.5-3.3-3.3z" fill="#00832d"/>
                <path d="m57.4 48.8-13.75 23.8c1.4.8 2.95 1.2 4.5 1.2h54.8c1.55 0 3.1-.4 4.5-1.2l-13.75-23.8z" fill="#2684fc"/>
                <path d="m13.75 25 13.75 23.8 13.75-23.8-13.75-23.8z" fill="#ffba00"/>
              </svg>
              {(!collapsed || mobileMenuOpen) && (
                <span className="truncate flex-1 flex items-center justify-between">
                  <span>Google Drive Hub</span>
                  <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                    Sync
                  </span>
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Threads List */}
        {(!collapsed || mobileMenuOpen) && recentSessions.length > 0 && (
          <div className="pt-2 px-1 space-y-1 border-t border-[#28292a]">
            <div className="px-3 py-1.5 text-xs font-semibold text-[#8e918f] uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} /> Recent
            </div>
            <div className="max-h-[calc(100vh-22rem)] overflow-y-auto space-y-0.5 pr-1">
              {recentSessions.map((session) => {
                const isActive = activeSessionId === session.id && currentTab === 'research';
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      if (onSelectSession) onSelectSession(session.id);
                      onSelectTab('research');
                      if (onCloseMobileMenu) onCloseMobileMenu();
                    }}
                    className={`rounded-full px-3 py-2 text-sm text-[#c4c7c5] hover:bg-[#28292a] flex items-center justify-between group cursor-pointer transition-colors ${
                      isActive ? 'bg-[#004a77] text-[#e3e3e3] font-medium' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                      <MessageSquare size={16} className="flex-shrink-0 text-[#c4c7c5]" />
                      <span className="truncate">{session.title}</span>
                    </div>
                    {onDeleteSession && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="hidden group-hover:block p-1 text-[#c4c7c5] hover:text-rose-400 hover:bg-[#37393b] rounded-full transition-colors cursor-pointer"
                        title="Delete thread"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer User Info / Admin Link */}
      <div className="p-2 border-t border-[#28292a]">
        {(!collapsed || mobileMenuOpen) ? (
          <div
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#28292a] transition-colors cursor-pointer"
            onClick={() => {
              onSelectTab('admin');
              if (onCloseMobileMenu) onCloseMobileMenu();
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#004a77] text-[#e3e3e3] font-bold flex items-center justify-center text-xs">
                  {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#e3e3e3] truncate">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Researcher'}
                </span>
                <span className="text-[10px] text-[#c4c7c5] truncate">Enterprise Plan</span>
              </div>
            </div>
            <Settings size={16} className="text-[#c4c7c5]" />
          </div>
        ) : (
          <button
            onClick={() => onSelectTab('admin')}
            className="w-full flex justify-center p-2 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
            title="Settings & Admin"
          >
            <Settings size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex w-64 flex-shrink-0 bg-[#1e1f20] h-full flex-col justify-between p-3 border-r border-[#28292a] transition-all duration-300 relative z-20 ${
          collapsed ? 'w-20 p-2' : 'w-64'
        }`}
      >
        {mainContent}
      </aside>

      {/* Mobile Slide-over Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40 transition-opacity"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-[#1e1f20] border-r border-[#28292a] text-[#e3e3e3] p-3 transform transition-transform duration-300 shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {mainContent}
      </div>
    </>
  );
};


