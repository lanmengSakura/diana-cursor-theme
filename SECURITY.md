# Security policy

## Public release boundary

The publishable VSIX contains only standard color-theme JSON and extension metadata. It does not patch Cursor resources, start a debugging endpoint, inspect the renderer, install a watcher, or retain account/session data.

`visual-blueprint/` contains inert CSS and local art for design review. The build-specific local adapter used during visual verification is intentionally excluded because it relies on renderer inspection, local loopback communication, and version-specific state. The public repository must not contain that adapter, its launch commands, ports, logs, screenshots, backups, or target-application binaries.

## Compatibility

Every compatibility claim is tied to the exact version listed in `PRE_RELEASE.md`. Updates to the target application require a new verification pass before release.

## Reporting

Do not include private account or session material in a report. Use GitHub Security Advisories for vulnerabilities and ordinary Issues for non-sensitive compatibility defects.
