import React, { useState } from 'react';
import { Signal87Logo } from './Signal87Logo';
import {
  Sparkles,
  Shield,
  Search,
  FileText,
  GitFork,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowUpRight,
  Database,
  Users,
  Zap,
  LogIn,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { Footer } from './Footer';
import { NavTab } from './Sidebar';

interface LandingPageViewProps {
  onGoogleSignIn: () => void;
  onEnterDemo: () => void;
  onOpenPrivacy: () => void;
  onOpenBlog: () => void;
  onOpenMedia: () => void;
  onSelectTab: (tab: NavTab) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGoogleSignIn,
  onEnterDemo,
  onOpenPrivacy,
  onOpenBlog,
  onOpenMedia,
  onSelectTab
}) => {
  const [activeSource, setActiveSource] = useState<string>('Research report');
  const [followUpInput, setFollowUpInput] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans antialiased flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navbar matching exact screenshot pill style */}
      <header className="sticky top-0 z-50 bg-[#070b12]/90 backdrop-blur-md border-b border-slate-800/60 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo Left */}
          <div className="flex items-center gap-3">
            <Signal87Logo size={32} />
            <span className="font-extrabold text-white text-xl tracking-tight">Signal87 AI</span>
          </div>

          {/* Center Navigation Pill Bar (Exact match to screenshot) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/80 rounded-full px-5 py-2 text-xs font-medium text-slate-300 shadow-inner">
            <a
              href="#mockup"
              className="px-3 py-1 hover:text-white transition-colors cursor-pointer"
            >
              Computer
            </a>
            <a
              href="#capabilities"
              className="px-3 py-1 hover:text-white transition-colors cursor-pointer"
            >
              Legislative
            </a>
            <a
              href="#capabilities"
              className="px-3 py-1 hover:text-white transition-colors cursor-pointer"
            >
              How it works
            </a>
            <a
              href="#capabilities"
              className="px-3 py-1 hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="#team"
              className="px-3 py-1 hover:text-white transition-colors cursor-pointer"
            >
              Team
            </a>
            <button
              onClick={onOpenBlog}
              className="px-3 py-1 hover:text-white transition-colors cursor-pointer"
            >
              Blog
            </button>
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoogleSignIn}
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={onEnterDemo}
              className="px-4 py-2 border border-sky-500/40 hover:border-sky-400 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Zap size={13} className="text-amber-400" />
              <span>Try Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section with Grid Background */}
      <section className="relative pt-8 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-8 overflow-hidden bg-[#070b12] flex-1">
        {/* Subtle Background Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Big Display Typography */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#38bdf8] uppercase">
              AI ANSWERS FOR YOUR OWN FILES
            </div>

            {/* Massive Bold Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
              Upload your<br />
              documents.<br />
              <span className="text-[#38bdf8]">Ask anything.</span><br />
              Get answers you<br />
              can verify.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 max-w-lg font-normal leading-relaxed">
              Signal87 reads across PDFs, reports and spreadsheets to create summaries, comparisons, timelines and cited research.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onGoogleSignIn}
                className="px-6 py-3.5 bg-[#7dd3fc] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Sign In with Google</span>
                <ArrowUpRight size={18} />
              </button>

              <button
                onClick={onEnterDemo}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700/80 hover:border-slate-500 font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap size={16} className="text-amber-400" />
                <span>Instant Demo Access</span>
              </button>
            </div>
          </div>

          {/* Right Column: Exact UI Mockup Box matching the screenshot */}
          <div id="mockup" className="lg:col-span-6 relative">
            {/* Floating Top Right Citation Badge */}
            <div className="absolute -top-4 right-4 z-20 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 text-right shadow-2xl backdrop-blur-md">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                VERIFIED
              </span>
              <span className="text-xs font-extrabold text-white">32 citations attached</span>
            </div>

            {/* Floating Bottom Left Badge */}
            <div className="absolute -bottom-4 left-4 z-20 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2 text-left shadow-2xl backdrop-blur-md">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                READY TO SHARE
              </span>
              <span className="text-xs font-extrabold text-white">Decision brief</span>
            </div>

            {/* Main Interactive Card Container */}
            <div className="bg-[#0b101b] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 relative">
              {/* Inside Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">
                    YOUR DOCUMENTS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">4 FILES READY</span>
              </div>

              {/* Two Column Interface Inside Card */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Active Sources List (Left) */}
                <div className="sm:col-span-4 space-y-2 border-r border-slate-800/60 sm:pr-3">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    ACTIVE SOURCES
                  </span>

                  {[
                    { title: 'Research report', status: 'READING' },
                    { title: 'Service agreement', status: 'READY' },
                    { title: 'Budget workbook', status: 'READY' },
                    { title: 'Meeting notes', status: 'READY' }
                  ].map((src) => (
                    <div
                      key={src.title}
                      onClick={() => setActiveSource(src.title)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between text-xs ${
                        activeSource === src.title
                          ? 'bg-slate-800/80 border-slate-700 text-white font-bold'
                          : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="truncate pr-1 text-[11px]">{src.title}</span>
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {src.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Answer Ready Detail (Right) */}
                <div className="sm:col-span-8 space-y-4 text-left">
                  <div className="flex items-center gap-1.5 text-[#38bdf8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                      ANSWER READY
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">
                      Project risks summarized
                    </h2>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      14 findings · 8 sources · 32 cited details
                    </p>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-left">
                      <span className="text-lg font-black text-white block">14</span>
                      <span className="text-[8px] font-mono text-slate-400 uppercase font-bold">FINDINGS</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-left">
                      <span className="text-lg font-black text-white block">8</span>
                      <span className="text-[8px] font-mono text-slate-400 uppercase font-bold">SOURCES</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-left">
                      <span className="text-lg font-black text-white block">32</span>
                      <span className="text-[8px] font-mono text-slate-400 uppercase font-bold">CITATIONS</span>
                    </div>
                  </div>

                  {/* Citation Progress Lines */}
                  <div className="space-y-2 text-[10px] font-mono text-slate-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 truncate w-24">Research report</span>
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#38bdf8] w-[85%]" />
                      </div>
                      <span className="text-slate-400 text-[9px]">p.18</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 truncate w-24">Service agreement</span>
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#38bdf8] w-[95%]" />
                      </div>
                      <span className="text-slate-400 text-[9px]">p.88</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 truncate w-24">Budget workbook</span>
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#38bdf8] w-[70%]" />
                      </div>
                      <span className="text-slate-400 text-[9px]">row 22</span>
                    </div>
                  </div>

                  {/* Follow-up Prompt Input Box */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                    <span className="text-xs font-mono text-[#38bdf8] font-bold">&gt;</span>
                    <input
                      type="text"
                      value={followUpInput}
                      onChange={(e) => setFollowUpInput(e.target.value)}
                      placeholder="Ask a follow-up about these files"
                      className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden w-full font-mono"
                    />
                    <button
                      onClick={onEnterDemo}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-mono font-bold rounded-lg cursor-pointer flex-shrink-0"
                    >
                      Ask
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="capabilities" className="py-16 px-4 sm:px-8 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#38bdf8] font-bold uppercase tracking-widest">
              Grounded Legal Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Legal & Regulatory Teams Trust Signal87
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3">
              <FileText className="text-[#38bdf8]" size={24} />
              <h3 className="font-bold text-white text-base">Direct Paragraph Citations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click any citation to open the exact page and paragraph in your PDF repo. Zero guesswork or hallucinated clauses.
              </p>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3">
              <GitFork className="text-[#38bdf8]" size={24} />
              <h3 className="font-bold text-white text-base">Multi-Contract Matrix</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare indemnity caps, renewal dates, and compliance clauses across dozens of active vendor agreements simultaneously.
              </p>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3">
              <Shield className="text-emerald-400" size={24} />
              <h3 className="font-bold text-white text-base">Strict Zero Training Policy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your confidential documents and query history are isolated in Firestore and never used for public model training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Team Section */}
      <section id="team" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#070b12] border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-widest">
              Executive Leadership
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Spearheaded by Enterprise AI Pioneers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Founded on a single uncompromising thesis: enterprise research AI must be completely verifiable, citation-backed, and immune to memory loss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Michael Benezra */}
            <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg">
                  MB
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Michael Benezra</h3>
                  <span className="text-xs font-mono text-[#38bdf8] font-bold block">
                    Chief Executive Officer & Co-Founder
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Michael Benezra leads Signal87’s strategic direction, enterprise partnerships, and legal tech innovation. Under his leadership, Signal87 has pioneered verifiable document memory for high-stakes municipal, legislative, and corporate governance teams.
              </p>
            </div>

            {/* Michael Chavira */}
            <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg">
                  MC
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Michael Chavira</h3>
                  <span className="text-xs font-mono text-indigo-400 font-bold block">
                    Co-Founder & Chief Systems Architect
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Michael Chavira architects Signal87's ultra-low latency vector pipelines, long-context memory stores, and distributed OCR parsing nodes. His engineering principles ensure sub-second citation verification with zero data leakage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onSelectTab={onSelectTab}
        onOpenPrivacy={onOpenPrivacy}
        onOpenBlog={onOpenBlog}
        onOpenMedia={onOpenMedia}
      />
    </div>
  );
};
