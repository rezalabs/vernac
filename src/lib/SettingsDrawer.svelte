<script lang="ts">
  import { X, Eye, EyeOff, Code, Server, Lock, Globe, Trash2, Check, ExternalLink, Brain } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import ConfirmModal from './ConfirmModal.svelte';

  export let isOpen: boolean;
  export let onClose: () => void;

  let showApiKey = false;
  let apiKey = "";
  let hasApiKey = false;
  let provider = "OpenAI Compatible";
  let model = "gpt-5.5";
  let customModel = "";
  let useCustomModel = false;
  let apiEndpoint = "";
  let reasoningEffort = "medium";

  let autoDetect = true;
  let autoCopy = true;
  let preserveFormatting = true;

  let showProviderConfirm = false;
  let pendingProvider: string | null = null;

  const providerModels: Record<string, string[]> = {
    'OpenAI Compatible': ['gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini'],
    'Anthropic': ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
    'Local (Ollama)': ['llama3.2', 'llama3.1', 'mistral', 'qwen2.5', 'deepseek-r1']
  };

  $: availableModels = providerModels[provider] || providerModels['OpenAI Compatible'];

  function loadSettings() {
    const savedApiKey = localStorage.getItem('apiKey');
    hasApiKey = !!savedApiKey;
    apiKey = savedApiKey ? savedApiKey : "";
    provider = localStorage.getItem('provider') || 'OpenAI Compatible';
    model = localStorage.getItem('model') || 'gpt-5.5';
    customModel = localStorage.getItem('customModel') || '';
    useCustomModel = localStorage.getItem('useCustomModel') === 'true';
    apiEndpoint = localStorage.getItem('apiEndpoint') || '';
    reasoningEffort = localStorage.getItem('reasoningEffort') || 'medium';
    autoDetect = localStorage.getItem('autoDetect') !== 'false';
    autoCopy = localStorage.getItem('autoCopy') === 'true';
    preserveFormatting = localStorage.getItem('preserveFormatting') !== 'false';
  }

  function saveSettings() {
    localStorage.setItem('apiKey', apiKey.trim());
    localStorage.setItem('provider', provider);
    localStorage.setItem('model', model);
    localStorage.setItem('customModel', customModel.trim());
    localStorage.setItem('useCustomModel', String(useCustomModel));
    if (apiEndpoint.trim()) {
      localStorage.setItem('apiEndpoint', apiEndpoint.trim());
    }
    localStorage.setItem('reasoningEffort', reasoningEffort);
    localStorage.setItem('autoDetect', String(autoDetect));
    localStorage.setItem('autoCopy', String(autoCopy));
    localStorage.setItem('preserveFormatting', String(preserveFormatting));
  }

  function handleSave() {
    saveSettings();
    onClose();
  }

  function handleClearSettings() {
    localStorage.removeItem('apiKey');
    localStorage.removeItem('provider');
    localStorage.removeItem('model');
    localStorage.removeItem('customModel');
    localStorage.removeItem('apiEndpoint');
    localStorage.removeItem('reasoningEffort');
    localStorage.removeItem('autoDetect');
    localStorage.removeItem('autoCopy');
    localStorage.removeItem('preserveFormatting');
    localStorage.removeItem('theme');

    apiKey = "";
    hasApiKey = false;
    provider = 'OpenAI Compatible';
    model = 'gpt-5.5';
    customModel = '';
    useCustomModel = false;
    apiEndpoint = '';
    reasoningEffort = 'medium';
    autoDetect = true;
    autoCopy = true;
    preserveFormatting = true;
  }

  function handleProviderChange() {
    model = availableModels[0];
    useCustomModel = false;
    customModel = '';
  }

  function handleProviderSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newProvider = select.value;

    if (newProvider === provider) return;

    pendingProvider = newProvider;
    showProviderConfirm = true;
  }

  function confirmProviderChange() {
    if (pendingProvider) {
      provider = pendingProvider;
      handleProviderChange();
      pendingProvider = null;
    }
  }

  function cancelProviderChange() {
    pendingProvider = null;
  }

  onMount(() => {
    loadSettings();
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="overlay" onclick={onClose} transition:fade={{ duration: 150 }}>
    <div class="drawer" onclick={(e) => e.stopPropagation()} transition:fly={{ x: 420, duration: 250 }}>
      <div class="drawer-header">
        <div class="title-group">
          <h2>Settings</h2>
          <p>All settings stored locally in your browser.</p>
        </div>
        <button class="close-button" onclick={onClose} aria-label="Close settings">
          <X size={22} />
        </button>
      </div>

      <div class="drawer-content">
        <!-- API Key Section -->
        <section>
          <div class="section-title">API Key</div>
          <div class="field">
            <label for="api-key">API Key</label>
            <div class="input-wrapper">
              <input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                bind:value={apiKey}
                placeholder="sk-..."
              />
              <button class="toggle-password" onclick={() => showApiKey = !showApiKey} aria-label={showApiKey ? 'Hide API key' : 'Show API key'}>
                {#if showApiKey}
                  <EyeOff size={18} />
                {:else}
                  <Eye size={18} />
                {/if}
              </button>
            </div>
            <p class="helper">Your API key is stored only in your browser (localStorage).</p>
          </div>
        </section>

        <!-- Model / Provider Section -->
        <section>
          <div class="section-title">Model / Provider</div>
          <div class="field">
            <label for="provider">Provider</label>
            <select id="provider" value={provider} onchange={handleProviderSelectChange}>
              <option>OpenAI Compatible</option>
              <option>Anthropic</option>
              <option>Local (Ollama)</option>
            </select>
          </div>

          <div class="field">
            <span class="field-label">Model</span>
            <div class="model-selection">
              <div class="model-tabs">
                <button
                  class="model-tab"
                  class:active={!useCustomModel}
                  onclick={() => useCustomModel = false}
                >
                  Preset
                </button>
                <button
                  class="model-tab"
                  class:active={useCustomModel}
                  onclick={() => useCustomModel = true}
                >
                  Custom
                </button>
              </div>

              {#if useCustomModel}
                <input
                  type="text"
                  bind:value={customModel}
                  placeholder="e.g., gpt-4.1-nano, llama3.3"
                />
                <p class="helper">Enter any model name supported by your provider.</p>
              {:else}
                <select bind:value={model}>
                  {#each availableModels as m}
                    <option value={m}>{m}</option>
                  {/each}
                </select>
              {/if}
            </div>
          </div>

          <div class="field">
            <label for="reasoning" class="label-with-icon">
              <Brain size={16} />
              Reasoning
            </label>
            <select id="reasoning" bind:value={reasoningEffort}>
              <option value="none">None — fastest</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High — most thorough</option>
              <option value="xhigh">Extra High — maximum depth</option>
            </select>
            <p class="helper">Controls reasoning depth for models that support extended thinking.</p>
          </div>

          {#if provider === 'OpenAI Compatible'}
            <div class="field">
              <label for="api-endpoint">Custom API Endpoint</label>
              <input
                id="api-endpoint"
                type="text"
                bind:value={apiEndpoint}
                placeholder="https://api.openai.com/v1/chat/completions"
              />
              <p class="helper">Override the default endpoint for custom providers like LM Studio, Together AI, etc.</p>
            </div>
          {/if}
        </section>

        <!-- Preferences Section -->
        <section>
          <div class="section-title">Preferences</div>
          <div class="toggle-field">
            <div class="toggle-info">
              <span class="toggle-label">Auto-detect source language</span>
              <p class="helper">Automatically detect the source language from text.</p>
            </div>
            <label class="switch">
              <input type="checkbox" bind:checked={autoDetect}>
              <span class="slider"></span>
            </label>
          </div>
          <div class="toggle-field">
            <div class="toggle-info">
              <span class="toggle-label">Auto-copy results</span>
              <p class="helper">Copy translation to clipboard automatically.</p>
            </div>
            <label class="switch">
              <input type="checkbox" bind:checked={autoCopy}>
              <span class="slider"></span>
            </label>
          </div>
          <div class="toggle-field">
            <div class="toggle-info">
              <span class="toggle-label">Preserve formatting</span>
              <p class="helper">Keep line breaks, spacing, and basic structure.</p>
            </div>
            <label class="switch">
              <input type="checkbox" bind:checked={preserveFormatting}>
              <span class="slider"></span>
            </label>
          </div>
        </section>

        <!-- About Section -->
        <section>
          <div class="section-title">About</div>

          <a href="https://github.com/rezalabs/vernac" target="_blank" rel="noopener noreferrer" class="about-link">
            <span class="icon-wrapper"><Code size={16} /></span>
            <div class="link-info">
              <span class="link-title">View on GitHub</span>
              <p>Source code, issues, and documentation.</p>
            </div>
            <ExternalLink size={14} class="link-external" />
          </a>

          <div class="about-item">
            <span class="icon-wrapper"><Server size={16} /></span>
            <div class="link-info">
              <span class="link-title">Self-hostable</span>
              <p>Run on your own server or completely offline.</p>
            </div>
          </div>

          <div class="about-item">
            <span class="icon-wrapper"><Globe size={16} /></span>
            <div class="link-info">
              <span class="link-title">Client-side only</span>
              <p>Everything runs in your browser. No backend.</p>
            </div>
          </div>

          <div class="about-item">
            <span class="icon-wrapper"><Lock size={16} /></span>
            <div class="link-info">
              <span class="link-title">Privacy first</span>
              <p>Your data never leaves your device.</p>
            </div>
          </div>

          <div class="footer-links">
            <span class="copyright">&copy;</span>
            <a href="https://rezalabs.com" target="_blank" rel="noopener noreferrer" class="footer-link">
              RezaLabs
              <ExternalLink size={13} />
            </a>
          </div>
        </section>
      </div>

      <div class="drawer-footer">
        <button class="danger-button" onclick={handleClearSettings}>
          <Trash2 size={16} />
          <span>Clear settings</span>
        </button>
        <button class="save-button" onclick={handleSave}>
          <Check size={16} />
          <span>Save settings</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<ConfirmModal
  bind:isOpen={showProviderConfirm}
  title="Change Provider"
  message="Changing provider will reset your current model selection. Continue?"
  confirmText="Continue"
  cancelText="Cancel"
  onConfirm={confirmProviderChange}
  onCancel={cancelProviderChange}
  type="warning"
/>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
  }

  :global(.dark) .overlay {
    background: rgba(0, 0, 0, 0.6);
  }

  .drawer {
    width: 100%;
    max-width: 400px;
    height: 100%;
    background: var(--color-surface);
    display: flex;
    flex-direction: column;
    box-shadow: -6px 0 24px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .drawer {
    box-shadow: -6px 0 24px rgba(0, 0, 0, 0.3);
  }

  .drawer-header {
    padding: var(--space-6);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .title-group h2 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .title-group p {
    font-size: 13px;
    color: var(--color-text-tertiary);
  }

  .close-button {
    color: var(--color-text-tertiary);
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    display: flex;
  }

  .close-button:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-alt);
  }

  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .section-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-4);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .field {
    margin-bottom: var(--space-4);
  }

  .field label, .field-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  .label-with-icon {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="text"], input[type="password"], select {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text-primary);
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  input[type="text"]:focus, input[type="password"]:focus, select:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-bg);
  }

  input::placeholder {
    color: var(--color-text-tertiary);
  }

  option {
    background: var(--color-surface);
    color: var(--color-text-primary);
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

  /* Model Selection Tabs */
  .model-selection {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .model-tabs {
    display: flex;
    gap: var(--space-2);
  }

  .model-tab {
    flex: 1;
    padding: var(--space-2) var(--space-4);
    background: var(--color-surface-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .model-tab.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-accent-text);
  }

  .model-tab:hover:not(.active) {
    background: var(--color-surface);
    border-color: var(--color-border-hover);
    color: var(--color-text-primary);
  }

  /* Toggle switches */
  .toggle-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    gap: var(--space-4);
  }

  .toggle-info {
    flex: 1;
  }

  .toggle-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
    display: block;
    margin-bottom: 2px;
  }

  .toggle-info .helper {
    margin-top: 0;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: var(--color-border);
    transition: 0.3s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: var(--color-surface);
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--color-accent);
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }

  /* About */
  .about-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    color: var(--color-text-secondary);
    text-decoration: none;
    border-radius: var(--radius-md);
    transition: all 0.2s;
  }

  .about-link:hover {
    background: var(--color-surface-alt);
  }

  .about-link:hover .link-title {
    color: var(--color-accent);
  }

  .about-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    color: var(--color-text-secondary);
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--color-text-tertiary);
    flex-shrink: 0;
  }

  .link-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .link-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1.2;
    transition: color 0.2s;
  }

  .link-info p {
    font-size: 12px;
    color: var(--color-text-tertiary);
    line-height: 1.3;
  }

  .footer-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    margin-top: var(--space-6);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .copyright {
    color: var(--color-text-tertiary);
    font-size: 13px;
    line-height: 1;
  }

  .footer-link {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-accent);
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-link:hover {
    color: var(--color-accent-hover);
  }

  /* Footer buttons */
  .drawer-footer {
    padding: var(--space-5) var(--space-6);
    border-top: 1px solid var(--color-border);
    display: flex;
    gap: var(--space-3);
  }

  .danger-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3);
    border: 1px solid var(--color-danger-border);
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .danger-button:hover {
    background: var(--color-danger);
    border-color: var(--color-danger);
    color: var(--color-accent-text);
  }

  .save-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--color-accent);
    color: var(--color-accent-text);
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .save-button:hover {
    background: var(--color-accent-hover);
  }

  @media (max-width: 640px) {
    .drawer {
      max-width: 100%;
    }
  }
</style>
