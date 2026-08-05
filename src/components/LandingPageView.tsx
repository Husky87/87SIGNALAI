import React, { useState } from 'react';
import { Signal87Logo } from './Signal87Logo';
import { Shield, FileText, GitFork, Zap, ArrowUp } from 'lucide-react';
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

/* Fonts are set inline rather than through a class so nothing in the
   cascade can override them. index.html loads both from Google Fonts. */
const SANS = '"Archivo", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const EXAMPLE_QUESTIONS = [
  'What are the post-closing indemnity limits?',
  'Compare payment terms across all contracts',
  'Summarize Q3 revenue by segment',
  'Flag any change-of-control triggers'
];

const CITATIONS = [
  { ref: 'SPA\u00B78.2', src: 'Meridian_SPA_v7.pdf \u00B7 p.44', pct: '98%' },
  { ref: 'SPA\u00B78.4', src: 'Meridian_SPA_v7.pdf \u00B7 p.45', pct: '96%' },
  { ref: 'BM\u00B703', src: 'Board_Minutes_Mar.pdf \u00B7 p.6', pct: '88%' }
];

const FIGURES = [
  { n: '212', l: 'Pages read' },
  { n: '4', l: 'Sources' },
  { n: '98%', l: 'Grounded' }
];

const CAPABILITIES = [
  {
    Icon: FileText,
    title: 'Direct paragraph citations',
    body: 'Tap any citation to open the exact page and paragraph in your document. No guesswork, no invented clauses.',
    color: '#131C25'
  },
  {
    Icon: GitFork,
    title: 'Multi-contract matrix',
    body: 'Compare indemnity caps, renewal dates, and compliance clauses across dozens of agreements at once.',
    color: '#131C25'
  },
  {
    Icon: Shield,
    title: 'Zero training policy',
    body: 'Your documents and query history stay isolated and are never used for public model training.',
    color: '#0F6E66'
  }
];

