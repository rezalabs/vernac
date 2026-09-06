<script lang="ts">
  import { ChevronDown, ChevronUp, Lock, Eye, EyeOff, Check, KeyRound } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { roughFrame } from './rough';

  export let settingsClosedAt = 0;

  let isExpanded = false;
  let apiKey = "";
  let showApiKey = false;
  let isSaved = false;
  let isSaving = false;

  function toggleExpand() {
    isExpanded = !isExpanded;
  }

  async function handleSaveKey() {
    if (apiKey.trim()) {
      isSaving = true;
      localStorage.setItem('apiKey', apiKey.trim());
      // Brief delay so the user sees the confirmation
      await new Promise(r => setTimeout(r, 500));
      isSaved = true;
      isSaving = false;
      apiKey = "";
      // Hand the user straight to the input so "start translating" is literal.
      document.getElementById('source-editor')?.focus();
    }
  }

  function checkApiKey() {
    // Ollama runs locally without authentication, so onboarding is complete
    // for Ollama users even with an empty key.
    isSaved =
      !!localStorage.getItem('apiKey') ||
      localStorage.getItem('provider') === 'Local (Ollama)';
  }

  $: if (settingsClosedAt > 0) {
    checkApiKey();
  }

  onMount(() => {
    checkApiKey();
  });
</script>

{#if !isSaved}
<div class="quick-setup">
  <button
    class="setup-banner card is-inked"
    on:click={toggleExpand}
    aria-expanded={isExpanded}
    aria-controls="setup-panel"
    use:roughFrame={{ stroke: '--color-persimmon', strokeWidth: 1.6, roughness: 1.3, radius: 14 }}
  >
    <div class="info">
      <div class="icon-ring">
        <KeyRound size={18} />
      </div>
      <div class="text">
        <h3>Add a key to begin</h3>
        <p class="description">
          Paste an API key to start translating. Works with OpenAI, Anthropic, or local Ollama.
        </p>
      </div>
    </div>
    <span class="chevron" aria-hidden="true">
      {#if isExpanded}
        <ChevronUp size={18} />
      {:else}
        <ChevronDown size={18} />
      {/if}
    </span>
  </button>

  {#if isExpanded}
    <div id="setup-panel" class="setup-panel card">
      <div class="field">
        <label for="quick-api-key">API key</label>
        <div class="input-wrapper">
          <input
            id="quick-api-key"
            type={showApiKey ? "text" : "password"}
            bind:value={apiKey}
            placeholder="Paste your API key"
            on:keydown={(e) => {
              if (e.key === 'Enter') handleSaveKey();
            }}
          />
          <button class="toggle-password" on:click={() => showApiKey = !showApiKey} aria-label={showApiKey ? 'Hide API key' : 'Show API key'}>
            {#if showApiKey}
              <EyeOff size={18} />
            {:else}
              <Eye size={18} />
            {/if}
          </button>
        </div>
        <p class="helper">Stored locally in your browser. Open Settings to configure provider, model, and custom endpoints.</p>
      </div>
      <div class="actions">
        <button class="save-button" on:click={handleSaveKey} disabled={!apiKey.trim() || isSaving}>
          {#if isSaving}
            <Check size={16} />
            Saving…
          {:else}
            <Check size={16} />
            Save &amp; start translating
          {/if}
        </button>
      </div>
      <div class="security-notice">
        <Lock size={13} />
        <span>Your key never leaves your browser. It lives only in localStorage.</span>
      </div>
    </div>
  {/if}
</div>
{/if}

<style>
  .quick-setup {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .setup-banner {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) var(--space-5);
    background: var(--color-persimmon-soft);
    cursor: pointer;
    width: 100%;
    text-align: left;
  }

  .setup-banner:hover {
    transform: translateY(-1px);
  }

  .info {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    position: relative;
    z-index: 1;
  }

  .icon-ring {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--color-surface);
    border: 1.5px solid var(--color-persimmon);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--color-persimmon);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  h3 {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1.3;
  }

  .description {
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }

  .chevron {
    display: flex;
    align-items: center;
    color: var(--color-persimmon);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .setup-panel {
    padding: var(--space-5);
    background: var(--color-surface);
  }

  .field {
    margin-bottom: var(--space-4);
  }

  .field label {
    display: block;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="text"], input[type="password"] {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    padding-right: 44px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text-primary);
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px var(--color-accent-bg);
  }

  input::placeholder {
    color: var(--color-text-tertiary);
  }

  .toggle-password {
    position: absolute;
    right: var(--space-3);
    color: var(--color-text-tertiary);
    display: flex;
    align-items: center;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
  }

  .toggle-password:hover {
    color: var(--color-text-secondary);
  }

  .helper {
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin-top: var(--space-2);
    line-height: 1.5;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }

  .save-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    background: var(--color-accent);
    color: var(--color-accent-text);
    border-radius: var(--radius-md);
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
  }

  .save-button:hover:not(:disabled) {
    background: var(--color-accent-hover);
    transform: translateY(-1px);
  }

  .save-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .security-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    color: var(--color-text-tertiary);
    font-size: 12px;
    text-align: center;
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px dashed var(--color-line-soft);
    line-height: 1.5;
  }
</style>
