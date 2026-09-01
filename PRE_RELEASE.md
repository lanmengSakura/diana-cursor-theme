# Diana Cursor Theme 0.1.0-rc.1

Status: **source pre-release; no VSIX or GitHub Release yet**.

## Public implementation

- `Diana Night` and `Diana Day` are standard color-theme contributions.
- `visual-blueprint/` and its artwork are repository-only references and are excluded from the VSIX.
- No public adapter, debugging launcher, listener, watcher, process state, or user data is included.

## Compatibility snapshot

- Color-theme source prepared for Cursor's VS Code-compatible theme surface.
- Full visual blueprint was last verified on Cursor `3.17.21`.
- A newer Cursor build requires a fresh selector and interaction audit before any full-artwork compatibility claim.

## Final release gate

- Install a locally packaged VSIX into a clean Cursor profile.
- Verify day/night switching, editor, terminal, diff, settings, extension page, narrow/maximized layout, restart, and uninstall.
- Confirm the editor canvas retains native contrast and the theme never covers interactive controls.
- Inspect the VSIX file list and confirm `assets/` and `visual-blueprint/` are absent.
- Run `npm test` and record the tested Cursor version.
