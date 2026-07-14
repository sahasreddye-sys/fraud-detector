# Fraud Detection — Case File Site

A single-page portfolio site for the credit card fraud detection project. Pure HTML/CSS/JS,
no build step, no external runtime dependencies besides Google Fonts.

## Before you publish this

Several numbers on the page are **placeholders** standing in for your actual notebook
results. Search the files for these and swap in your real numbers:

- `index.html` → the four `data-target="…"` values in the `#results` section (PR-AUC,
  ROC-AUC, recall, precision)
- `index.html` → the bar widths/values in the model-comparison chart (`#results` section,
  the `<svg class="chart-svg">` with the five `.compare-row` groups)
- `index.html` → the `#evidence` gallery captions and the confusion-matrix numbers
- `index.html` → the two `id="repo-link"` / `id="repo-link-2"` anchors — point these at
  your actual GitHub repo URL

Everything else (copy, layout, the live ledger demo) is ready as-is.

## Deploying to GitHub Pages

1. Create a new GitHub repo (or use an existing one) and push these files to it,
   keeping this folder structure at the repo root:
   ```
   index.html
   css/style.css
   js/script.js
   .nojekyll
   ```
2. On GitHub: **Settings → Pages → Source** → choose the branch (usually `main`) and
   `/ (root)` as the folder → Save.
3. Wait 1-2 minutes, then visit `https://<your-username>.github.io/<repo-name>/`.

Notes:
- All asset paths in `index.html` are relative (`css/style.css`, not `/css/style.css`),
  which is what makes this work whether the site lives at the root of
  `username.github.io` or under a project subpath like
  `username.github.io/repo-name/`. Don't add a leading slash to these if you edit them.
- `.nojekyll` tells GitHub Pages to skip Jekyll processing, which isn't needed here but
  avoids edge cases with how some files get served.
- No build step, no `node_modules`, no bundler — just static files.
