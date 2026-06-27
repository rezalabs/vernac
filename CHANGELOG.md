# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
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
- Translate button now shows "Stop" with square icon while translation is active, replacing the indeterminate spinner
- Character count display now shows used/maximum ratio with color-coded threshold indicators

### Fixed
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

[Unreleased]: https://github.com/rezalabs/vernac/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/rezalabs/vernac/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/rezalabs/vernac/releases/tag/v1.0.0
