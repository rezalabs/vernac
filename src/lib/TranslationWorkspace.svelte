<script lang="ts">
  import { Trash2, Sparkles, Copy, Check, AlertCircle, RotateCcw, Square } from 'lucide-svelte';
  import LanguageSelector from './LanguageSelector.svelte';
  import TextAreaPanel from './TextAreaPanel.svelte';
  import { roughFrame } from './rough';
  import { ALL_LANGUAGES, DETECT_LANGUAGE, DEFAULT_TARGET_LANGUAGE } from './languages';

  const MAX_SOURCE_CHARS = 10000;
  const DRAFT_STORAGE_KEYS = { source: 'draftSource', translation: 'draftTranslation' } as const;
  const LANGUAGE_STORAGE_KEYS = { source: 'sourceLang', target: 'targetLang' } as const;
  const TRUNCATED_MESSAGE =
    'Translation may be incomplete: the response reached the token limit. Try translating a shorter passage.';
  const EMPTY_RESPONSE_MESSAGE =
    'The model returned an empty response. Try again, or switch models in Settings.';

  function handleKeydown(event: KeyboardEvent) {
    const isMod = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    // Ctrl/Cmd + Enter → Translate or Stop
    if (isMod && event.key === 'Enter') {
      event.preventDefault();
      if (isTranslating) {
        handleStop();
      } else {
        handleTranslate();
      }
      return;
    }

    // Ctrl/Cmd + Shift + C → Copy. Matched on physical key code so the shortcut
    // works on non-Latin keyboard layouts where event.key differs.
    if (isMod && isShift && event.code === 'KeyC') {
      event.preventDefault();
      if (translatedText) handleCopy();
      return;
    }

    // Ctrl/Cmd + Shift + L → Focus source textarea
    if (isMod && isShift && event.code === 'KeyL') {
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
    if (isMod && isShift && (event.code === 'Backspace' || event.code === 'Delete')) {
      event.preventDefault();
      handleClear();
      return;
    }

    // Escape → Stop translation or dismiss error, but never underneath an
    // open confirm dialog, which owns Escape while it is on screen.
    if (event.key === 'Escape' && !document.querySelector('[data-confirm-modal]')) {
      if (isTranslating && abortController) {
        event.preventDefault();
        handleStop();
        return;
      }
      if (translationError) {
        translationError = null;
        return;
      }
    }
  }

  // Restore persisted state: the language pair survives reloads, and so does
  // in-progress work. Stored values are validated so stale or tampered data
  // falls back to defaults instead of desyncing the selects.
  function getStoredLanguage(key: string, fallback: string): string {
    try {
      const stored = localStorage.getItem(key);
      if (stored && (stored === DETECT_LANGUAGE || ALL_LANGUAGES.includes(stored))) {
        return stored;
      }
    } catch {
      // localStorage unavailable (privacy mode); fall through to the default.
    }
    return fallback;
  }

  function getStoredDraft(key: string): string {
    try {
      return localStorage.getItem(key)?.slice(0, MAX_SOURCE_CHARS) || '';
    } catch {
      return '';
    }
  }

  let sourceLang = getStoredLanguage(LANGUAGE_STORAGE_KEYS.source, DETECT_LANGUAGE);
  let targetLang = getStoredLanguage(LANGUAGE_STORAGE_KEYS.target, DEFAULT_TARGET_LANGUAGE);
  let sourceText = getStoredDraft(DRAFT_STORAGE_KEYS.source);
  let translatedText = getStoredDraft(DRAFT_STORAGE_KEYS.translation);
  let isTranslating = false;
  let abortController: AbortController | null = null;
  let translationError: string | null = null;
  let copied = false;
  let copiedTimer: ReturnType<typeof setTimeout> | null = null;
  let autoDetect = getAutoDetect();
  export let settingsClosedAt: number = 0;
  // Lets the error banner's "Fix in Settings" action actually open the drawer
  // instead of just dismissing the message.
  export let onOpenSettings: () => void = () => {};

  $: if (settingsClosedAt > 0) {
    autoDetect = getAutoDetect();
  }

  // Remember the last language pair so returning users pick up where they left off.
  $: persistLanguages(sourceLang, targetLang);

  function persistLanguages(source: string, target: string) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEYS.source, source);
      localStorage.setItem(LANGUAGE_STORAGE_KEYS.target, target);
    } catch {
      // Preferences are best-effort; translation still works without them.
    }
  }

  // Debounced draft persistence: a refresh or accidental tab close keeps the
  // text on both sides instead of silently losing it.
  let draftTimer: ReturnType<typeof setTimeout> | null = null;

  $: persistDrafts(sourceText, translatedText);

  function persistDrafts(source: string, translated: string) {
    if (draftTimer) clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEYS.source, source);
        localStorage.setItem(DRAFT_STORAGE_KEYS.translation, translated);
      } catch {
        // Quota or privacy-mode failures must not break typing.
      }
    }, 300);
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
      return localStorage.getItem('customModel') || 'gpt-5.5';
    }
    return localStorage.getItem('model') || 'gpt-5.5';
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
    const customEndpoint = localStorage.getItem('apiEndpoint');
    if (provider === 'Anthropic') {
      return customEndpoint || 'https://api.anthropic.com/v1/messages';
    } else if (provider === 'Local (Ollama)') {
      return customEndpoint || 'http://localhost:11434/api/chat';
    }
    return customEndpoint || 'https://api.openai.com/v1/chat/completions';
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

  function formatApiError(err: unknown, status?: number): string {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return 'Translation cancelled.';
    }
    const message = err instanceof Error ? err.message : 'Translation failed.';
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return 'Network error. Check your internet connection and try again.';
    }
    if (status) {
      if (status === 401) return 'Invalid API key. Check your key in Settings.';
      if (status === 403) return 'Access denied. Your API key may lack permission for this model.';
      if (status === 404) return 'Endpoint not found. Verify your API configuration in Settings.';
      if (status === 429) return 'Rate limited. Wait a moment and try again.';
      if (status >= 500) return 'Server error. The API service may be experiencing issues. Try again.';
    }
    if (message.includes('timed out') || message.includes('timeout')) {
      return 'Translation timed out. The text may be too long or the model is slow to respond. Try shorter text or a faster model.';
    }
    return message;
  }

  function assertNonEmptyResponse(text: string): void {
    if (!text.trim()) {
      throw new Error(EMPTY_RESPONSE_MESSAGE);
    }
  }

  function markCopied() {
    copied = true;
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      copied = false;
      copiedTimer = null;
    }, 1400);
  }

  async function handleTranslate() {
    if (!sourceText.trim()) {
      translationError = "Enter text to translate.";
      return;
    }

    // Ollama runs locally without authentication; only hosted providers need a key.
    const provider = getProvider();
    const apiKey = getApiKey();
    if (!apiKey && provider !== 'Local (Ollama)') {
      translationError = "API key required. Click 'Fix in Settings' below to configure your key.";
      return;
    }

    // Cancel any in-flight request before starting a new one
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    const { signal } = abortController;

    const TRANSLATE_TIMEOUT_MS = 120_000;
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      abortController?.abort();
    }, TRANSLATE_TIMEOUT_MS);

    isTranslating = true;
    translationError = null;

    try {
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

      let response: Response;

      if (provider === 'Anthropic') {
        const body: Record<string, unknown> = {
          model: model,
          messages: [{ role: 'user', content: prompt }]
        };

        if (reasoningEffort !== 'none') {
          const budgetTokens = reasoningEffort === 'xhigh' ? 8192 : reasoningEffort === 'high' ? 4096 : reasoningEffort === 'low' ? 256 : 1024;
          body.thinking = { type: 'enabled', budget_tokens: budgetTokens };
          // The API rejects max_tokens <= budget_tokens; size the response
          // allowance above the thinking budget so extended thinking succeeds.
          body.max_tokens = budgetTokens + 4096;
        } else {
          body.max_tokens = 4096;
        }

        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey ?? '',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(body),
          signal
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw Object.assign(new Error(errorData.error?.message || `API error: ${response.status}`), { status: response.status });
        }

        const data = await response.json();
        // With extended thinking the content array leads with a thinking block;
        // extract the first text block rather than assuming index 0.
        const blocks = Array.isArray(data.content) ? data.content : [];
        const text = blocks.find((block: { type?: string }) => block?.type === 'text')?.text ?? '';
        assertNonEmptyResponse(text);
        translatedText = text;
        if (data.stop_reason === 'max_tokens') {
          translationError = TRUNCATED_MESSAGE;
        }
      } else if (provider === 'Local (Ollama)') {
        const body: Record<string, unknown> = {
          model: model,
          messages: [{ role: 'user', content: prompt }],
          stream: false
        };

        if (reasoningEffort !== 'none') {
          const ctxSize = reasoningEffort === 'xhigh' ? 65536 : reasoningEffort === 'high' ? 32768 : reasoningEffort === 'low' ? 4096 : 16384;
          body.options = { num_ctx: ctxSize };
        }

        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          signal
        });

        if (!response.ok) {
          throw Object.assign(new Error(`Ollama error: ${response.status}`), { status: response.status });
        }

        const data = await response.json();
        const ollamaText = data.message?.content ?? '';
        assertNonEmptyResponse(ollamaText);
        translatedText = ollamaText;
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

        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body),
          signal
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw Object.assign(new Error(errorData.error?.message || `API error: ${response.status}`), { status: response.status });
        }

        const data = await response.json();
        const choice = data.choices?.[0];
        const openAiText = choice?.message?.content ?? '';
        assertNonEmptyResponse(openAiText);
        translatedText = openAiText;
        if (choice?.finish_reason === 'length') {
          translationError = TRUNCATED_MESSAGE;
        }
      }

      if (localStorage.getItem('autoCopy') === 'true' && translatedText && navigator.clipboard) {
        // Clipboard writes outside a user gesture can fail; keep copy available
        // manually and confirm visually whenever the automatic write succeeds.
        navigator.clipboard.writeText(translatedText).then(markCopied).catch(() => {});
      }
    } catch (err) {
      const errorWithStatus = err as Error & { status?: number };
      const isCancelled = err instanceof DOMException && err.name === 'AbortError';
      if (isCancelled && timedOut) {
        translationError =
          'Translation timed out. The text may be too long or the model is slow to respond. Try shorter text or a faster model.';
      } else if (!isCancelled) {
        translationError = formatApiError(err, errorWithStatus.status);
      }
      // Keep the previous translation on failure so the user never loses work;
      // the error banner above makes clear it predates the failed request.
    } finally {
      clearTimeout(timeoutId);
      if (abortController?.signal === signal) {
        abortController = null;
      }
      isTranslating = false;
    }
  }

  function handleStop() {
    if (abortController) {
      abortController.abort();
      abortController = null;
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
    markCopied();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="workspace card">
  <LanguageSelector bind:sourceLang bind:targetLang onSwap={handleSwap} autoDetect={autoDetect} />

  {#if translationError}
    <div class="error-message" role="alert">
      <span class="error-icon" aria-hidden="true">!</span>
      <span class="error-text">{translationError}</span>
      {#if translationError.includes('API key') || translationError.includes('Endpoint')}
        <button class="error-action" on:click={onOpenSettings} title="Press Ctrl+, to open Settings">Fix in Settings</button>
      {/if}
      <button class="error-action retry" on:click={handleTranslate} aria-label="Retry translation">
        <RotateCcw size={14} />
        Retry
      </button>
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

    <div class="stitch" aria-hidden="true"></div>

    <TextAreaPanel
      label={getDisplayLabel(targetLang)}
      bind:value={translatedText}
      placeholder={isTranslating ? 'Translating…' : 'Translation will appear here...'}
      readonly={true}
    />
  </div>

  <div class="action-row">
    <button class="secondary-button" on:click={handleClear} disabled={!sourceText && !translatedText} title="Clear (Ctrl+Shift+Backspace)">
      <Trash2 size={16} />
      <span>Clear</span>
    </button>

    <div class="action-center">
      <button
        class="translate-button"
        on:click={isTranslating ? handleStop : handleTranslate}
        disabled={!isTranslating && !sourceText.trim()}
        title={isTranslating ? 'Stop translation (Escape)' : 'Translate (Ctrl+Enter)'}
        use:roughFrame={{ stroke: '--color-accent-deep', strokeWidth: 1.6, roughness: 1.25, radius: 10 }}
      >
        <span class="bt-inner">
          {#if isTranslating}
            <Square size={14} />
            <span>Stop</span>
          {:else}
            <Sparkles size={18} />
            <span>Translate</span>
          {/if}
        </span>
      </button>
      <span class="shortcut-note" aria-hidden="true">press Ctrl + Enter</span>
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
    gap: var(--space-5);
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
    transform: rotate(-0.4deg);
    flex-wrap: wrap;
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
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .error-text {
    flex: 1;
    min-width: 0;
  }

  .error-action {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    background: var(--color-surface);
    border: 1px solid var(--color-danger-border);
    border-radius: var(--radius-sm);
    color: var(--color-danger);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    transition: background-color 0.18s ease, border-color 0.18s ease;
  }

  .error-action:hover {
    background: var(--color-danger);
    border-color: var(--color-danger);
    color: var(--color-accent-text);
  }

  .error-dismiss {
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
    gap: var(--space-5);
    min-height: 0;
  }

  /* The binding stitch between the two facing pages */
  .stitch {
    flex-shrink: 0;
    width: 0;
    border-left: 2px dashed var(--color-line-soft);
    align-self: stretch;
    margin: var(--space-5) 0;
  }

  .action-row {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-top: var(--space-1);
  }

  .action-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    flex: 1;
  }

  .translate-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-3) var(--space-10);
    background: var(--color-accent);
    color: var(--color-accent-text);
    border-radius: var(--radius-md);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 15px;
  }

  .bt-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .translate-button:hover:not(:disabled) {
    background: var(--color-accent-hover);
    transform: translateY(-1px);
  }

  .translate-button:active:not(:disabled) {
    transform: translateY(1px);
  }

  .translate-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .shortcut-note {
    font-family: var(--font-hand);
    font-size: 16px;
    line-height: 1;
    color: var(--color-text-tertiary);
    transform: rotate(-2deg);
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
    border-color: var(--color-accent-deep);
    color: var(--color-accent-text);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    .workspace {
      flex: none;
      overflow: visible;
    }

    .panels-container {
      flex-direction: column;
    }

    .stitch {
      width: auto;
      height: 0;
      border-left: none;
      border-top: 2px dashed var(--color-line-soft);
      margin: 0 var(--space-5);
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

  @media (prefers-reduced-motion: reduce) {
  }
</style>
