<script lang="ts">
  import { ChevronDown, Languages, ArrowLeftRight } from 'lucide-svelte';

  export let sourceLang = "Detect language";
  export let targetLang = "English (US)";
  export let onSwap: () => void;
  export let autoDetect = true;

  $: if (!autoDetect && sourceLang === "Detect language") {
    sourceLang = "English (US)";
  }

  const allLanguages = [
    "English (US)",
    "English (UK)",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Portuguese (Brazil)",
    "Russian",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Turkish",
    "Dutch",
    "Polish",
    "Swedish",
    "Norwegian",
    "Danish",
    "Finnish",
    "Greek",
    "Czech",
    "Hungarian",
    "Romanian",
    "Thai",
    "Vietnamese",
    "Indonesian",
    "Malay"
  ];

  $: sourceLanguages = autoDetect ? ["Detect language", ...allLanguages] : allLanguages;
</script>

<div class="selector-row">
  <div class="select-wrapper source">
    <Languages size={16} class="icon" aria-hidden="true" />
    <select bind:value={sourceLang} aria-label="Source language">
      {#each sourceLanguages as lang}
        <option>{lang}</option>
      {/each}
    </select>
    <ChevronDown size={16} class="chevron" aria-hidden="true" />
  </div>

  <button class="swap-button" on:click={onSwap} aria-label="Swap source and target languages">
    <ArrowLeftRight size={16} />
  </button>

  <div class="select-wrapper target">
    <select bind:value={targetLang} aria-label="Target language">
      {#each allLanguages as lang}
        <option>{lang}</option>
      {/each}
    </select>
    <ChevronDown size={16} class="chevron" aria-hidden="true" />
  </div>
</div>

<style>
  .selector-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .select-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
  }

  .select-wrapper :global(.icon) {
    position: absolute;
    left: var(--space-3);
    color: var(--color-text-tertiary);
    pointer-events: none;
  }

  .select-wrapper :global(.chevron) {
    position: absolute;
    right: var(--space-3);
    color: var(--color-text-tertiary);
    pointer-events: none;
  }

  select {
    width: 100%;
    appearance: none;
    padding: var(--space-3) var(--space-8);
    padding-left: var(--space-3);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .select-wrapper.source select {
    padding-left: 36px;
  }

  select:hover {
    border-color: var(--color-border-hover);
    background: var(--color-surface);
  }

  select:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-bg);
  }

  .swap-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text-tertiary);
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .swap-button:hover {
    background: var(--color-surface-alt);
    border-color: var(--color-border-hover);
    color: var(--color-accent);
  }

  @media (max-width: 640px) {
    .selector-row {
      flex-direction: column;
      gap: var(--space-2);
    }
    .select-wrapper {
      width: 100%;
    }
    .swap-button {
      transform: rotate(90deg);
      width: 32px;
      height: 32px;
    }
  }
</style>
