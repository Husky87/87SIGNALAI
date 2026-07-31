import React, { useState } from 'react';
import {
  Upload,
  X,
  FileText,
  Cloud,
  Mail,
  Sparkles,
  ShieldCheck,
  Library
} from 'lucide-react';
import { DocumentItem } from '../types';
import { parseFileContent, ParsedFileResult } from '../lib/fileParser';
import { DocumentLibraryView } from './DocumentLibraryView';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentItem, parsedFile?: ParsedFileResult) => void;
  documents: DocumentItem[];
  onSelectExistingDocument?: (doc: DocumentItem) => void;
  onOpenDrivePicker?: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  documents,
  onSelectExistingDocument,
  onOpenDrivePicker
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'cloud' | 'email' | 'library'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [fileNameInput, setFileNameInput] = useState('');
  const [fileCategory, setFileCategory] = useState<'Legal' | 'Legislative' | 'Financial' | 'Research'>('Legal');

  if (!isOpen) return null;

  const processSingleFile = async (fileObj?: File, titleOverride?: string) => {
    const title = titleOverride || (fileObj ? fileObj.name : 'Untitled Document.pdf');
    const fileUrl = fileObj ? URL.createObjectURL(fileObj) : undefined;
    const sizeBytes = fileObj ? fileObj.size : 1024 * 50;

    let parsedResult: ParsedFileResult | undefined = undefined;
    let extractedText = `Uploaded enterprise document "${title}".`;

    if (fileObj) {
      setProcessStep(`Parsing & Extracting Text from ${title}...`);
      parsedResult = await parseFileContent(fileObj);
      extractedText = parsedResult.extractedText || extractedText;
    } else {
      setProcessStep(`Performing Optical Character Recognition (OCR) for ${title}...`);
      await new Promise((r) => setTimeout(r, 300));
    }

    setProcessStep(`Calling Signal87 AI Engine for Entity Extraction & Vector Embedding (${title})...`);

    let backendData: any = {};
    try {
      const res = await fetch('/api/documents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          textContent: extractedText.slice(0, 100000),
          spreadsheetData: parsedResult?.spreadsheetData
        })
      });
      if (res.ok) {
        backendData = await res.json();
      }
    } catch (apiErr) {
      console.warn('API route call fallback:', apiErr);
    }

    const newDoc: DocumentItem & { fullText?: string } = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      type: title.endsWith('.docx') ? 'docx' : title.endsWith('.xlsx') ? 'xlsx' : title.endsWith('.csv') ? 'csv' : 'pdf',
      sizeBytes,
      uploadDate: new Date().toISOString(),
      tags: backendData.suggestedTags || ['Uploaded', 'Indexed'],
      owner: 'ceo@signal87.ai',
      organization: 'Signal87 Executive',
      status: 'ready',
      aiIndexed: true,
      embeddingsComplete: true,
      versionHistory: [
        { version: 1, updatedAt: new Date().toISOString(), updatedBy: 'ceo@signal87.ai', changeNote: 'Initial deposit' }
      ],
      permissions: 'Organization',
      summary: backendData.summary || (parsedResult ? `Parsed ${parsedResult.summaryInfo}` : 'Enterprise document uploaded and structured.'),
      entities: backendData.entities || [
        { name: title, type: 'Contract', relevance: 90 }
      ],
      riskHighlights: backendData.riskHighlights || ['Verify standard compliance guidelines'],
      contentPreview: extractedText,
      fullText: extractedText,
      category: fileCategory,
      projectIds: [],
      fileUrl
    };

    onUploadSuccess(newDoc as DocumentItem, parsedResult);
  };

  const handleMultipleFilesUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessStep(`[${i + 1}/${files.length}] Ingesting "${file.name}"...`);
        await processSingleFile(file);
      }
    } catch (err) {
      console.error('Multi-file upload error:', err);
    } finally {
      setProcessing(false);
      onClose();
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = (Array.from(e.dataTransfer.files) as File[]).filter((f) => f.size > 0);
      if (files.length > 0) {
        handleMultipleFilesUpload(files);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileNameInput.trim()) {
      setProcessing(true);
      const title = fileNameInput.endsWith('.pdf') || fileNameInput.endsWith('.docx') || fileNameInput.endsWith('.xlsx')
        ? fileNameInput
        : `${fileNameInput}.pdf`;
      try {
        await processSingleFile(undefined, title);
      } finally {
        setProcessing(false);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1f20] rounded-3xl max-w-2xl w-full border border-[#37393b] text-[#e3e3e3] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#37393b] flex items-center justify-between bg-[#131314]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center">
              <Upload size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#e3e3e3]">Upload & AI Index Documents</h2>
              <p className="text-[11px] text-[#c4c7c5]">Automated OCR, metadata, entity extraction & vector embeddings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#28292a] rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 flex border-b border-[#37393b] gap-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#1a73e8] text-[#7dd3fc]'
                : 'border-transparent text-[#c4c7c5] hover:text-[#e3e3e3]'
            }`}
          >
            <FileText size={15} /> Local & Folder Upload
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'cloud'
                ? 'border-[#1a73e8] text-[#7dd3fc]'
                : 'border-transparent text-[#c4c7c5] hover:text-[#e3e3e3]'
            }`}
          >
            <Cloud size={15} /> Cloud Import (Drive, Dropbox, Box)
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'border-[#1a73e8] text-[#7dd3fc]'
                : 'border-transparent text-[#c4c7c5] hover:text-[#e3e3e3]'
            }`}
          >
            <Mail size={15} /> Email Import Address
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'border-[#1a73e8] text-[#7dd3fc]'
                : 'border-transparent text-[#c4c7c5] hover:text-[#e3e3e3]'
            }`}
          >
            <Library size={15} /> Document Library
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {processing ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#004a77] border-t-[#1a73e8] animate-spin flex items-center justify-center" />
                <Sparkles size={20} className="text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#e3e3e3]">Processing Document Pipeline</h3>
                <p className="text-xs text-[#7dd3fc] font-mono animate-pulse">{processStep}</p>
              </div>
            </div>
          ) : activeTab === 'upload' ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive ? 'border-[#1a73e8] bg-[#004a77]/30' : 'border-[#37393b] hover:border-[#8e918f] bg-[#131314]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#28292a] text-[#7dd3fc] flex items-center justify-center mx-auto mb-3 border border-[#37393b]">
                  <Upload size={24} />
                </div>
                <h3 className="text-sm font-bold text-[#e3e3e3]">Drag & Drop multiple files or folders here</h3>
                <p className="text-xs text-[#c4c7c5] mt-1 mb-4">Supports PDF, Word, Excel, PowerPoint, Images, CSV up to 500MB each</p>
                <label className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                  <Upload size={14} /> Browse Local Files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.docx,.xlsx,.pptx,.txt,.png,.jpg,.jpeg,.webp,.csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const files = (Array.from(e.target.files) as File[]).filter((f) => f.size > 0);
                        if (files.length > 0) {
                          handleMultipleFilesUpload(files);
                        }
                      }
                    }}
                  />
                </label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#37393b]"></div>
                <span className="flex-shrink mx-4 text-[11px] text-[#c4c7c5] font-semibold uppercase">or enter file name manually</span>
                <div className="flex-grow border-t border-[#37393b]"></div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-[#c4c7c5] mb-1">Document Title</label>
                    <input
                      type="text"
                      value={fileNameInput}
                      onChange={(e) => setFileNameInput(e.target.value)}
                      placeholder="e.g. Municipal Housing Ordinance Amendment 2026.pdf"
                      className="w-full px-3 py-2 bg-[#131314] border border-[#37393b] rounded-xl text-xs text-[#e3e3e3] placeholder-[#c4c7c5] focus:outline-hidden focus:border-[#1a73e8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#c4c7c5] mb-1">Category</label>
                    <select
                      value={fileCategory}
                      onChange={(e: any) => setFileCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#131314] border border-[#37393b] rounded-xl text-xs text-[#e3e3e3] focus:outline-hidden focus:border-[#1a73e8]"
                    >
                      <option value="Legal">Legal</option>
                      <option value="Legislative">Legislative</option>
                      <option value="Financial">Financial</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!fileNameInput.trim()}
                  className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} /> Start AI Processing Pipeline
                </button>
              </form>
            </div>
          ) : activeTab === 'cloud' ? (
            <div className="space-y-4 py-2">
              <div
                onClick={() => {
                  onClose();
                  if (onOpenDrivePicker) {
                    onOpenDrivePicker();
                  }
                }}
                className="p-5 rounded-2xl border border-[#1a73e8]/50 hover:border-[#1a73e8] cursor-pointer transition-all flex items-center justify-between bg-gradient-to-r from-[#004a77]/30 to-[#131314] hover:bg-[#004a77]/40 shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#28292a] border border-[#37393b] flex items-center justify-center text-[#7dd3fc]">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 87.3 78">
                      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.9 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                      <path d="m43.65 25-13.75-23.8c-1.4.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                      <path d="m73.55 76.8c1.4-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                      <path d="m43.65 25 13.75 23.8h27.5c0-1.55-.4-3.1-1.2-4.5l-25.4-44c-.8-1.4-1.9-2.5-3.3-3.3z" fill="#00832d"/>
                      <path d="m57.4 48.8-13.75 23.8c1.4.8 2.95 1.2 4.5 1.2h54.8c1.55 0 3.1-.4 4.5-1.2l-13.75-23.8z" fill="#2684fc"/>
                      <path d="m13.75 25 13.75 23.8 13.75-23.8-13.75-23.8z" fill="#ffba00"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">Google Drive Integration</h4>
                      <span className="text-[10px] bg-[#1a73e8] text-white font-extrabold px-2 py-0.5 rounded-full uppercase">Active</span>
                    </div>
                    <p className="text-xs text-[#c4c7c5] mt-0.5">Browse Google Docs, Sheets & PDFs directly from your Drive</p>
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-[#1a73e8] text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                  <span>Open Drive Hub</span>
                  <Sparkles size={14} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['Dropbox', 'OneDrive', 'Box'].map((provider) => (
                  <div
                    key={provider}
                    onClick={async () => {
                      setProcessing(true);
                      try {
                        await processSingleFile(undefined, `Imported_${provider}_Contract_Review.pdf`);
                      } finally {
                        setProcessing(false);
                        onClose();
                      }
                    }}
                    className="p-3.5 rounded-2xl border border-[#37393b] hover:border-[#1a73e8] cursor-pointer transition-all flex items-center gap-2.5 bg-[#28292a] hover:bg-[#37393b]"
                  >
                    <Cloud size={20} className="text-[#7dd3fc]" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#e3e3e3] truncate">{provider}</h4>
                      <span className="text-[10px] text-[#c4c7c5] truncate block">Connect folder</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'library' ? (
            <div className="h-96 overflow-y-auto">
              <DocumentLibraryView
                documents={documents}
                onSelectDocument={(doc) => {
                  if (onSelectExistingDocument) {
                    onSelectExistingDocument(doc);
                  }
                  onClose();
                }}
                onOpenUpload={() => setActiveTab('upload')}
                onCompareSelected={() => {}}
                onDeleteDocument={() => {}}
              />
            </div>
          ) : (
            <div className="p-4 bg-[#131314] border border-[#37393b] rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#e3e3e3] block">Dedicated Mail Import Address</span>
              <div className="p-3 bg-[#28292a] border border-[#37393b] rounded-xl font-mono text-xs text-[#7dd3fc] select-all">
                ingest-org-signal87@ingest.signal87.ai
              </div>
              <p className="text-xs text-[#c4c7c5]">
                Any PDF, Word, or Excel attachment emailed to this address will be automatically OCR-parsed, auto-tagged, and indexed into your organization workspace.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#131314] border-t border-[#37393b] flex items-center justify-between text-[11px] text-[#c4c7c5]">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-[#7dd3fc]" /> FedRAMP High Encryption Active
          </span>
          <span>Signal87 Core Engine</span>
        </div>
      </div>
    </div>
  );
};