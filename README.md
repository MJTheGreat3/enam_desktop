# enam_desktop

An Electron desktop shell for the **ENAM** market-data dashboard — wraps
the same web frontend used by the server-side repos in a native desktop
window (`main.js` + `preload.js`, packaged with `package.json`).

This is one of a small set of related `enam_*` repos:

- **[`enam_server`](https://github.com/MJTheGreat3/enam_server)** /
  **[`deploy_enam`](https://github.com/MJTheGreat3/deploy_enam)** — the
  Flask backend(s) that serve the ENAM dashboard's data and templates.
- **`enam_desktop` (this repo)** — packages that same frontend (identical
  template and static-asset names: portfolio, mutual funds, news,
  bulk/block deals, insider trading, ATH matrix, corporate actions, volume
  reports) as a standalone Electron app instead of a browser page.

## Contents

```
main.js         Electron main process
preload.js      Electron preload script (renderer bridge)
package.json / package-lock.json
build/
  templates/     Same Jinja/HTML pages as the server frontend
  static/assets/  css, img
  static/js       Per-page client logic
  libs/           jQuery, DataTables, PapaParse, js-sha256
```

## Run it

```bash
npm install
npm start   # or: check package.json's "scripts" for the exact entry point
```

`package.json` was not inspected in detail for this draft — confirm the
actual `scripts` entries (e.g. `start`, `build`, `package`) before relying
on the command above.

## Notes

No README ships with this repo; this draft is based on the file tree
(`main.js`/`preload.js` confirm Electron) and its overlap with the
`enam_server`/`deploy_enam` frontend structure.
