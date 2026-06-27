<script lang="ts">
  import { roughFrame } from './rough';

  export let label: string;
  export let value: string = "";
  export let placeholder: string = "";
  export let readonly: boolean = false;
  export let maxLength: number = 10000;
  export let id: string | undefined = undefined;

  let focused = false;

  $: charCount = value.length;
  $: isNearLimit = charCount > maxLength * 0.9;
  $: isAtLimit = charCount >= maxLength;
</script>

<div class="panel">
  <div class="panel-header">
    <span class="label">{label}</span>
    {#if value}
      <span class="char-count" class:near-limit={isNearLimit && !isAtLimit} class:at-limit={isAtLimit}>{charCount} / {maxLength}</span>
    {/if}
  </div>

  <div
    class="textarea-container"
    class:readonly
    class:focused
    on:focusin={() => (focused = true)}
    on:focusout={() => (focused = false)}
    use:roughFrame={{
      stroke: focused ? '--color-accent' : '--color-line',
      strokeWidth: 1.3,
      roughness: 1.2,
      radius: 12,
      animateIn: true,
      animate: focused,
    }}
  >
    <textarea
      {id}
      bind:value
      {placeholder}
      {readonly}
      maxlength={maxLength}
      aria-label={label}
    ></textarea>
  </div>
</div>

<style>
  .panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    min-width: 0;
    min-height: 0;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0 var(--space-2);
  }

  .label {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .char-count {
    font-size: 12px;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  .char-count.near-limit {
    color: var(--color-warning);
  }

  .char-count.at-limit {
    color: var(--color-danger);
    font-weight: 600;
  }

  .textarea-container {
    position: relative;
    flex: 1;
    min-height: 80px;
    background: var(--color-surface);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    padding: var(--space-5);
  }

  .textarea-container.readonly {
    background: var(--color-surface-alt);
  }

  textarea {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: 15px;
    line-height: 1.65;
    caret-color: var(--color-accent);
  }

  textarea:focus {
    outline: none;
  }

  textarea::placeholder {
    color: var(--color-text-tertiary);
    font-style: italic;
  }

  textarea[readonly] {
    color: var(--color-text-secondary);
  }

  /* When the pages stack, give each a comfortable writing height */
  @media (max-width: 1024px) {
    .textarea-container {
      min-height: 170px;
    }
  }
</style>
