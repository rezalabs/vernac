<script lang="ts">
  import { ChevronDown, ChevronUp, Lock, Eye, EyeOff, Check, KeyRound } from 'lucide-svelte';
  import { onMount } from 'svelte';

  export let settingsClosedAt = 0;

  let isExpanded = false;
  let apiKey = "";
  let showApiKey = false;
  let isSaved = false;

  function toggleExpand() {
    isExpanded = !isExpanded;
  }

  function handleSaveKey() {
    if (apiKey.trim()) {
      localStorage.setItem('apiKey', apiKey.trim());
      isSaved = true;
      apiKey = "";
    }
  }

  function checkApiKey() {
    isSaved = !!localStorage.getItem('apiKey');
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
    class="setup-banner card"
    on:click={toggleExpand}
    aria-expanded={isExpanded}
    aria-controls="setup-panel"
  >
    <div class="info">
      <div class="icon-ring">
        <KeyRound size={18} />
      </div>
      <div class="text">
        <h3>API key required</h3>
        <p class="description">
          Enter your API key to start translating. Works with OpenAI, Anthropic, or local Ollama.
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
        <label for="quick-api-key">API Key</label>
        <div class="input-wrapper">
          <input
            id="quick-api-key"
            type={showApiKey ? "text" : "password"}
            bind:value={apiKey}
            placeholder="Enter your API key"
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
        <button class="save-button" on:click={handleSaveKey} disabled={!apiKey.trim()}>
          <Check size={16} />
          Save &amp; start translating
        </button>
      </div>
      <div class="security-notice">
        <Lock size={13} />
        <span>API key never leaves your browser — stored in localStorage only.</span>
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) var(--space-5);
    background: var(--color-accent-bg);
    border-color: var(--color-accent);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;
  }

  .setup-banner:hover {
    border-color: var(--color-accent-hover);
    box-shadow: var(--shadow-sm);
  }

  .info {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .icon-ring {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-surface);
    border: 1px solid var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--color-accent);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  h3 {
    font-size: 15px;
    font-weight: 600;
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
    color: var(--color-text-tertiary);
    flex-shrink: 0;
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
    box-shadow: 0 0 0 3px var(--color-accent-bg);
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
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .save-button:hover:not(:disabled) {
    background: var(--color-accent-hover);
    box-shadow: var(--shadow-sm);
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
    border-top: 1px solid var(--color-border);
    line-height: 1.5;
  }
</style>
