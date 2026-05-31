<script lang="ts">
  export let label: string;
  export let value: string = "";
  export let placeholder: string = "";
  export let readonly: boolean = false;
  export let maxLength: number = 10000;
  export let id: string | undefined = undefined;

  $: charCount = value.length;
</script>

<div class="panel">
  <div class="panel-header">
    <span class="label">{label}</span>
    {#if value}
      <span class="char-count">{charCount}</span>
    {/if}
  </div>

  <div class="textarea-container" class:readonly>
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
    align-items: center;
    padding: 0 var(--space-1);
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .char-count {
    font-size: 12px;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  .textarea-container {
    flex: 1;
    min-height: 80px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .textarea-container:focus-within {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-bg);
  }

  .textarea-container.readonly {
    background: var(--color-surface);
  }

  textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: 15px;
    line-height: 1.6;
  }

  textarea:focus {
    outline: none;
  }

  textarea::placeholder {
    color: var(--color-text-tertiary);
  }

  textarea[readonly] {
    color: var(--color-text-secondary);
  }
</style>
