import React from 'react';
import {
  FileText,
  FolderGit2,
  HardDrive,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Layers
} from 'lucide-react';
import { DocumentItem, Project, OrgStats } from '../types';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  documents: DocumentItem[];
  projects: Project[];
  stats: OrgStats;
  onSelectTab: (tab: NavTab) => void;
  onOpenUpload: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onSelectProject: (proj: Project) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  projects,
  stats,
  onSelectTab,
  onOpenUpload,
  onSelectDocument,
  onSelectProject
}) => {
  const storagePercentage = Math.round((stats.storageUsedBytes / stats.storageCapacityBytes) * 100);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-[#131314] text-[#e3e3e3] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Hero Welcome Banner */}
      <div className="bg-[#1e1f20] border border-[#37393b] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#004a77]/40 text-[#7dd3fc] border border-[#004a77] rounded-full text-xs font-mono font-bold tracking-wide">
              <Sparkles size={12} /> SIGNAL87 FOR ENTERPRISE MEMORY
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e3e3e3] tracking-tight leading-tight">
              Your document memory, available in every chat.
            </h1>
            <p className="text-[#c4c7c5] text-sm leading-relaxed">
              Ask Signal87 for any answer you have already verified. Find the exact table, calculation, person, amount, citation, or source without rebuilding the analysis.
            </p>

            {/* MCP Endpoint Box */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectTab('research')}
                className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Connect MCP Assistant</span>
                <ArrowUpRight size={15} />
              </button>

              <div className="flex items-center gap-2 px-3 py-2 bg-[#28292a] border border-[#37393b] rounded-xl text-xs font-mono text-[#e3e3e3]">
                <span className="text-[#c4c7c5] font-semibold uppercase text-[10px]">MCP Endpoint</span>
                <span className="font-bold text-[#7dd3fc]">signal87.ai/mcp</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#c4c7c5] font-medium pt-1">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#7dd3fc]" /> OAuth 2.1 + PKCE</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#7dd3fc]" /> Read-only access</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#7dd3fc]" /> Evidence links preserved</span>
            </div>
          </div>

          {/* Right Card Mockup Preview */}
          <div className="w-full lg:w-80 bg-[#131314] text-white p-5 rounded-2xl border border-[#37393b] shadow-xl space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-[#37393b]">
              <span className="text-xs font-bold tracking-tight text-[#e3e3e3]">Signal87 Memory</span>
              <span className="text-[10px] bg-[#004a77]/40 text-[#7dd3fc] border border-[#004a77] px-2 py-0.5 rounded-full font-mono font-bold">Connected</span>
            </div>
            <p className="text-xs text-[#c4c7c5] font-medium">
              Search your private document intelligence and retrieve complete evidence-backed answers.
            </p>
            <div className="p-2.5 bg-[#1e1f20] rounded-xl border border-[#37393b] space-y-1">
              <span className="text-[10px] text-[#7dd3fc] font-mono flex items-center gap-1 font-semibold">
                <Sparkles size={10} /> SEARCHING SIGNAL87
              </span>
              <p className="text-[11px] font-bold text-[#e3e3e3]">Found 3 relevant saved analyses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Document Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#1e1f20] p-5 rounded-2xl border border-[#37393b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[#c4c7c5]">Repository Documents</span>
            <div className="text-2xl font-bold text-[#e3e3e3]">{stats.totalDocs}</div>
            <span className="text-[11px] text-[#7dd3fc] font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> 100% AI Indexed & Structured
            </span>
          </div>
          <div className="w-12 h-12 bg-[#28292a] text-[#7dd3fc] rounded-2xl flex items-center justify-center">
            <FileText size={22} />
          </div>
        </div>

        <div className="bg-[#1e1f20] p-5 rounded-2xl border border-[#37393b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[#c4c7c5]">Active Workspaces</span>
            <div className="text-2xl font-bold text-[#e3e3e3]">{stats.activeProjects}</div>
            <span className="text-[11px] text-[#c4c7c5] font-medium">Cross-functional team projects</span>
          </div>
          <div className="w-12 h-12 bg-[#28292a] text-[#7dd3fc] rounded-2xl flex items-center justify-center">
            <FolderGit2 size={22} />
          </div>
        </div>

        <div className="bg-[#1e1f20] p-5 rounded-2xl border border-[#37393b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[#c4c7c5]">Vector Embeddings</span>
            <div className="text-2xl font-bold text-[#e3e3e3]">{stats.totalEmbeddings.toLocaleString()}</div>
            <span className="text-[11px] text-[#c4c7c5] font-mono">signal87-embedding-v2</span>
          </div>
          <div className="w-12 h-12 bg-[#28292a] text-amber-300 rounded-2xl flex items-center justify-center">
            <Layers size={22} />
          </div>
        </div>

        <div className="bg-[#1e1f20] p-5 rounded-2xl border border-[#37393b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[#c4c7c5]">Storage Usage</span>
            <div className="text-2xl font-bold text-[#e3e3e3]">
              {(stats.storageUsedBytes / 1000000).toFixed(0)} MB
            </div>
            <div className="w-32 bg-[#28292a] h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#1a73e8] h-full rounded-full" style={{ width: `${storagePercentage}%` }} />
            </div>
          </div>
          <div className="w-12 h-12 bg-[#28292a] text-[#c4c7c5] rounded-2xl flex items-center justify-center">
            <HardDrive size={22} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Sections */}
      <div className="space-y-8">
        {/* Recent Projects & Recent Uploads */}
        <div className="space-y-8">
          {/* Recent Projects */}
          <div className="bg-[#1e1f20] rounded-2xl border border-[#37393b] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#e3e3e3]">Recent Projects</h2>
                <p className="text-xs text-[#c4c7c5]">Organized team intelligence folders</p>
              </div>
              <button
                onClick={() => onSelectTab('projects')}
                className="text-xs font-semibold text-[#7dd3fc] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All ({projects.length}) <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="p-4 rounded-xl border border-[#37393b] hover:border-[#7dd3fc] transition-all cursor-pointer bg-[#28292a] hover:bg-[#37393b]/60 group"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#004a77]/40 text-[#7dd3fc] font-mono border border-[#004a77]">
                      {proj.category}
                    </span>
                    <span className="text-[10px] text-[#c4c7c5]">{proj.documentIds.length} Docs</span>
                  </div>
                  <h3 className="font-bold text-[#e3e3e3] text-sm mt-2 group-hover:text-[#7dd3fc] transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-[#c4c7c5] line-clamp-2 mt-1">{proj.description}</p>
                  <div className="mt-4 pt-3 border-t border-[#37393b] flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {proj.teamMembers.map((m, idx) => (
                        <img
                          key={idx}
                          src={m.avatar}
                          alt={m.name}
                          className="w-5 h-5 rounded-full border border-[#1e1f20] object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#c4c7c5] font-medium">Updated 1d ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Document Uploads */}
          <div className="bg-[#1e1f20] rounded-2xl border border-[#37393b] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#e3e3e3]">Recent Uploads</h2>
                <p className="text-xs text-[#c4c7c5]">Latest parsed & structured enterprise documents</p>
              </div>
              <button
                onClick={() => onSelectTab('documents')}
                className="text-xs font-semibold text-[#7dd3fc] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Document Library ({documents.length}) <ChevronRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-[#28292a]">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="py-3 flex items-center justify-between hover:bg-[#28292a] px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#28292a] text-[#e3e3e3] flex items-center justify-center font-bold text-xs uppercase group-hover:bg-[#1a73e8] group-hover:text-white transition-colors">
                      {doc.type}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#e3e3e3] text-sm group-hover:text-[#7dd3fc] transition-colors">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#c4c7c5]">{(doc.sizeBytes / 1000000).toFixed(1)} MB</span>
                        <span className="text-[10px] text-[#37393b]">•</span>
                        <span className="text-[10px] text-[#c4c7c5]">{doc.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-[#7dd3fc] bg-[#004a77]/30 px-2 py-0.5 rounded border border-[#004a77] flex items-center gap-1">
                      <CheckCircle2 size={10} /> AI Ready
                    </span>
                    <ChevronRight size={16} className="text-[#37393b] group-hover:text-[#c4c7c5]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
