# Vernac

Privacy-focused, client-side AI translation. OpenAI, Anthropic Claude, or local Ollama models. No sign-in. No third-party data sharing. No backend. Vernac puts a translation workspace directly in your browser where API keys stay in localStorage, translation text goes only to the provider you choose, and every major AI provider works through a single interface.

## Features

- **Multi-provider support:** OpenAI, Anthropic Claude, and Ollama work out of the box. Any OpenAI-compatible endpoint (LM Studio, Together AI, Groq) works through the custom endpoint option.
- **Privacy by architecture:** No backend server, no user accounts, no analytics. API keys never leave the browser. Translation text is sent only to the configured provider.
- **Auto-detect source language:** Set the source to auto-detect and Vernac identifies the language from your input text.
- **Dark and light themes:** Automatic detection based on system preference with manual toggle. Settings persist across sessions.
- **Keyboard shortcuts:** `Ctrl+Enter` to translate, `Ctrl+Shift+C` to copy, `Ctrl+Shift+L` to focus source, `Ctrl+,` to open settings.
- **Self-hostable:** Static files only. Deploy anywhere that serves HTML. No build step required for deployment.

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
git clone https://github.com/rezalabs/vernac.git
cd vernac
npm install
```

### Basic Usage

```bash
npm run dev
```

Open the URL printed in the terminal. Configure an API key through the Quick Setup panel or Settings drawer (`Ctrl+,`), then translate.

### Building for Production

```bash
npm run build
```

The output lands in `dist/`. Serve it with any static file server.

## Configuration

Vernac works immediately after setting an API key. Configuration is accessible through the Settings drawer (gear icon or `Ctrl+,`):

| Option | Description |
|--------|-------------|
| Provider | OpenAI Compatible, Anthropic Claude, or Local Ollama |
| Model | Changes per provider. Custom model names supported. |
| Custom Endpoint | Override the default API base URL for OpenAI Compatible mode |
| Reasoning | Controls reasoning depth for models that support extended thinking |
| Auto-detect | Automatically detect the source language from text |
| Auto-copy | Copy translation results to clipboard automatically |
| Preserve Formatting | Keep line breaks, spacing, and structure in translations |

All settings persist in localStorage.

## Supported Providers

| Provider | Endpoint | Key Required |
|----------|----------|-------------|
| OpenAI Compatible | `api.openai.com` or custom | Yes |
| Anthropic Claude | `api.anthropic.com` | Yes |
| Local Ollama | `localhost:11434` | No |

OpenAI Compatible mode accepts custom endpoints. Any service that exposes an OpenAI-compatible chat completions API works.

### Supported Languages

English (US/UK), Spanish, French, German, Italian, Portuguese (Portugal/Brazil), Dutch, Polish, Swedish, Norwegian, Danish, Finnish, Greek, Czech, Hungarian, Romanian, Chinese (Simplified/Traditional), Japanese, Korean, Thai, Vietnamese, Indonesian, Malay, Arabic, Hindi, Turkish, Russian. Source language can be set to auto-detect.

## API Reference

Vernac is a client-side application, not a library. The public surface is the UI itself.

- **`src/lib/`** contains all Svelte components
- **`src/app.css`** defines the design token system (CSS custom properties)
- **`src/main.ts`** is the application entry point

The component structure:

| File | Responsibility |
|------|---------------|
| `App.svelte` | Root layout, keyboard shortcuts, settings state |
| `Header.svelte` | Logo, theme toggle, settings trigger |
| `TranslationWorkspace.svelte` | Translation flow coordinator |
| `TextAreaPanel.svelte` | Source input and translated output panels |
| `LanguageSelector.svelte` | Language pair selection with auto-detect |
| `QuickSetup.svelte` | First-run API key configuration banner |
| `SettingsDrawer.svelte` | Full settings panel (provider, model, options) |
| `ConfirmModal.svelte` | Confirmation dialog for destructive actions |

## Contributing

Pull requests are not accepted. This project is AI-assisted and single-maintainer, every line is curated through a consistent workflow that external PRs would disrupt.

What is accepted:

- **Bug reports** with reproduction steps.
- **Feature requests** that align with the project's core principles.
- **Documentation corrections** for errors or omissions.

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for details.

This project is maintained by [RezaLabs](https://rezalabs.com).

## Changelog

Notable changes between versions are documented in [`CHANGELOG.md`](./CHANGELOG.md). The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## Development Process

This project is built with heavy assistance from large language models.

**Why?** The entire codebase, from architecture decisions down to individual line implementations, is produced through iterative prompting and review with AI. This is intentional. The goal is to test the limits of what AI can generate when held to strict quality standards.

**What this means for you:**
- Every commit and every release is reviewed and approved by a human. AI generates proposals; I accept, reject, or modify them.
- The project is a deliberate exercise in AI-assisted engineering. The output is curated, tested, and documented.
- If you find an issue, it is my failure as the maintainer to catch it, not an excuse that "the AI wrote it." I own all results.

This project is as much a product of AI capability as it is of human editorial judgment. You are welcome to judge both.

## Support

If this project saves you time or solves a problem you would otherwise pay to fix, consider supporting its continued development.

- [Buy Me a Coffee](https://buymeacoffee.com/rezalabs)
- [Ko-fi](https://ko-fi.com/rezalabs)

Sponsorship is never required, but always appreciated. It funds maintenance, tooling, and the compute needed to iterate with AI assistance at this scale.

## License

MIT License. See [`LICENSE`](./LICENSE) for the full text.

Copyright (c) 2026 [RezaLabs](https://rezalabs.com)
