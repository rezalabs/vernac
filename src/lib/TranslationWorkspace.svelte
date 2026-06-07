<script lang="ts">
  import { Trash2, Sparkles, Copy, Check } from 'lucide-svelte';
  import LanguageSelector from './LanguageSelector.svelte';
  import TextAreaPanel from './TextAreaPanel.svelte';

  function handleKeydown(event: KeyboardEvent) {
    const isMod = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    // Ctrl/Cmd + Enter → Translate
    if (isMod && event.key === 'Enter') {
      event.preventDefault();
      if (!isTranslating) handleTranslate();
      return;
    }

    // Ctrl/Cmd + Shift + C → Copy
    if (isMod && isShift && event.key === 'C') {
      event.preventDefault();
      if (translatedText) handleCopy();
      return;
    }

    // Ctrl/Cmd + Shift + L → Focus source textarea
    if (isMod && isShift && event.key === 'L') {
      event.preventDefault();
      const el = document.getElementById('source-editor');
      if (el) {
        el.focus();
        const textarea = el as HTMLTextAreaElement;
        const len = textarea.value.length;
        textarea.setSelectionRange(len, len);
      }
      return;
    }

    // Ctrl/Cmd + Shift + Backspace → Clear
    if (isMod && isShift && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
      handleClear();
      return;
    }

    // Escape → Dismiss error
    if (event.key === 'Escape' && translationError) {
      translationError = null;
      return;
    }
  }

  let sourceLang = "Detect language";
  let targetLang = "English (US)";
  let sourceText = "";
  let translatedText = "";
  let isTranslating = false;
  let translationError: string | null = null;
  let copied = false;
  let copiedTimer: ReturnType<typeof setTimeout> | null = null;
  let autoDetect = getAutoDetect();
  export let settingsClosedAt: number = 0;

  $: if (settingsClosedAt > 0) {
    autoDetect = getAutoDetect();
  }

  // API configuration from localStorage
  function getApiKey(): string | null {
    return localStorage.getItem('apiKey');
  }

  function getProvider(): string {
    return localStorage.getItem('provider') || 'OpenAI Compatible';
  }

  function getModel(): string {
    const useCustomModel = localStorage.getItem('useCustomModel') === 'true';
    if (useCustomModel) {
      return localStorage.getItem('customModel') || 'gpt-4o-mini';
    }
    return localStorage.getItem('model') || 'gpt-4o-mini';
  }

  function getReasoningEffort(): string {
    return localStorage.getItem('reasoningEffort') || 'medium';
  }

  function getPreserveFormatting(): boolean {
    return localStorage.getItem('preserveFormatting') !== 'false';
  }

  function getAutoDetect(): boolean {
    return localStorage.getItem('autoDetect') !== 'false';
  }

  function getApiEndpoint(): string {
    const provider = getProvider();
    if (provider === 'Anthropic') {
      return 'https://api.anthropic.com/v1/messages';
    } else if (provider === 'Local (Ollama)') {
      return 'http://localhost:11434/api/chat';
    }
    return localStorage.getItem('apiEndpoint') || 'https://api.openai.com/v1/chat/completions';
  }

  function getDisplayLabel(langName: string): string {
    if (langName === 'English (US)') return 'English';
    if (langName === 'English (UK)') return 'English (UK)';
    if (langName === 'Portuguese (Brazil)') return 'Portuguese (BR)';
    if (langName === 'Chinese (Simplified)') return 'Chinese (Simplified)';
    if (langName === 'Chinese (Traditional)') return 'Chinese (Traditional)';
    return langName;
  }

  function getLanguageCode(langName: string): string {
    const langMap: Record<string, string> = {
      'Detect language': 'auto-detect',
      'English (US)': 'English',
      'English (UK)': 'English',
      'Spanish': 'Spanish',
      'French': 'French',
      'German': 'German',
      'Italian': 'Italian',
      'Portuguese': 'Portuguese',
      'Portuguese (Brazil)': 'Portuguese',
      'Russian': 'Russian',
      'Chinese (Simplified)': 'Chinese (Simplified)',
      'Chinese (Traditional)': 'Chinese (Traditional)',
      'Japanese': 'Japanese',
      'Korean': 'Korean',
      'Arabic': 'Arabic',
      'Hindi': 'Hindi',
      'Turkish': 'Turkish',
      'Dutch': 'Dutch',
      'Polish': 'Polish',
      'Swedish': 'Swedish',
      'Norwegian': 'Norwegian',
      'Danish': 'Danish',
      'Finnish': 'Finnish',
      'Greek': 'Greek',
      'Czech': 'Czech',
      'Hungarian': 'Hungarian',
      'Romanian': 'Romanian',
      'Thai': 'Thai',
      'Vietnamese': 'Vietnamese',
      'Indonesian': 'Indonesian',
      'Malay': 'Malay'
    };
    return langMap[langName] || langName;
  }

  async function handleTranslate() {
    if (!sourceText.trim()) {
      translationError = "Enter text to translate.";
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      translationError = "API key required. Enter one above or open Settings to configure.";
      return;
    }

    isTranslating = true;
    translationError = null;

    try {
      const provider = getProvider();
      const model = getModel();
      const endpoint = getApiEndpoint();
      const reasoningEffort = getReasoningEffort();
      const preserveFormatting = getPreserveFormatting();
      const sourceLanguage = sourceLang === "Detect language" ? "the source language (auto-detect)" : getLanguageCode(sourceLang);
      const targetLanguage = getLanguageCode(targetLang);

      let formattingInstruction: string;
      if (preserveFormatting) {
        formattingInstruction = "Preserve the original formatting, line breaks, and structure.";
      } else {
        formattingInstruction = "Convert to plain text format - remove original formatting, line breaks, and structural elements. Translate only the core content.";
      }

      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. ${formattingInstruction} Only provide the translation without any explanations or additional text.\n\nText to translate:\n${sourceText}`;

      if (provider === 'Anthropic') {
        const body: Record<string, unknown> = {
          model: model,
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }]
        };

        if (reasoningEffort !== 'none') {
          const budgetTokens = reasoningEffort === 'high' ? 4096 : reasoningEffort === 'low' ? 256 : 1024;
          body.thinking = { type: 'enabled', budget_tokens: budgetTokens };
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        translatedText = data.content?.[0]?.text || '';
      } else if (provider === 'Local (Ollama)') {
        const body: Record<string, unknown> = {
          model: model,
          messages: [{ role: 'user', content: prompt }],
          stream: false
        };

        if (reasoningEffort !== 'none') {
          const ctxSize = reasoningEffort === 'high' ? 32768 : reasoningEffort === 'low' ? 4096 : 16384;
          body.options = { num_ctx: ctxSize };
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`Ollama error: ${response.status}`);
        }

        const data = await response.json();
        translatedText = data.message?.content || '';
      } else {
        const body: Record<string, unknown> = {
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096
        };

        if (reasoningEffort !== 'none') {
          body.reasoning_effort = reasoningEffort;
          delete body.max_tokens;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        translatedText = data.choices?.[0]?.message?.content || '';
      }

      if (localStorage.getItem('autoCopy') === 'true' && translatedText && navigator.clipboard) {
        navigator.clipboard.writeText(translatedText).catch(() => {});
      }
    } catch (err) {
      translationError = err instanceof Error ? err.message : 'Translation failed. Check your API configuration.';
      translatedText = '';
    } finally {
      isTranslating = false;
    }
  }

  function handleSwap() {
    const langTemp = sourceLang;
    sourceLang = targetLang;
    targetLang = langTemp === "Detect language" ? "English (US)" : langTemp;
    if (sourceLang === targetLang) {
      targetLang = "Spanish";
    }
    const textTemp = sourceText;
    sourceText = translatedText;
    translatedText = textTemp;
  }

  function handleClear() {
    sourceText = "";
    translatedText = "";
    translationError = null;
  }

  async function handleCopy() {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(translatedText);
    } catch {
      return;
    }
    copied = true;
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      copied = false;
      copiedTimer = null;
    }, 1400);
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="workspace card">
  <LanguageSelector bind:sourceLang bind:targetLang onSwap={handleSwap} autoDetect={autoDetect} />

  {#if translationError}
    <div class="error-message" role="alert">
      <span class="error-icon" aria-hidden="true">!</span>
      <span>{translationError}</span>
      <button class="error-dismiss" on:click={() => translationError = null} aria-label="Dismiss error">&times;</button>
    </div>
  {/if}

  <div class="panels-container">
    <TextAreaPanel
      label="Source"
      bind:value={sourceText}
      placeholder="Enter text to translate..."
      id="source-editor"
    />

    <TextAreaPanel
      label={getDisplayLabel(targetLang)}
      bind:value={translatedText}
      placeholder="Translation will appear here..."
      readonly={true}
    />
  </div>

  <div class="action-row">
    <button class="secondary-button" on:click={handleClear} disabled={!sourceText && !translatedText} title="Clear (Ctrl+Shift+Backspace)">
      <Trash2 size={16} />
      <span>Clear</span>
    </button>

    <div class="action-center">
      <button class="translate-button" on:click={handleTranslate} disabled={isTranslating} title="Translate (Ctrl+Enter)">
        {#if isTranslating}
          <svg class="spinner" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          <span>Translating…</span>
        {:else}
          <Sparkles size={18} />
          <span>Translate</span>
        {/if}
      </button>
    </div>

    <button class="copy-button" on:click={handleCopy} disabled={!translatedText} title="Copy (Ctrl+Shift+C)" class:copied>
      {#if copied}
        <Check size={16} />
        <span>Copied</span>
      {:else}
        <Copy size={16} />
        <span>Copy</span>
      {/if}
    </button>
  </div>
</div>

<style>
  .workspace {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    min-height: 0;
    background: var(--color-surface);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: var(--color-danger-bg);
    border: 1px solid var(--color-danger-border);
    border-radius: var(--radius-md);
    color: var(--color-danger);
    font-size: 13px;
    line-height: 1.5;
  }

  .error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-danger);
    color: var(--color-accent-text);
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .error-dismiss {
    margin-left: auto;
    font-size: 18px;
    color: var(--color-danger);
    opacity: 0.6;
    padding: 0 var(--space-1);
    line-height: 1;
  }

  .error-dismiss:hover {
    opacity: 1;
  }

  .panels-container {
    flex: 1;
    display: flex;
    gap: var(--space-4);
    min-height: 0;
  }

  .action-row {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-1);
  }

  .action-center {
    display: flex;
    justify-content: center;
    flex: 1;
  }

  .translate-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-10);
    background: var(--color-accent);
    color: var(--color-accent-text);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s ease;
  }

  .translate-button:hover:not(:disabled) {
    background: var(--color-accent-hover);
    box-shadow: var(--shadow-sm);
  }

  .translate-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spinner {
    animation: spin 0.8s linear infinite;
  }

  .secondary-button,
  .copy-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .secondary-button:hover:not(:disabled),
  .copy-button:hover:not(:disabled) {
    background: var(--color-surface-alt);
    border-color: var(--color-border-hover);
    color: var(--color-text-primary);
  }

  .secondary-button:disabled,
  .copy-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .copy-button.copied {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-accent-text);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    .panels-container {
      flex-direction: column;
    }
  }

  @media (max-width: 640px) {
    .action-row {
      flex-direction: column;
      gap: var(--space-3);
    }
    .action-center {
      width: 100%;
    }
    .translate-button {
      width: 100%;
    }
    .secondary-button,
    .copy-button {
      width: 100%;
      justify-content: center;
    }
  }
</style>
