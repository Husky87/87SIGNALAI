import React, { useState } from 'react';
import {
  FileText,
  Search,
  Grid,
  List,
  Upload,
  CheckCircle2,
  GitFork,
  Trash2,
  Eye,
  Check,
  X,
  FileQuestion,
  Sparkles
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentLibraryViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenUpload: () => void;
  onOpenDrivePicker?: () => void;
  onCompareSelected: (docs: DocumentItem[]) => void;
  onDeleteDocument: (docId: string) => void;
}

export const DocumentLibraryView: React.FC<DocumentLibraryViewProps> = ({
  documents,
  onSelectDocument,
  onOpenUpload,
  onOpenDrivePicker,
  onCompareSelected,
  onDeleteDocument
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  const categories = ['All', 'Legal', 'Legislative', 'Financial', 'Research'];

  const filteredDocs = documents.filter((doc) => {
    const query = searchFilter.toLowerCase().trim();
    if (!query) {
      const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
      return matchesCategory;
    }

    const matchesTitle = doc.title.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'All' || doc.category.toLowerCase().includes(query);
    const matchesType = doc.type.toLowerCase().includes(query);
    const matchesOwner = doc.owner.toLowerCase().includes(query);
    const matchesTags = doc.tags.some((t) => t.toLowerCase().includes(query));
    const matchesSummary = doc.summary?.toLowerCase().includes(query) ?? false;
    const matchesPreview = doc.contentPreview?.toLowerCase().includes(query) ?? false;

    const matchesSearch =
      matchesTitle || matchesCategory || matchesType || matchesOwner || matchesTags || matchesSummary || matchesPreview;
    const categoryMatch = categoryFilter === 'All' || doc.category === categoryFilter;

    return matchesSearch && categoryMatch;
  });

  const toggleSelectDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedDocIds.includes(id)) {
      setSelectedDocIds(selectedDocIds.filter((item) => item !== id));
    } else {
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  const handleCompareTrigger = () => {
    const docsToCompare = documents.filter((d) => selectedDocIds.includes(d.id));
    if (docsToCompare.length >= 2) {
      onCompareSelected(docsToCompare);
    } else if (docsToCompare.length === 1) {
      onSelectDocument(docsToCompare[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1000000) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1000000).toFixed(1)} MB`;
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#131314] text-[#e3e3e3] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Top Banner / Actions bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#8e918f] uppercase tracking-widest block">
            DOCUMENTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e3e3e3] tracking-tight mt-0.5">
            Your documents
          </h1>
          <p className="text-xs sm:text-sm text-[#c4c7c5] font-medium mt-1">
            Open one or select several to analyze.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-start sm:justify-end">
          <span className="text-xs font-semibold text-[#8e918f] hidden sm:inline-block mr-2">
            {filteredDocs.length} total
          </span>

          <button
            onClick={handleCompareTrigger}
            disabled={selectedDocIds.length === 0}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
              selectedDocIds.length > 0
                ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0]'
                : 'bg-[#28292a] text-[#8e918f] cursor-not-allowed'
            }`}
          >
            <Sparkles size={14} className={selectedDocIds.length > 0 ? 'text-amber-300' : ''} />
            Analyze {selectedDocIds.length > 0 ? `(${selectedDocIds.length})` : ''}
          </button>

          {onOpenDrivePicker && (
            <button
              onClick={onOpenDrivePicker}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-sky-400/30"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 87.3 78">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.9 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.4.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.4-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                <path d="m43.65 25 13.75 23.8h27.5c0-1.55-.4-3.1-1.2-4.5l-25.4-44c-.8-1.4-1.9-2.5-3.3-3.3z" fill="#00832d"/>
                <path d="m57.4 48.8-13.75 23.8c1.4.8 2.95 1.2 4.5 1.2h54.8c1.55 0 3.1-.4 4.5-1.2l-13.75-23.8z" fill="#2684fc"/>
                <path d="m13.75 25 13.75 23.8 13.75-23.8-13.75-23.8z" fill="#ffba00"/>
              </svg>
              <span>Port from Google Drive</span>
            </button>
          )}

          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-2xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Upload size={14} /> Upload
          </button>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        {/* Capsule Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c4c7c5] pointer-events-none" size={16} />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search documents"
            className="w-full pl-11 pr-9 py-2.5 bg-[#1e1f20] border border-[#37393b] rounded-full text-xs text-[#e3e3e3] placeholder-[#c4c7c5] focus:outline-none focus:border-[#8e918f] transition-all"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c7c5] hover:text-[#e3e3e3] p-1 rounded-full cursor-pointer"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter Pills & View Mode */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto scrollbar-none pb-1">
          <div className="flex items-center gap-1.5 py-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#004a77] text-[#e3e3e3]'
                    : 'bg-[#1e1f20] border border-[#37393b] text-[#c4c7c5] hover:bg-[#28292a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#1e1f20] p-1 rounded-xl border border-[#37393b] flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-[#c4c7c5] transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#28292a] text-[#e3e3e3] font-bold' : 'hover:bg-[#28292a]'
              }`}
              title="Grid view"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-[#c4c7c5] transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#28292a] text-[#e3e3e3] font-bold' : 'hover:bg-[#28292a]'
              }`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="bg-[#1e1f20] border border-[#37393b] rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-14 h-14 bg-[#28292a] text-[#c4c7c5] rounded-2xl flex items-center justify-center mx-auto">
            <FileQuestion size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#e3e3e3] text-base">No Documents Found</h3>
            <p className="text-xs text-[#c4c7c5] leading-relaxed">
              We couldn't find any documents matching your current filter. Try searching for another keyword or upload a file.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchFilter('');
                setCategoryFilter('All');
              }}
              className="px-4 py-2 bg-[#28292a] hover:bg-[#37393b] text-[#e3e3e3] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload size={14} /> Upload
            </button>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && filteredDocs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
          {filteredDocs.map((doc) => {
            const isSelected = selectedDocIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className={`bg-[#1e1f20] rounded-3xl border transition-all flex flex-col justify-between overflow-hidden cursor-pointer group ${
                  isSelected ? 'border-red-500 ring-2 ring-red-500/20' : 'border-[#37393b] hover:border-[#8e918f]'
                }`}
              >
                {/* Top Document Graphic Area */}
                <div className="bg-[#28292a] h-48 rounded-2xl m-2.5 p-3 relative flex flex-col items-center justify-center border border-[#37393b] group-hover:bg-[#37393b]/60 transition-colors">
                  {/* Top-Right Selection Checkbox */}
                  <button
                    onClick={(e) => toggleSelectDoc(doc.id, e)}
                    className={`absolute top-3 right-3 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-[#37393b] bg-[#1e1f20] hover:border-[#8e918f] text-transparent'
                    }`}
                  >
                    <Check size={13} strokeWidth={3} className={isSelected ? 'block' : 'hidden'} />
                  </button>

                  {/* Red PDF Icon Badge */}
                  <div className="w-16 h-20 bg-[#d9383a] rounded-xl shadow-md flex flex-col items-center justify-center relative overflow-hidden transform group-hover:scale-105 transition-transform duration-200">
                    <div className="absolute top-0 right-0 w-4 h-4 bg-red-900/40 rounded-bl-md" />
                    <span className="text-white font-black text-xs tracking-wider">PDF</span>
                  </div>
                  <span className="text-[10px] font-black text-[#d9383a] uppercase tracking-widest mt-2.5">
                    {doc.type}
                  </span>
                </div>

                {/* Bottom Details Area */}
                <div className="p-3.5 space-y-2.5 bg-[#1e1f20]">
                  {/* Title Pill Box */}
                  <div className="bg-[#131314] border border-[#37393b] rounded-xl px-3 py-2 group-hover:border-[#7dd3fc]/60 transition-colors">
                    <span className="font-semibold text-[#e3e3e3] text-xs truncate block group-hover:text-[#7dd3fc]">
                      {doc.title}
                    </span>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center justify-between text-[11px] text-[#c4c7c5] font-mono px-1">
                    <span>
                      {formatFileSize(doc.sizeBytes)} · {new Date(doc.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && filteredDocs.length > 0 && (
        <div className="bg-[#1e1f20] border border-[#37393b] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#c4c7c5]">
              <thead className="bg-[#131314] border-b border-[#37393b] text-[#c4c7c5] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-10">Select</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">AI Indexing</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#28292a]">
                {filteredDocs.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => onSelectDocument(doc)}
                      className={`hover:bg-[#28292a] transition-colors cursor-pointer ${
                        isSelected ? 'bg-red-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleSelectDoc(doc.id, e as any)}
                          className="rounded text-red-600 focus:ring-red-500 cursor-pointer bg-[#1e1f20] border-[#37393b]"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#d9383a] text-white flex items-center justify-center font-bold text-[10px] uppercase flex-shrink-0">
                            PDF
                          </div>
                          <span className="font-semibold text-[#e3e3e3] text-xs truncate max-w-sm hover:text-[#7dd3fc]">
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#28292a] text-[#c4c7c5] font-mono text-[11px]">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7dd3fc] bg-[#004a77]/30 px-2 py-0.5 rounded border border-[#004a77]">
                          <CheckCircle2 size={11} /> Indexed
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#c4c7c5]">
                        {formatFileSize(doc.sizeBytes)}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectDocument(doc)}
                            className="p-1.5 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#28292a] rounded-lg transition-colors cursor-pointer"
                            title="Open reader"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteDocument(doc.id)}
                            className="p-1.5 text-[#c4c7c5] hover:text-rose-400 hover:bg-[#28292a] rounded-lg transition-colors cursor-pointer"
                            title="Delete document"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

