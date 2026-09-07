# Diana Cursor Theme 0.1.0-beta.2

Status: **public GitHub Beta with a color-theme VSIX and a separate opt-in runtime ZIP; stable release still pending**.

## Public implementation

- `Diana Night` and `Diana Day` are standard color-theme contributions.
- `visual-blueprint/` and its artwork are repository-only references and are excluded from the VSIX.
- The separate runtime ZIP includes the reviewed v3 adapter for Cursor 3.17.21 only. It requires explicit consent for a temporary loopback debugging session. The VSIX is still color-only.
- No watcher, machine-private adapter directory, pre-existing listener, process state or user data is distributed.

## Compatibility snapshot

- Color-theme source prepared for Cursor's VS Code-compatible theme surface.
- Full visual blueprint was last verified on Cursor `3.17.21`.
- v3 was retested on Cursor 3.17.21: system mode with the current Windows light preference, explicit light/dark, narrow-window input and click-through, artwork removal, settings restoration and full process/port cleanup.
- Eleven isolated real-CSS renderer cases supplement native evidence, including dark media and high contrast. They do not prove native OS theme-switch or all-screen compatibility.
- A newer Cursor build requires a fresh selector and interaction audit before any full-artwork compatibility claim.

## Remaining stable-release coverage

- Install a locally packaged VSIX into a clean Cursor profile.
- Verify day/night switching, editor, terminal, diff, settings, extension page, narrow/maximized layout, restart, and uninstall.
- Confirm the editor canvas retains native contrast and the theme never covers interactive controls.
- Inspect the VSIX file list and confirm `assets/` and `visual-blueprint/` are absent.
- Run `npm test` and record the tested Cursor version.
