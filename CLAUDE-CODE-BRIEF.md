# Signal87 — design system migration brief

Read this first, then work one section at a time. Stop after each and let me review.

## Where things stand

`src/index.css` currently ends with ~150 generated override rules that force-repaint the app light by overriding the color utilities the components already use. That was a bridge to get off the dark theme without editing 25 files. It works, but it is the wrong long-term shape: every rule is `!important`, the components still carry dark-theme class names, and it cannot change structure — only color.

Your job is to replace that override layer with real styling in the components, and delete it when nothing depends on it anymore.

Do not delete the override layer up front. Migrate a component, verify it, then remove the rules that only served it. The app must render correctly at every commit.

## Design system

Define these as CSS custom properties in `src/index.css` and as Tailwind theme extensions. Every component should reference tokens, never raw hex.

```
--paper     #EDEFF2   page background
--card      #FFFFFF   surfaces
--raised    #F7F9FA   hover, secondary surfaces
--ink       #131C25   primary text, primary buttons
--ink-2     #3D4B58   body text
--slate     #6E7C89   metadata, labels, inactive states
--rule      #D3D9DE   borders
--rule-2    #E4E8EC   hairlines inside surfaces
--mark      #F0B429   the one accent: primary action, citation highlight
--mark-soft #FBEECB   citation background
--verify    #0F6E66   grounded / verified state
--alert     #BE4E36   errors, unverified
```

Type: **Archivo** for UI, **IBM Plex Mono** for citation IDs, timestamps, page numbers, confidence scores, counts, and small uppercase labels only — never for body text or disclaimers. Scale 28 / 20 / 16 / 14 / 12.5 / 10.5. Body 14px minimum on mobile, inputs 16px minimum always.

Radii: 10px controls, 14px cards, 20px sheets, 999px pills. Spacing on a 4px grid. One shadow in the whole system, used only on overlays and sheets: `0 10px 26px -18px rgba(19,28,37,.45)`.

Accent discipline: amber is the only accent. Blue is for links and Google Drive affordances only. Do not introduce indigo, violet, or purple — there is currently an indigo button in `DocumentDetailModal` that should become amber or ink.

## Order of work

Do these one at a time, in this order. After each, tell me what changed and stop.

1. **`src/index.css`** — add the token definitions and the Tailwind theme extension. Change nothing else yet. The override layer stays for now.

2. **`DocumentDetailModal.tsx`** — highest-value fix. The header title is currently `text-white` on what is now a light surface, so it is invisible. Rebuild the header: document type glyph, filename in 15px semibold ink truncating with an ellipsis, a mono metadata line beneath it, and a close button with a 44px hit area. Replace the indigo action button. Convert every `text-white` / `text-slate-3xx` to tokens.

3. **`ResearchAssistantView.tsx`** — the main surface. The answer thread needs: right-aligned question bubbles in `--ink`, left-aligned answers in `--ink-2` at 13.5px/1.62, and inline citation chips (mono, `--mark-soft` background, 1.5px `--mark` bottom border, 3px radius, 44px hit area). Add a verification trace card below each answer: hairline border, 12px radius, a header row with a `--verify` dot and a mono uppercase label, then one row per citation showing ref, filename and page (truncating), and a confidence percentage. The composer keeps its current behavior; restyle only.

4. **`DocumentLibraryView.tsx`** — file rows: type glyph, filename over a mono metadata line, status badge (Ready `--verify`, Indexing `--mark`, Failed `--alert`). The search input is currently `text-xs`, which makes iOS zoom on focus — it must be 16px. The filter chip row must scroll horizontally, not clip.

5. **`Sidebar.tsx`** — align the rail with the dock in `MobileDock.tsx` so desktop and mobile read as one product.

6. **Everything else** — modals and secondary views, same treatment.

7. **Delete the override layer** — remove sections 4 through 9 of `src/index.css` and fix whatever breaks. Sections 1 through 3 (base, iOS fixes, dock spacing) stay.

## Guardrails

- Do not change features, routes, data models, API calls, or auth.
- Do not touch `src/lib/`, `src/data/`, or `server.ts`.
- Keep `MobileDock.tsx` and the `visualViewport` logic in `App.tsx` as they are — those are working.
- Leave the Google brand colors in the Drive picker SVG alone.
- Run `npx tsc --noEmit` and `npx vite build` after each component. Both must pass.
- Every interactive element keeps a 44px hit area and a visible focus ring.
- Every input, textarea, and select stays at 16px or above.
- Do not use `100vh` anywhere. `100dvh` only.
- Anything pinned to a screen edge pads with `env(safe-area-inset-*)`.

## Reference

`signal87-option-a-reference.html` in this repo is a working mockup of the target: dock anatomy with measurements, all five mobile screens, and both desktop breakpoints. Open it in a browser rather than reading the source — it is a spec illustration, not code to copy.
