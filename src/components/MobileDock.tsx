// ============================================================
// src/components/MobileDock.tsx   (NEW FILE)
//
// Bottom navigation for mobile. Replaces reaching for the
// hamburger menu at the top left. Hidden at md and above,
// where the existing Sidebar takes over.
// ============================================================

import React from 'react';
import { FileText, Bot, Plus, FolderGit2, Menu } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileDockProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNewSession: () => void;
  onOpenMenu: () => void;
  documentCount?: number;
}

export const MobileDock: React.FC<MobileDockProps> = ({
  currentTab,
  onSelectTab,
  onNewSession,
  onOpenMenu,
  documentCount
}) => {
  const Tab = ({
    id,
    label,
    Icon,
    badge
  }: {
    id: NavTab;
    label: string;
    Icon: React.ComponentType<any>;
    badge?: number;
  }) => {
    const active = currentTab === id;
    return (
      <button
        onClick={() => onSelectTab(id)}
        aria-current={active ? 'page' : undefined}
        aria-label={label}
        className={`relative flex-1 min-w-0 min-h-[44px] flex flex-col items-center justify-start gap-1 pt-0.5 cursor-pointer transition-colors ${
          active ? 'text-[#131C25]' : 'text-[#6E7C89]'
        }`}
      >
        <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
        <span className="text-[9px] font-semibold tracking-wide uppercase leading-none">
          {label}
        </span>
        {typeof badge === 'number' && badge > 0 && (
          <span className="absolute top-0 right-1/2 translate-x-4 min-w-[15px] h-[15px] px-1 rounded-full bg-[#1A73E8] text-white text-[9px] font-bold flex items-center justify-center">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <nav
      aria-label="Primary"
      className="s87-dock md:hidden flex items-start flex-shrink-0 px-1.5 pt-2 bg-white/95 backdrop-blur-xl border-t border-[#D3D9DE] z-40"
    >
      <Tab id="documents" label="Files" Icon={FileText} badge={documentCount} />
      <Tab id="research" label="Ask" Icon={Bot} />

      <button
        onClick={onNewSession}
        aria-label="New session"
        className="flex-1 min-w-0 min-h-[44px] flex flex-col items-center justify-start gap-1 -mt-1 cursor-pointer"
      >
        <span className="w-[30px] h-[30px] rounded-full bg-[#F0B429] text-[#131C25] flex items-center justify-center shadow-sm">
          <Plus size={18} strokeWidth={2.6} />
        </span>
        <span className="text-[9px] font-semibold tracking-wide uppercase leading-none text-[#131C25]">
          New
        </span>
      </button>

      <Tab id="projects" label="Projects" Icon={FolderGit2} />

      <button
        onClick={onOpenMenu}
        aria-label="More"
        className="flex-1 min-w-0 min-h-[44px] flex flex-col items-center justify-start gap-1 pt-0.5 text-[#6E7C89] cursor-pointer"
      >
        <Menu size={22} strokeWidth={1.8} />
        <span className="text-[9px] font-semibold tracking-wide uppercase leading-none">
          More
        </span>
      </button>
    </nav>
  );
};
