# NSEC Prep HQ

A responsive, zero-build chemistry olympiad study dashboard built with plain HTML, CSS, and JavaScript.

## Features
- Five-day countdown with configurable start date
- Daily planner with chapter targets, notes, checkboxes, and selectable study date
- 31 chapter tracker across Physical, Inorganic, and Organic chemistry
- Diagnostic scoring with automatic accuracy and revision recommendations
- Append-only practice history for repeated attempts (individual entries can be deleted deliberately)
- Two-test-per-day target and detailed test history
- External links to chapter-wise NSEC PYQs, full papers, and official resources
- JSON export/import and local browser storage
- Mobile-friendly responsive UI

## Run
Open `index.html` in a modern browser, or serve the folder with a local static web server. No installation, API keys, or dependencies required. Fonts are loaded from Google Fonts when online; system fonts are used otherwise.

## Publish with GitHub Pages
1. Create a GitHub repository named `nsec-prep-dashboard`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to its root.
3. Open repository **Settings → Pages → Build and deployment** and choose **Deploy from a branch**, branch **main**, folder **/(root)**.
4. Visit `https://YOUR_USERNAME.github.io/nsec-prep-dashboard/` after deployment.

## Important
Progress is stored in browser `localStorage` on the current origin. GitHub Pages does not automatically synchronize it between devices. Export a backup frequently, especially before clearing browser data. There is no authentication or server database.

The PYQ library is a set of external resource links. It does **not** embed or claim ownership of copyrighted NSEC question papers. External URLs and resource coverage can change.

Recommendations use the latest diagnostic session: 75%+ = quick review and move on; 50–74% = targeted revision; below 50% = theory repair. These are study heuristics, not official exam cutoffs.