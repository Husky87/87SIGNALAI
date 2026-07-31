import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  Share2,
  FileText,
  Sparkles,
  FileSpreadsheet,
  Edit2,
  Save
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Spreadsheet from 'react-spreadsheet';
import { ChatMessage, Citation } from '../types';

export type DeliverableType = 'qa' | 'report' | 'table';

/**
 * Helpers for inline text formatting
 */
export const parseInlineStyles = (text: string) => {
  const clean = text.replace(/^#+\s*/, '');
  const parts = clean.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="bg-[#28292a] text-[#e3e3e3] border border-[#37393b] px-1.5 py-0.5 rounded text-[12px] font-mono font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-[#e3e3e3]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="italic text-[#c4c7c5]">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

/**
 * Gemini-Style Clean Markdown Renderer
 */
export const GeminiMarkdownRenderer: React.FC<{
  text: string;
  citations?: Citation[];
}> = ({ text, citations }) => {
  const blocks = useMemo(() => {
    const rawLines = text.split('\n');
    const result: Array<{
      type: 'heading' | 'paragraph' | 'list' | 'table';
      level?: number;
      content?: string;
      items?: string[];
      tableHeaders?: string[];
      tableRows?: string[][];
    }> = [];

    let i = 0;
    while (i < rawLines.length) {
      const line = rawLines[i].trim();

      if (!line) {
        i++;
        continue;
      }

      // Heading
      if (/^#+\s*/.test(line)) {
        const match = line.match(/^(#+)\s*(.*)/);
        if (match) {
          result.push({
            type: 'heading',
            level: match[1].length,
            content: match[2].trim()
          });
          i++;
          continue;
        }
      }

      // Markdown Table
      if (line.startsWith('|') && line.endsWith('|')) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
          tableLines.push(rawLines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) {
          const validRows = tableLines.filter((r) => !/^\|[\s\-:|]+\|$/.test(r));
          if (validRows.length > 0) {
            const tableHeaders = validRows[0]
              .split('|')
              .slice(1, -1)
              .map((c) => c.trim().replace(/[\*\_]/g, ''));
            const tableRows = validRows.slice(1).map((r) =>
              r
                .split('|')
                .slice(1, -1)
                .map((c) => c.trim().replace(/[\*\_]/g, ''))
            );
            result.push({
              type: 'table',
              tableHeaders,
              tableRows
            });
            continue;
          }
        }
      }

      // List Items
      const listMatch = line.match(/^([\*\-\+]|(\d+)\.)\s+(.*)/);
      if (listMatch) {
        const listItems: string[] = [];
        while (i < rawLines.length) {
          const l = rawLines[i].trim();
          const match = l.match(/^([\*\-\+]|(\d+)\.)\s+(.*)/);
          if (match) {
            listItems.push(match[3].trim());
            i++;
          } else {
            break;
          }
        }
        result.push({
          type: 'list',
          items: listItems
        });
        continue;
      }

      // Paragraph
      const paragraphLines: string[] = [];
      while (i < rawLines.length) {
        const l = rawLines[i].trim();
        if (!l) break;
        if (/^#+\s*/.test(l)) break;
        if (l.startsWith('|') && l.endsWith('|')) break;
        if (/^([\*\-\+]|(\d+)\.)\s+/.test(l)) break;
        paragraphLines.push(l);
        i++;
      }
      if (paragraphLines.length > 0) {
        result.push({
          type: 'paragraph',
          content: paragraphLines.join(' ')
        });
      }
    }

    return result;
  }, [text]);

  return (
    <div className="text-[15px] sm:text-base leading-[1.75] text-[#e3e3e3] font-sans tracking-normal space-y-1">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          const cleanText = parseInlineStyles(block.content || '');
          if (block.level === 1) {
            return (
              <h1 key={idx} className="text-xl sm:text-2xl font-bold text-[#e3e3e3] mt-8 mb-3 tracking-tight">
                {cleanText}
              </h1>
            );
          }
          if (block.level === 2) {
            return (
              <h2 key={idx} className="text-lg sm:text-xl font-bold text-[#e3e3e3] mt-7 mb-2.5 tracking-tight">
                {cleanText}
              </h2>
            );
          }
          if (block.level === 3) {
            return (
              <h3 key={idx} className="text-base sm:text-lg font-bold text-[#e3e3e3] mt-6 mb-2 tracking-tight">
                {cleanText}
              </h3>
            );
          }
          return (
            <h4 key={idx} className="text-sm sm:text-base font-bold text-[#e3e3e3] mt-5 mb-2">
              {cleanText}
            </h4>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="my-3 space-y-2.5">
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 pl-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4c7c5] mt-2.5 flex-shrink-0" />
                  <div className="flex-1 text-[#e3e3e3] leading-[1.75]">{parseInlineStyles(item)}</div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'table') {
          return (
            <div key={idx} className="overflow-x-auto my-4 border border-[#37393b] rounded-xl">
              <table className="w-full border-collapse my-4 text-left text-sm">
                <thead className="bg-[#1e1f20] text-[#e3e3e3] font-bold border-b border-[#37393b]">
                  <tr>
                    {block.tableHeaders?.map((th, hIdx) => (
                      <th key={hIdx} className="p-3 text-xs font-semibold uppercase tracking-wider text-[#c4c7c5]">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#28292a] bg-[#131314]">
                  {block.tableRows?.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#1e1f20] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-[#c4c7c5] text-xs sm:text-sm">
                          {parseInlineStyles(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={idx} className="mb-4 text-[15px] sm:text-base leading-[1.75] text-[#e3e3e3]">
            {parseInlineStyles(block.content || '')}
          </p>
        );
      })}

      {/* Grounded Citation Sources */}
      {citations && citations.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#28292a] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#8e918f] font-medium text-[11px] uppercase tracking-wider mr-1">Sources:</span>
          {citations.map((c, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-[#1e1f20] text-[#e3e3e3] rounded-full text-xs font-medium border border-[#37393b] flex items-center gap-1.5"
              title={c.snippet || c.docTitle}
            >
              <span className="font-semibold">{c.docTitle}</span>
              {c.paragraphRef && <span className="text-[10px] text-[#c4c7c5] font-mono">({c.paragraphRef})</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Legacy exports kept for backwards compatibility
export const StandardQAOutput = GeminiMarkdownRenderer;
export const ReportCardOutput = GeminiMarkdownRenderer;
export const DataTableOutput = GeminiMarkdownRenderer;
export function determineDeliverableType(
  _prompt?: string,
  _text?: string,
  _isDeepResearch?: boolean
): DeliverableType {
  return 'qa';
}

/**
 * Main Action Router Component - Gemini Clean Style
 */
export const ActionRouterCard: React.FC<{
  msg: ChatMessage;
  userPrompt?: string;
  copiedMsgId: string | null;
  savedReportIds?: Set<string>;
  onCopy: (id: string, text: string) => void;
  onExportPDF: (title: string, text: string) => void;
  onSaveReport?: (id: string, title: string, content: string) => void;
  onInspectInCanvas?: (msg: ChatMessage) => void;
}> = ({
  msg,
  copiedMsgId,
  onCopy,
  onExportPDF
}) => {
  const [shareCopied, setShareCopied] = useState(false);
  const [isEditingExcel, setIsEditingExcel] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState<any>(null);

  const tableDataAsGrid = useMemo(() => {
    if (!msg.excelExportData) return null;
    const data = msg.excelExportData.data;
    if (data.length === 0) return [];
    
    const headers = Object.keys(data[0]);
    const grid = [
      headers.map(h => ({ value: h })),
      ...data.map((row: any) => headers.map(h => ({ value: String(row[h] || '') })))
    ];
    return grid;
  }, [msg.excelExportData]);

  const handleShare = () => {
    navigator.clipboard.writeText(msg.text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const downloadExcelFromChat = (tableData: any, fileName = "research_export.xlsx") => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(tableData);
    XLSX.utils.book_append_sheet(wb, ws, "Code Group Manager");
    XLSX.writeFile(wb, fileName);
  };

  const handleDownloadExcel = () => {
    if (isEditingExcel && spreadsheetData) {
      // Convert grid back to object array
      const headers = spreadsheetData[0].map((cell: any) => cell.value);
      const data = spreadsheetData.slice(1).map((row: any) => {
        const obj: any = {};
        headers.forEach((h: string, i: number) => {
          obj[h] = row[i].value;
        });
        return obj;
      });
      downloadExcelFromChat(data, msg.excelExportData?.filename || "research_export.xlsx");
    } else if (msg.excelExportData) {
      const { data, filename } = msg.excelExportData;
      downloadExcelFromChat(data, filename || "research_export.xlsx");
    }
  };

  return (
    <div className="py-1">
      {/* Response Content rendered directly without boxed wrappers */}
      {isEditingExcel && spreadsheetData ? (
        <div className="my-4 border rounded-xl overflow-hidden">
          <Spreadsheet data={spreadsheetData} onChange={setSpreadsheetData} />
        </div>
      ) : (
        <GeminiMarkdownRenderer text={msg.text} citations={msg.citations} />
      )}

      {/* Streamlined Action Row */}
      <div className="mt-4 pt-2 flex items-center gap-1 text-xs text-slate-500">
        <button
          onClick={() => onCopy(msg.id, msg.text)}
          className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          title="Copy response"
        >
          {copiedMsgId === msg.id ? (
            <Check size={14} className="text-emerald-600" />
          ) : (
            <Copy size={14} />
          )}
          <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
        </button>

        {msg.excelExportData && (
          <>
            <button
              onClick={() => {
                if (!isEditingExcel) {
                  setSpreadsheetData(tableDataAsGrid);
                }
                setIsEditingExcel(!isEditingExcel);
              }}
              className={`px-2.5 py-1.5 hover:bg-slate-100 ${isEditingExcel ? 'text-emerald-700' : 'text-slate-500'} hover:text-emerald-700 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-xs`}
              title={isEditingExcel ? "Save Changes" : "Edit in Browser"}
            >
              {isEditingExcel ? <Save size={14} /> : <Edit2 size={14} />}
              <span>{isEditingExcel ? 'Save Changes' : 'Edit in Browser'}</span>
            </button>
            <button
              onClick={handleDownloadExcel}
              className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-500 hover:text-emerald-700 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
              title="Download Excel"
            >
              <FileSpreadsheet size={14} />
              <span>Download Excel</span>
            </button>
          </>
        )}

        <button
          onClick={() => onExportPDF('Signal87 AI Brief', msg.text)}
          className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          title="Export PDF"
        >
          <Download size={14} />
          <span>Export PDF</span>
        </button>

        <button
          onClick={handleShare}
          className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          title="Share response"
        >
          <Share2 size={14} />
          <span>{shareCopied ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
};
