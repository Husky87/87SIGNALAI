import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  ShieldAlert,
  Sparkles,
  Download,
  GitFork,
  Search,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Printer,
  Scale
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onOpenCompare: (doc: DocumentItem) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document: doc,
  onClose,
  onOpenCompare
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'analysis'>('pdf');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [activeMatchIndex, setActiveMatchIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Reset match index when search query changes
  useEffect(() => {
    setActiveMatchIndex(0);
  }, [docSearchQuery]);

  if (!doc) return null;

  const totalPages = 3;
  const fullText = doc.contentPreview || doc.summary || 'No text content preview available.';

  // Calculate search matches count across the document text
  const getMatchesCount = () => {
    if (!docSearchQuery.trim()) return 0;
    const escaped = docSearchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const matches = fullText.match(new RegExp(escaped, 'gi'));
    return matches ? matches.length : 0;
  };

  const matchesCount = getMatchesCount();

  const scrollToActiveMatch = () => {
    setTimeout(() => {
      const activeEl = document.getElementById('active-search-match');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const handleNextMatch = () => {
    if (matchesCount === 0) return;
    const nextIdx = (activeMatchIndex + 1) % matchesCount;
    setActiveMatchIndex(nextIdx);
    scrollToActiveMatch();
  };

  const handlePrevMatch = () => {
    if (matchesCount === 0) return;
    const prevIdx = (activeMatchIndex - 1 + matchesCount) % matchesCount;
    setActiveMatchIndex(prevIdx);
    scrollToActiveMatch();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_document.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escaped = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    let matchCounter = 0;

    return (
      <span>
        {parts.map((part, i) => {
          if (part.toLowerCase() === query.toLowerCase()) {
            const isCurrent = matchCounter === activeMatchIndex;
            const currentIdx = matchCounter;
            matchCounter++;
            return (
              <mark
                key={i}
                id={isCurrent ? 'active-search-match' : undefined}
                className={`${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 font-extrabold px-1 py-0.5 rounded shadow-md border border-amber-500 scale-105 inline-block ring-2 ring-amber-300'
                    : 'bg-amber-300/80 text-slate-900 font-bold px-0.5 rounded'
                }`}
                title={`Match ${currentIdx + 1} of ${matchesCount}`}
              >
                {part}
              </mark>
            );
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 rounded-none sm:rounded-3xl max-w-6xl w-full h-full sm:h-auto sm:max-h-[96vh] shadow-2xl overflow-hidden border-0 sm:border sm:border-slate-800 flex flex-col text-slate-100">
        
        {/* Top Header Bar */}
        <div className="px-3 py-2.5 sm:px-5 sm:py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#d9383a] text-white flex items-center justify-center font-black text-[10px] sm:text-xs uppercase flex-shrink-0 shadow-sm">
              PDF
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] sm:text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                  {doc.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
                  ID: {doc.id}
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.5 rounded hidden min-[480px]:inline-block">
                  VERIFIED RECORD
                </span>
              </div>
              <h2 className="text-xs sm:text-base font-bold text-white truncate max-w-[170px] min-[380px]:max-w-[220px] sm:max-w-xl">
                {doc.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onOpenCompare(doc)}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] sm:text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <GitFork size={13} />
              <span className="hidden min-[480px]:inline">Compare</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewer Toolbar Row */}
        <div className="px-3 py-2 sm:px-5 sm:py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
                activeTab === 'pdf'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText size={14} />
              <span>Document</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
                activeTab === 'analysis'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles size={14} />
              <span>AI Analysis</span>
            </button>
          </div>

          {/* Search Bar with Find & Highlight Controls */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-2xl border border-slate-800 flex-1 max-w-full sm:max-w-md min-w-[200px]">
            <Search className="text-slate-400 flex-shrink-0" size={14} />
            <input
              type="text"
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              placeholder="Find in document..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none min-w-0"
            />
            {docSearchQuery && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                  {matchesCount > 0 ? `${activeMatchIndex + 1}/${matchesCount}` : '0 found'}
                </span>
                
                <button
                  onClick={handlePrevMatch}
                  disabled={matchesCount === 0}
                  className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                  title="Previous match"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={handleNextMatch}
                  disabled={matchesCount === 0}
                  className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                  title="Next match"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => setDocSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Controls Right Section */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {/* PDF Page Nav & Zoom (when in PDF mode) */}
            {activeTab === 'pdf' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 hover:bg-slate-800 disabled:opacity-40 rounded text-slate-300 cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[11px] font-mono text-slate-200">
                    <strong className="text-white">{currentPage}</strong>/{totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 hover:bg-slate-800 disabled:opacity-40 rounded text-slate-300 cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span className="text-[11px] font-mono text-slate-300 px-0.5">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyText}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer"
                title="Copy text"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer hidden sm:flex"
                title="Print Document"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadText}
                className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer"
                title="Download document"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content View Container */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-2 sm:p-6 flex flex-col items-center">
          {/* 1. RENDERED PDF / DOCUMENT SHEET VIEW */}
          {activeTab === 'pdf' && (
            <div className="w-full flex flex-col items-center space-y-4">
              {doc.fileUrl ? (
                <div className="w-full h-[550px] sm:h-[650px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                  <iframe src={doc.fileUrl} title={doc.title} className="w-full h-full border-none" />
                </div>
              ) : (
                /* Formatted Document Sheet Canvas - Mobile Optimized */
                <div
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  className="bg-white text-slate-900 shadow-2xl border border-slate-300 w-full max-w-3xl min-h-[500px] sm:min-h-[850px] p-4 sm:p-12 font-serif rounded-lg sm:rounded-sm leading-relaxed relative flex flex-col justify-between transition-transform duration-150"
                >
                  <div>
                    {/* Header Stamp */}
                    <div className="border-b-2 border-slate-900 pb-3 mb-4 sm:pb-4 sm:mb-6 flex flex-col sm:flex-row items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Scale size={18} className="text-slate-900 flex-shrink-0" />
                          <span className="font-sans font-black tracking-widest text-[10px] sm:text-xs uppercase text-slate-800">
                            SIGNAL87 EXECUTIVE RECORD ARCHIVE
                          </span>
                        </div>
                        <p className="font-sans text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider">
                          REPOSITORY CLASS: {doc.category} • REF #{doc.id.toUpperCase()}
                        </p>
                      </div>

                      <div className="border-2 border-rose-600 bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded font-sans text-[9px] font-black uppercase tracking-wider self-start sm:self-auto">
                        CONFIDENTIAL
                      </div>
                    </div>

                    {/* Meta bar */}
                    <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-sans text-slate-500 mb-6 border-b border-slate-200 pb-2">
                      <span>Owner: <strong>{doc.owner}</strong></span>
                      <span>Date: <strong>{new Date(doc.uploadDate).toLocaleDateString()}</strong></span>
                      <span>Page {currentPage} of {totalPages}</span>
                    </div>

                    {/* PAGE 1 CONTENT */}
                    {currentPage === 1 && (
                      <div className="space-y-5">
                        <div className="text-center space-y-1 py-2 sm:py-4">
                          <h1 className="text-lg sm:text-2xl font-bold font-serif text-slate-900 tracking-tight leading-tight">
                            {renderHighlightedText(doc.title, docSearchQuery)}
                          </h1>
                          <p className="text-[11px] sm:text-xs font-sans text-slate-500 italic">
                            Official Filing & Executive Analysis Report
                          </p>
                        </div>

                        <div className="bg-slate-50 border-l-4 border-slate-900 p-3 sm:p-4 rounded-r-lg font-sans text-xs space-y-1 my-4 sm:my-6">
                          <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                            I. EXECUTIVE BRIEFING SUMMARY
                          </span>
                          <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                            {renderHighlightedText(
                              doc.summary || 'Official document repository deposit. Content structured with Signal87 layout parser and OCR.',
                              docSearchQuery
                            )}
                          </p>
                        </div>

                        <div className="space-y-2 pt-1">
                          <h3 className="font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                            II. RECOGNIZED STATUTORY & LEGAL PROVISIONS
                          </h3>
                          <div className="text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                            {renderHighlightedText(fullText, docSearchQuery)}
                          </div>
                        </div>

                        {/* Extracted Key Table */}
                        {doc.entities && doc.entities.length > 0 && (
                          <div className="pt-3 font-sans overflow-x-auto">
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-900 block mb-2">
                              Key Record Entities & Metrics
                            </span>
                            <table className="w-full text-left text-xs border border-slate-300 border-collapse min-w-[280px]">
                              <thead>
                                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-[10px] sm:text-xs">
                                  <th className="p-2 border-r border-slate-300">Entity Name</th>
                                  <th className="p-2 border-r border-slate-300">Type</th>
                                  <th className="p-2">Confidence</th>
                                </tr>
                              </thead>
                              <tbody>
                                {doc.entities.slice(0, 4).map((ent, idx) => (
                                  <tr key={idx} className="border-b border-slate-200 text-[10px] sm:text-xs">
                                    <td className="p-2 border-r border-slate-200 font-semibold text-slate-900">
                                      {renderHighlightedText(ent.name, docSearchQuery)}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-slate-600 font-mono text-[10px]">{ent.type}</td>
                                    <td className="p-2 text-emerald-700 font-mono font-bold text-[10px]">{ent.relevance}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PAGE 2 CONTENT */}
                    {currentPage === 2 && (
                      <div className="space-y-5">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans border-b border-slate-300 pb-2">
                          III. CLAUSES & STATUTORY OBLIGATIONS (CONT.)
                        </h2>
                        
                        <div className="space-y-3 text-xs leading-relaxed text-slate-800 font-serif">
                          <p>
                            {renderHighlightedText(
                              '§ 201. Compliance Requirements. All submitting entities shall maintain transparent records of lobbyist compensation, legislative advocacy fees, and public disclosure filings as prescribed under Section 4A of the ethics protocol.',
                              docSearchQuery
                            )}
                          </p>
                          <p>
                            {renderHighlightedText(
                              '§ 202. Audit Standards. Independent quarterly reviews will be conducted by the Oversight Committee. Discrepancies exceeding $5,000 must be reported within 14 business days.',
                              docSearchQuery
                            )}
                          </p>
                        </div>

                        {doc.riskHighlights && doc.riskHighlights.length > 0 && (
                          <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-lg font-sans text-xs space-y-2">
                            <span className="font-bold text-amber-900 uppercase text-[10px] flex items-center gap-1">
                              <ShieldAlert size={14} className="text-amber-700 flex-shrink-0" /> Identified Risk Highlights
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-amber-900 text-[11px] sm:text-xs">
                              {doc.riskHighlights.map((r, i) => (
                                <li key={i}>{renderHighlightedText(r, docSearchQuery)}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PAGE 3 CONTENT */}
                    {currentPage === 3 && (
                      <div className="space-y-5">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans border-b border-slate-300 pb-2">
                          IV. CERTIFICATION & OFFICIAL SIGN-OFF
                        </h2>

                        <p className="text-xs leading-relaxed text-slate-800">
                          {renderHighlightedText(
                            'I hereby certify that the foregoing document is a true, accurate, and complete transcript of the public record filed with the Signal87 Repository.',
                            docSearchQuery
                          )}
                        </p>

                        {/* Signature Block */}
                        <div className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                          <div className="border-t-2 border-slate-900 pt-2 space-y-1">
                            <span className="font-serif italic text-base sm:text-lg text-slate-900 block font-bold">Signal87 Authorized Custodian</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">OFFICIAL RECORD CUSTODIAN</span>
                          </div>

                          <div className="border-t-2 border-slate-900 pt-2 space-y-1">
                            <span className="font-bold text-slate-900 text-xs block">Verifiable Hash Signature</span>
                            <span className="text-[9px] font-mono text-slate-500 block break-all">
                              0x7f28a9b1c0e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Stamp */}
                  <div className="pt-6 border-t border-slate-200 mt-8 flex items-center justify-between font-sans text-[9px] sm:text-[10px] text-slate-400">
                    <span>SIGNAL87 VERIFIED DIGITAL PDF</span>
                    <span>CONFIDENTIAL RECORD</span>
                    <span>PAGE {currentPage} OF {totalPages}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. AI ANALYSIS VIEW */}
          {activeTab === 'analysis' && (
            <div className="w-full max-w-4xl space-y-4 sm:space-y-6">
              <div className="p-4 sm:p-5 bg-blue-950/60 border border-blue-800/60 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
                  <Sparkles size={16} className="text-blue-400 flex-shrink-0" /> AI Executive Summary
                </div>
                <p className="text-slate-200 leading-relaxed text-xs font-medium">
                  {renderHighlightedText(doc.summary || 'Summary unavailable.', docSearchQuery)}
                </p>
              </div>

              {doc.riskHighlights && doc.riskHighlights.length > 0 && (
                <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <ShieldAlert size={16} className="text-rose-400 flex-shrink-0" /> Risk Highlights
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-rose-200 text-xs">
                    {doc.riskHighlights.map((r, i) => (
                      <li key={i}>{renderHighlightedText(r, docSearchQuery)}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-slate-300 text-xs uppercase tracking-wider">
                  Recognized Entities & Key Clauses
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(doc.entities || []).map((ent, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-bold text-white text-xs truncate">
                          {renderHighlightedText(ent.name, docSearchQuery)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{ent.type}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full font-mono flex-shrink-0">
                        {ent.relevance}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5 flex-wrap overflow-hidden max-h-8">
            {doc.tags.map((t, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg text-[10px] font-medium border border-slate-700">
                #{t}
              </span>
            ))}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
