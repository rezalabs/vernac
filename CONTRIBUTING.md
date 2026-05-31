# Contributing to Vernac

RezaLabs maintains high standards. This document defines them.

## Pull Requests Are Not Accepted

This project is maintained by a single developer using heavy AI assistance. Every line of code is generated, reviewed, and curated through an iterative prompting workflow. Pull requests are not accepted.

**Why:** The AI-assisted workflow produces code that is internally consistent in style, structure, and idiom. External contributions, even well-intentioned ones, introduce a maintenance burden: review, style alignment, test integration, and documentation updates that do not scale for a solo maintainer. The output standard is higher when one person owns every line.

## What Is Accepted

### Bug Reports

If you find a bug, open an issue. Include:

- Exact steps to reproduce.
- Expected behaviour vs actual behaviour.
- Browser and OS details.
- Provider and model configuration (if relevant).

Bugs with clear reproduction steps get fixed quickly.

### Feature Requests

Feature requests are welcome as issues. Describe:

- The problem you want to solve.
- Why the existing interface cannot solve it.
- What the ideal solution looks like.

Feature requests are evaluated against the project's core principles. If a request aligns, it gets implemented. If not, the reason is explained.

### Documentation Issues

Errors, omissions, or unclear sections in documentation are bugs. Report them with a reference to the specific file and section.

## Standards (Self-Imposed)

- **Code quality** is non-negotiable. Every function is touched multiple times before release.
- **TypeScript is mandatory.** All code is strictly typed. No `any`, no type assertions to bypass the checker.
- **Accessibility.** Semantic HTML, ARIA labels where needed, keyboard navigation, WCAG AA contrast.
- **Commits follow Conventional Commits.** Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- **Changelog is updated** before every release following Keep a Changelog.

## Development Setup

### Prerequisites

- Node.js 18 or later
- npm

### Getting Started

```bash
git clone https://github.com/rezalabs/vernac.git
cd vernac
npm install
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run TypeScript and Svelte type checking |

### Tech Stack

- **Framework:** Svelte 5
- **Build Tool:** Vite 8
- **Language:** TypeScript
- **Icons:** Lucide Svelte

## Attribution

All original code is licensed under the MIT License. Maintained by RezaLabs.
