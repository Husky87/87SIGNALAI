import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  FileText,
  Users,
  Clock,
  Sparkles,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  X
} from 'lucide-react';
import { Project, DocumentItem } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  documents: DocumentItem[];
  onSelectProject: (proj: Project) => void;
  onCreateProject: (proj: Project) => void;
  onSelectDocument?: (doc: DocumentItem) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  documents,
  onSelectProject,
  onCreateProject,
  onSelectDocument
}) => {
  const [selectedProj, setSelectedProj] = useState<Project | null>(projects[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [catInput, setCatInput] = useState('Municipal & Zoning');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: nameInput,
      description: descInput || 'Project workspace for multi-document intelligence.',
      category: catInput,
      documentIds: documents.slice(0, 2).map((d) => d.id),
      teamMembers: [
        { name: 'ceo@signal87.ai', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Active',
      timelineEvents: [
        { date: new Date().toISOString().split('T')[0], title: 'Project Workspace Initialized', description: 'Created project and assigned default repository files.', type: 'milestone' }
      ],
      notesCount: 1
    };

    onCreateProject(newProj);
    setSelectedProj(newProj);
    setNameInput('');
    setDescInput('');
    setShowCreateModal(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-[#131314] text-[#e3e3e3] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#37393b]">
        <div>
          <h1 className="text-2xl font-bold text-[#e3e3e3] tracking-tight flex items-center gap-2">
            <FolderGit2 size={28} className="text-[#7dd3fc]" /> Project Workspaces
          </h1>
          <p className="text-xs text-[#c4c7c5]">
            Organize multi-document research, team notes, timelines, and conversations into isolated workspaces.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Projects List */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs font-bold text-[#e3e3e3] uppercase tracking-wider block">
            Active Projects ({projects.length})
          </span>

          <div className="space-y-3">
            {projects.map((proj) => {
              const isSelected = selectedProj?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProj(proj)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-[#1a73e8] bg-[#004a77]/30 shadow-md ring-1 ring-[#1a73e8]'
                      : 'border-[#37393b] bg-[#1e1f20] hover:border-[#8e918f]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-[#28292a] text-[#7dd3fc] font-semibold px-2 py-0.5 rounded border border-[#37393b]">
                      {proj.category}
                    </span>
                    <span className="text-[10px] text-[#c4c7c5]">{proj.documentIds.length} Docs</span>
                  </div>

                  <h3 className="font-bold text-[#e3e3e3] text-sm">{proj.name}</h3>
                  <p className="text-xs text-[#c4c7c5] line-clamp-2 leading-relaxed">{proj.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Project Workspace View */}
        <div className="lg:col-span-2">
          {selectedProj ? (
            <div className="bg-[#1e1f20] border border-[#37393b] rounded-2xl p-6 space-y-6">
              {/* Workspace Header */}
              <div className="flex items-start justify-between border-b border-[#37393b] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#7dd3fc]">{selectedProj.category}</span>
                    <span className="text-[10px] bg-[#004a77]/40 text-[#7dd3fc] px-2 py-0.5 rounded font-semibold border border-[#004a77]">
                      {selectedProj.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#e3e3e3]">{selectedProj.name}</h2>
                  <p className="text-xs text-[#c4c7c5]">{selectedProj.description}</p>
                </div>

                <div className="flex -space-x-2">
                  {selectedProj.teamMembers.map((m, idx) => (
                    <img
                      key={idx}
                      src={m.avatar}
                      alt={m.name}
                      className="w-8 h-8 rounded-full border-2 border-[#1e1f20] object-cover"
                      title={`${m.name} (${m.role})`}
                    />
                  ))}
                </div>
              </div>

              {/* Assigned Project Documents */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#e3e3e3] uppercase tracking-wider block">
                  Assigned Repository Documents ({selectedProj.documentIds.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents
                    .filter((d) => selectedProj.documentIds.includes(d.id))
                    .map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => onSelectDocument?.(doc)}
                        className="p-3 bg-[#28292a] hover:bg-[#37393b] border border-[#37393b] hover:border-[#7dd3fc] rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText size={16} className="text-[#7dd3fc] flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-[#e3e3e3] group-hover:text-[#7dd3fc] truncate">{doc.title}</span>
                        </div>
                        <span className="text-[10px] text-[#c4c7c5] font-mono flex-shrink-0">{(doc.sizeBytes / 1000000).toFixed(1)}MB</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#c4c7c5] text-xs">
              Select a project from the left list.
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1f20] rounded-3xl max-w-md w-full p-6 border border-[#37393b] space-y-4 text-[#e3e3e3]">
            <div className="flex items-center justify-between border-b border-[#37393b] pb-3">
              <h2 className="text-base font-bold text-[#e3e3e3]">Create Project Workspace</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-[#c4c7c5] hover:text-[#e3e3e3] cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#c4c7c5] mb-1">Project Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Merger Analysis & Antitrust Review"
                  className="w-full px-3 py-2 bg-[#131314] border border-[#37393b] rounded-xl text-xs text-[#e3e3e3] placeholder-[#c4c7c5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#c4c7c5] mb-1">Category</label>
                <select
                  value={catInput}
                  onChange={(e) => setCatInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#131314] border border-[#37393b] rounded-xl text-xs text-[#e3e3e3]"
                >
                  <option value="Municipal & Zoning">Municipal & Zoning</option>
                  <option value="Legislative Intelligence">Legislative Intelligence</option>
                  <option value="Regulatory Compliance">Regulatory Compliance</option>
                  <option value="Venture Capital">Venture Capital</option>
                  <option value="Legal Review">Legal Review</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#c4c7c5] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Scope and research objectives for this workspace..."
                  className="w-full px-3 py-2 bg-[#131314] border border-[#37393b] rounded-xl text-xs text-[#e3e3e3] placeholder-[#c4c7c5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Create Workspace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
