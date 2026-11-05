# React UI Studio

An AI-powered, **frontend-only** UI studio built with React (Vite), Tailwind CSS, Framer Motion,
Lucide React and Three.js / React Three Fiber.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

Production build: `npm run build` and `npm run preview`.

## Pages

| Route         | What it does                                                                    |
| ------------- | ------------------------------------------------------------------------------- |
| `/`           | Hero with a live R3F background, micro UI previews, features and CTA            |
| `/components` | Filter/search 17 components, resize the viewport, view and copy the code        |
| `/effects`    | Framer Motion presets: fade, slide, bounce, magnetic, glow, spotlight, 3D tilt  |
| `/colors`     | Seven themes, hex/RGB copy buttons and the CSS variables for each               |
| `/templates`  | SaaS, Portfolio, E-commerce and Dashboard templates with live preview and code  |
| `/playground` | Visual controls (padding, radius, shadow, colors, text) with live JSX output    |
| `/ai-studio`  | Prompt-to-UI generator with a live preview and exportable React code            |

## AI Studio and Gemini

AI Studio works out of the box with a built-in local generator. To use Google Gemini instead,
paste your API key in the page. The key is stored only in your browser's `localStorage` and is sent
directly to `generativelanguage.googleapis.com`. There is no backend. If the Gemini call fails, the app
falls back to the local generator and tells you why.

## Theming

Themes live in `src/data/themesData.js`. Each theme sets CSS variables (`--bg`, `--surface`, `--fg`,
`--muted`, `--line`, `--primary`, `--accent`) as RGB triplets, which Tailwind consumes through
`tailwind.config.js` (for example `bg-surface`, `text-primary`, `border-line/50`).

## Notes

- The viewport resizer constrains the width of the preview container. Tailwind breakpoints still follow the
  browser window, so previews are built with flexible layouts that work at any width.
- Keyboard shortcut: `Ctrl/Cmd + K` opens global search.