const LEADERS = [
  {
    initials: 'MB',
    name: 'Michael Benezra',
    role: 'Chief Executive Officer & Co-Founder',
    bio: 'Michael leads Signal87\u2019s strategic direction, enterprise partnerships, and legal technology work. Under his leadership Signal87 pioneered verifiable document memory for municipal, legislative, and corporate governance teams.'
  },
  {
    initials: 'MC',
    name: 'Michael Chavira',
    role: 'Co-Founder & Chief Systems Architect',
    bio: 'Michael architects Signal87\u2019s low-latency vector pipelines, long-context memory stores, and distributed OCR parsing. His engineering principles keep citation verification sub-second with zero data leakage.'
  }
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGoogleSignIn,
  onEnterDemo,
  onOpenPrivacy,
  onOpenBlog,
  onOpenMedia,
  onSelectTab
}) => {
  const [question, setQuestion] = useState('');

  return (
    <div
      className="min-h-screen bg-[#EDEFF2] text-[#131C25] antialiased flex flex-col"
      style={{ fontFamily: SANS }}
    >
      {/* ---------- Nav ---------- */}
      <header className="sticky top-0 z-50 bg-[#EDEFF2]/95 backdrop-blur-md border-b border-[#D3D9DE]">
        <div
          className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-8 py-3"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))'
          }}
        >
          <div className="flex items-center gap-2.5">
            <Signal87Logo size={30} />
            <span className="font-extrabold text-[#131C25] text-[17px] tracking-[-0.03em]">
              Signal87
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-[#3D4B58]">
            <a href="#capabilities" className="px-3 py-2 hover:text-[#131C25] transition-colors">
              How it works
            </a>
            <a href="#team" className="px-3 py-2 hover:text-[#131C25] transition-colors">
              Team
            </a>
            <button
              onClick={onOpenBlog}
              className="px-3 py-2 hover:text-[#131C25] transition-colors cursor-pointer"
              style={{ fontFamily: SANS }}
            >
              Blog
            </button>
          </nav>

          <button
            onClick={onGoogleSignIn}
            className="min-h-[44px] px-3 text-[13px] font-semibold text-[#3D4B58] hover:text-[#131C25] transition-colors cursor-pointer"
            style={{ fontFamily: SANS }}
          >
            Log in
          </button>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="flex-1 px-4 sm:px-8 pt-10 pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: question-first */}
          <div className="lg:col-span-6 flex flex-col">
            <span
              className="text-[9.5px] font-semibold uppercase text-[#6E7C89]"
              style={{ fontFamily: MONO, letterSpacing: '0.15em' }}
            >
              Answers from your own files
            </span>

            <h1
              className="text-[34px] sm:text-[50px] lg:text-[56px] font-extrabold text-[#131C25] mt-3"
              style={{ letterSpacing: '-0.038em', lineHeight: 1.02 }}
            >
              What do you
              <br />
              need to know
              <br />
              from your{' '}
              <span
                style={{
                  background: 'linear-gradient(transparent 64%, #FBEECB 64%)',
                  padding: '0 0.04em'
                }}
              >
                files
              </span>
              ?
            </h1>

            <p className="text-[14px] sm:text-[16px] leading-[1.55] text-[#3D4B58] mt-4 max-w-[38ch]">
              Ask first. Upload after. Every answer arrives with the page it came from.
            </p>

            <div className="mt-7 border-t border-[#E4E8EC]">
              {EXAMPLE_QUESTIONS.map((q, i) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="w-full min-h-[48px] flex items-center gap-3 py-3 border-b border-[#E4E8EC] text-left group cursor-pointer"
                  style={{ fontFamily: SANS }}
                >
                  <span
                    className="text-[9px] font-semibold text-[#6E7C89] flex-shrink-0"
                    style={{ fontFamily: MONO, letterSpacing: '0.1em' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-[13.5px] text-[#131C25]">{q}</span>
                  <span className="w-[9px] h-[2px] bg-[#F0B429] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2.5 border border-[#D3D9DE] rounded-[22px] bg-[#FBFCFC] py-2 pl-4 pr-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onEnterDemo();
                }}
                placeholder="Ask anything"
                aria-label="Ask a question"
                className="flex-1 min-w-0 bg-transparent border-0 outline-hidden text-[16px] text-[#131C25] placeholder-[#8A95A0]"
                style={{ fontFamily: SANS }}
              />
              <button
                onClick={onEnterDemo}
                aria-label="Ask"
                className="w-[38px] h-[38px] flex-shrink-0 rounded-full bg-[#F0B429] text-[#131C25] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              >
                <ArrowUp size={18} strokeWidth={2.6} />
              </button>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={onEnterDemo}
                className="flex-1 min-h-[50px] rounded-[12px] bg-[#131C25] text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
                style={{ fontFamily: SANS, letterSpacing: '-0.012em' }}
              >
                <Zap size={16} className="text-[#F0B429]" />
                Try it &mdash; no account needed
              </button>
              <button
                onClick={onGoogleSignIn}
                className="flex-1 min-h-[50px] rounded-[12px] bg-white text-[#131C25] border border-[#D3D9DE] text-[15px] font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
                style={{ fontFamily: SANS, letterSpacing: '-0.012em' }}
              >
                Sign in with Google
              </button>
            </div>

            <p
              className="text-[8.5px] text-[#6E7C89] mt-3 text-center sm:text-left"
              style={{ fontFamily: MONO, letterSpacing: '0.08em' }}
            >
              NO CARD REQUIRED &middot; YOUR FILES STAY PRIVATE
            </p>
          </div>

          {/* Right: verification specimen */}
          <div className="lg:col-span-6 w-full">
            <div className="border border-[#D3D9DE] rounded-[14px] bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F7F9FA] border-b border-[#E4E8EC]">
                <span className="w-[6px] h-[6px] rounded-full bg-[#0F6E66] flex-shrink-0" />
                <span
                  className="text-[9px] font-semibold uppercase text-[#0F6E66]"
                  style={{ fontFamily: MONO, letterSpacing: '0.11em' }}
                >
                  Verification trace
                </span>
              </div>

              <div className="px-3 py-3.5">
                <p className="text-[13px] leading-[1.6] text-[#3D4B58] m-0">
                  Survival ends 18 months after closing{' '}
                  <span
                    className="text-[9.5px] font-semibold bg-[#FBEECB] text-[#7A5A08] rounded-[3px] px-1 py-0.5 whitespace-nowrap"
                    style={{ fontFamily: MONO, borderBottom: '1.5px solid #F0B429' }}
                  >
                    SPA&middot;8.2
                  </span>
                  , with recovery capped at 12% of consideration{' '}
                  <span
                    className="text-[9.5px] font-semibold bg-[#FBEECB] text-[#7A5A08] rounded-[3px] px-1 py-0.5 whitespace-nowrap"
                    style={{ fontFamily: MONO, borderBottom: '1.5px solid #F0B429' }}
                  >
                    SPA&middot;8.4
                  </span>
                  .
                </p>
              </div>

              {CITATIONS.map((c) => (
                <div
                  key={c.ref}
                  className="flex items-center gap-2.5 px-3 py-2.5 border-t border-[#E4E8EC]"
                >
                  <span
                    className="text-[9px] text-[#6E7C89] flex-shrink-0 w-[46px]"
                    style={{ fontFamily: MONO }}
                  >
                    {c.ref}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-[11.5px] text-[#131C25]">
                    {c.src}
                  </span>
                  <span
                    className="text-[9.5px] font-semibold text-[#0F6E66] flex-shrink-0"
                    style={{ fontFamily: MONO }}
                  >
                    {c.pct}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex mt-5 border-t border-b border-[#E4E8EC]">
              {FIGURES.map((f, i) => (
                <div
                  key={f.l}
                  className={`flex-1 py-3 ${i > 0 ? 'border-l border-[#E4E8EC] pl-4' : ''}`}
                >
                  <b
                    className="block text-[17px] font-semibold text-[#131C25]"
                    style={{ fontFamily: MONO, letterSpacing: '-0.02em' }}
                  >
                    {f.n}
                  </b>
                  <span
                    className="block text-[8.5px] font-semibold uppercase text-[#6E7C89] mt-1"
                    style={{ fontFamily: MONO, letterSpacing: '0.1em' }}
                  >
                    {f.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Capabilities ---------- */}
      <section id="capabilities" className="py-14 px-4 sm:px-8 bg-white border-t border-[#D3D9DE]">
        <div className="max-w-7xl mx-auto">
          <span
            className="text-[9.5px] font-semibold uppercase text-[#6E7C89]"
            style={{ fontFamily: MONO, letterSpacing: '0.15em' }}
          >
            Grounded legal intelligence
          </span>
          <h2
            className="text-[24px] sm:text-[32px] font-extrabold text-[#131C25] mt-2.5 max-w-[24ch]"
            style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Why legal and regulatory teams trust Signal87
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-9">
            {CAPABILITIES.map(({ Icon, title, body, color }) => (
              <div key={title} className="p-5 border border-[#D3D9DE] rounded-[14px] bg-[#FBFCFC]">
                <Icon size={22} strokeWidth={1.9} color={color} />
                <h3
                  className="font-bold text-[#131C25] text-[15px] mt-3.5"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {title}
                </h3>
                <p className="text-[13px] text-[#3D4B58] leading-[1.55] mt-2">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Team ---------- */}
      <section
        id="team"
        className="py-14 sm:py-20 px-4 sm:px-8 bg-[#EDEFF2] border-t border-[#D3D9DE]"
      >
        <div className="max-w-5xl mx-auto">
          <span
            className="text-[9.5px] font-semibold uppercase text-[#6E7C89]"
            style={{ fontFamily: MONO, letterSpacing: '0.15em' }}
          >
            Executive leadership
          </span>
          <h2
            className="text-[24px] sm:text-[34px] font-extrabold text-[#131C25] mt-2.5 max-w-[22ch]"
            style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Built on one uncompromising thesis
          </h2>
          <p className="text-[14px] text-[#3D4B58] leading-[1.55] mt-3 max-w-[56ch]">
            Enterprise research AI must be verifiable, citation-backed, and immune to memory loss.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-9">
            {LEADERS.map((p) => (
              <div key={p.initials} className="bg-white p-6 rounded-[14px] border border-[#D3D9DE]">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-[52px] h-[52px] flex-shrink-0 rounded-[12px] bg-[#131C25] text-white font-bold text-[17px] flex items-center justify-center"
                    style={{ fontFamily: MONO }}
                  >
                    {p.initials}
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="text-[16px] font-extrabold text-[#131C25]"
                      style={{ letterSpacing: '-0.025em' }}
                    >
                      {p.name}
                    </h3>
                    <span
                      className="text-[9px] font-semibold uppercase text-[#6E7C89] block mt-1"
                      style={{ fontFamily: MONO, letterSpacing: '0.1em' }}
                    >
                      {p.role}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-[#3D4B58] leading-[1.6] mt-4">{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer
        onSelectTab={onSelectTab}
        onOpenPrivacy={onOpenPrivacy}
        onOpenBlog={onOpenBlog}
        onOpenMedia={onOpenMedia}
      />
    </div>
  );
};
