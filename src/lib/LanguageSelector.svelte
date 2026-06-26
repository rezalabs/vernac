<script lang="ts">
  import { ChevronDown, Languages, ArrowLeftRight } from 'lucide-svelte';
  import { roughFrame } from './rough';

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

  <button
    class="swap-button"
    on:click={onSwap}
    aria-label="Swap source and target languages"
    use:roughFrame={{ stroke: '--color-line', strokeWidth: 1.4, roughness: 1.3, radius: 999 }}
  >
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
    color: var(--color-persimmon);
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
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }

  .select-wrapper.source select {
    padding-left: 38px;
  }

  select:hover {
    border-color: var(--color-border-hover);
    background: var(--color-surface-alt);
  }

  select:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px var(--color-accent-bg);
  }

  .swap-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid transparent;
    border-radius: 50%;
    background: var(--color-surface);
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }

  .swap-button :global(svg) {
    position: relative;
    z-index: 1;
  }

  .swap-button:hover {
    color: var(--color-persimmon);
    transform: rotate(180deg);
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
    }

    .swap-button:hover {
      transform: rotate(270deg);
    }
  }
</style>
