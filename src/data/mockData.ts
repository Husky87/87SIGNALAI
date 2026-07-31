import { DocumentItem, Project, LegislationItem, KnowledgeNode, KnowledgeLink, ReportTemplate, GeneratedReport, AuditLog, OrgStats } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_LEGISLATION: LegislationItem[] = [];

export const INITIAL_KNOWLEDGE_NODES: KnowledgeNode[] = [];

export const INITIAL_KNOWLEDGE_LINKS: KnowledgeLink[] = [];

export const INITIAL_REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 'tpl-1', name: 'Executive Briefing', category: 'Executive', description: 'High-level synthesis of key findings, strategic impact, financial exposure, and decision options for board members.', iconName: 'Briefcase' },
  { id: 'tpl-2', name: 'Policy & Legislative Analysis', category: 'Government Affairs', description: 'Detailed breakdown of bill clauses, political vote counts, regulatory risks, and industry impact.', iconName: 'Landmark' },
  { id: 'tpl-3', name: 'Due Diligence Investment Memo', category: 'Venture Capital', description: 'Comprehensive review of target company financial statements, SEC disclosures, patent portfolio risks, and term sheet mechanics.', iconName: 'TrendingUp' },
  { id: 'tpl-4', name: 'Legal Memorandum & Contract Review', category: 'Legal Counsel', description: 'Clause-by-clause comparative review highlighting indemnification risks, termination rights, liability caps, and omissions.', iconName: 'FileText' },
  { id: 'tpl-5', name: 'Strategic Risk Assessment', category: 'Risk Management', description: 'Systemic risk scoring, liability triggers, and mitigation recommendations.', iconName: 'ShieldAlert' }
];

export const INITIAL_REPORTS: GeneratedReport[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_ORG_STATS: OrgStats = {
  totalDocs: 0,
  storageUsedBytes: 0,
  storageCapacityBytes: 5000000000, // 5 GB
  totalEmbeddings: 0,
  activeProjects: 0,
  tokenUsageToday: 0,
  monthlyBudgetTokens: 100000000,
  activeUsers: 1,
  aiQueriesProcessed: 0,
  modelDistribution: [
    { model: 'Signal87 Standard Engine (Fast OCR & Q&A)', percentage: 80 },
    { model: 'Signal87 Deep Engine (Deep Research)', percentage: 20 }
  ]
};

