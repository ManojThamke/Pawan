# Pawan Marke — Portfolio

React + TypeScript + Vite, with a lazily loaded React Three Fiber scene.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content

All text, links and project details are in **`src/data/portfolio.ts`**.

Values in square brackets are treated as missing and are **hidden** on the site:

| Placeholder | Where | What to put there |
|---|---|---|
| `[PORTRAIT ASSET]` | `profile.portrait` | Path to an approved photo in `/public`, e.g. `/portrait.jpg` |
| `[RESUME URL]` | `profile.resumeUrl` | A real resume link (shows a Resume button on About) |
| `[LIVE DEMO URL]` | each project's `liveDemo` | A verified deployment URL (shows a Live demo button) |

Add a `description` to an entry in `otherRepos` only after checking that repository's README.

## Structure

- `/` — 3D workspace hero → scroll moves the camera toward the laptop while the featured-projects sheet rises
- `/projects` — laptop shows the active project; glass carousel sheet (buttons, dots, ← → keys, swipe)
- `/projects/:slug` — case-study sheet over the scene, with previous/next/close and pause controls
- `/about` — portrait framed in the scene's glowing arch, with the biography in a rounded sheet

## Motion and accessibility

- The welcome sequence shows once per browser session. You can skip it with the button or Esc, and replay it from the footer or the About page.
- `prefers-reduced-motion` gives a static welcome screen, starts with animation paused and uses fades only.
- The pause button freezes the 3D scene and all looping CSS animation.
- `?lite`, missing WebGL or very low-end devices get an SVG illustration instead of the 3D scene.
- The laptop-screen and case-study visuals are original illustrative mockups, not screenshots.
