# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Fixed
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

[Unreleased]: https://github.com/rezalabs/vernac/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/rezalabs/vernac/releases/tag/v1.0.0
