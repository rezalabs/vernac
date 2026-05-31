# Security Policy

## Security Features

Vernac is designed with privacy and security as core principles:

- **Client-side only**: No backend server processes your data
- **Local API key storage**: API keys are stored only in your browser's localStorage
- **No tracking**: No analytics, cookies, or third-party tracking
- **Direct API calls**: Your translation text goes directly to your chosen AI provider

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do not** open a public GitHub issue for the vulnerability
2. Create a private GitHub vulnerability report using GitHub's Security Advisory feature
3. Or contact us through [RezaLabs](https://rezalabs.com)

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Response Timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Resolution target**: Critical issues within 14 days

### What to Expect

- Acknowledgment of your report
- Regular updates on investigation progress
- Credit in the release notes (if desired)
- Coordinated disclosure timeline

## Security Best Practices for Users

### API Key Safety

- Never share your API key with others
- Use environment-specific keys when possible
- Monitor your API usage through your provider's dashboard
- Rotate keys if you suspect compromise

### Deployment Security

- Deploy with HTTPS enabled
- Use a reputable hosting provider
- Keep dependencies updated
- Monitor for security advisories

### Browser Security

- Use a modern, updated browser
- Clear localStorage if switching devices
- Be cautious on shared/public computers

## Known Considerations

### localStorage

API keys are stored in browser localStorage. This is:
- **Secure from server-side access**: localStorage data is not sent to servers
- **Accessible to browser extensions**: Some extensions can read localStorage
- **Persistent across sessions**: Data remains until cleared

If you're concerned about extension access, consider:
- Using a dedicated browser profile for translation
- Regularly clearing your API key after use

### API Provider Security

Your translation text is sent directly to your chosen AI provider. Each provider has their own security policies:

- **OpenAI**: [OpenAI Security](https://openai.com/security)
- **Anthropic**: [Anthropic Security](https://www.anthropic.com/security)
- **Ollama**: Runs locally - no external network calls

## Dependency Security

We monitor dependencies for known vulnerabilities. To check yourself:

```bash
npm audit
```

## Changes to This Policy

This security policy may be updated periodically. Significant changes will be announced in release notes.

Thank you for helping keep Vernac secure!