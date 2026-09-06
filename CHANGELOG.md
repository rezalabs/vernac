# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
- Add a workspace screenshot to the README

### Changed
-

### Deprecated
-

### Removed
-

### Fixed
-

### Security
-

## [1.2.0] - 2026-09-06

### Added
- Persist the selected language pair and restore it on return visits
- Persist source and translation drafts (debounced) so a refresh or accidental tab close keeps in-progress work
- Show a "Translating…" placeholder in the output panel while a request is in flight
- Show a warning banner when a response is cut off by the token limit (OpenAI `finish_reason`, Anthropic `stop_reason`) instead of silently returning partial text
- Treat empty model responses as actionable errors instead of silently clearing the output
- Validate the custom API endpoint in Settings (must be http/https) and warn about mixed-content blocking for http endpoints on secure pages
- Validate the custom model name in Settings and disable Save while invalid
- Add Enter-to-save in the Quick Setup API key field and focus the source editor after saving
- Restore focus to the settings trigger and modal opener on close, and move focus into the Settings drawer and confirm dialogs on open
- Add request timeout (120s) and cancellation via AbortController for translation operations
- Add stop button to cancel in-flight translations, with Escape and Ctrl+Enter keyboard support
- Add retry button in error banner for failed translations
- Add actionable error messages per HTTP status code (401, 403, 404, 429, 500+)
- Add contextual "Fix in Settings" link when errors relate to API key or endpoint configuration
- Add Escape key handler and Tab focus trap to confirmation dialogs
- Add system theme change listener for real-time light/dark switching when no explicit user preference is set
- Add visual confirmation feedback on API key save before the onboarding panel dismisses
- Add clear-all-settings confirmation dialog with danger-styled prompt to prevent accidental data loss
- Add custom API endpoint configuration for Ollama provider in Settings drawer
- Add online/offline detection with warning banner when internet connectivity is lost
- Add character limit threshold warnings to textarea panels (orange at 90%, red at 100%)

### Changed
- Ollama users no longer need an API key: the key requirement and the onboarding banner now respect the local provider
- Failed translations no longer clear the previous result, so work is never lost on error
- Timeout-triggered cancellation now reports a timeout message instead of "Translation cancelled"
- Automatic copy on completion now shows the same "Copied" confirmation as manual copy
- Keyboard shortcuts (copy, focus source, clear) match on physical key codes so they work on non-Latin keyboard layouts
- "Fix in Settings" in the error banner now opens the Settings drawer instead of only dismissing the message
- Character count on the output panel shows a plain count without a limit, since translations may legitimately exceed the input limit
- Translate button now shows "Stop" with square icon while translation is active, replacing the indeterminate spinner
- Character count display now shows used/maximum ratio with color-coded threshold indicators

### Fixed
- Fix Anthropic extended thinking: `max_tokens` now exceeds the thinking budget (the API rejects the old 4096 value for medium+ reasoning), and the first text block is extracted instead of assuming index 0 when thinking blocks lead the content array
- Fix Escape closing the Settings drawer underneath an open confirmation dialog; the dialog now owns Escape
- Fix Ctrl+Enter keyboard shortcut: now toggles translation on/off instead of only starting
- Fix Escape key behavior: now cancels in-flight translation in addition to dismissing errors
- Fix translate button disabled state: now disabled when input is empty instead of being disabled during translation
- Fix custom API endpoint field in Settings: clearing the field now removes the stale localStorage value
- Fix Ollama endpoint resolution: now honors custom endpoint from Settings instead of always using hardcoded localhost URL
- Fix em dash in package.json description
- Fix supported version table in SECURITY.md
- Fix duplicate entries in CODE_OF_CONDUCT.md
- Fix incomplete script listing in CONTRIBUTING.md
- Fix stylelint glob quoting for Windows compatibility
- Add .gitattributes for line ending normalization

## [1.1.0] - 2026-06-26

### Added
- Add support and donation links (Buy Me a Coffee, Ko-fi) to the Settings drawer

### Changed
- Redesign the interface around a hand-drawn "translator's notebook" theme: ink-on-paper palette, Bricolage Grotesque and Caveat typography, and a paper dot-grid texture
- Render panel, control, and banner borders as hand-drawn frames via RoughJS, with the wordmark underline and notebook pages sketching themselves in on load (anime.js), all respecting `prefers-reduced-motion`
- Replace the teal accent with a forest-green primary and a persimmon signature accent
- Update OpenAI model list to current lineup: gpt-5.5, gpt-5.4, gpt-5.4-mini
- Update Anthropic model list to current lineup: claude-opus-4-8, claude-sonnet-4-6, claude-haiku-4-5
- Change default model from deprecated gpt-4o-mini to gpt-5.5
- Add Extra High (xhigh) reasoning effort level matching current API

### Fixed
- Prevent the stacked translation panels from overlapping the action row on tablet and mobile widths; the page now grows and scrolls below 1024px
- Sync auto-detect setting from Settings drawer without requiring page reload
- Allow clearing saved API key via the Settings save flow
- Prevent duplicate source and target languages when swapping with auto-detect enabled
- Guard clipboard write operations against unhandled rejections in insecure contexts

## [1.0.0] - 2026-04-26

### Added
- Client-side translation using OpenAI, Anthropic, and Ollama APIs.
- Privacy-focused design with no backend server.
- API key stored locally in browser (localStorage).
- Multi-provider support: OpenAI Compatible, Anthropic Claude, Local Ollama.
- Custom API endpoint support for OpenAI-compatible providers.
- Extended thinking/reasoning support for compatible models.
- Language selection with auto-detect capability.
- Dark and light theme with automatic detection and manual toggle.
- Responsive design for desktop and mobile.
- Quick setup panel for first-run API key configuration.
- Full settings drawer with provider and model selection.
- Auto-copy translation results option.
- Character count display for text inputs.
- Keyboard shortcut for settings (`Ctrl+,`).
- Open source release with MIT license.

### Security
- No backend server. Purely client-side application.
- API keys stored only in localStorage.
- Direct API calls to the configured provider.
- No analytics or tracking.

[Unreleased]: https://github.com/rezalabs/vernac/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/rezalabs/vernac/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/rezalabs/vernac/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/rezalabs/vernac/releases/tag/v1.0.0
