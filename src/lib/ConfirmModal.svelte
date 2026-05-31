<script lang="ts">
  import { X, AlertTriangle } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  export let isOpen = false;
  export let title = "Confirm Action";
  export let message = "Are you sure you want to proceed?";
  export let confirmText = "Continue";
  export let cancelText = "Cancel";
  export let onConfirm: () => void;
  export let onCancel: () => void;
  export let type: "warning" | "danger" = "warning";

  function handleConfirm() {
    onConfirm();
    isOpen = false;
  }

  function handleCancel() {
    onCancel();
    isOpen = false;
  }

  function handleBackdropClick() {
    handleCancel();
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="overlay" onclick={handleBackdropClick} transition:fade={{ duration: 120 }}>
    <div
      class="modal"
      onclick={(e) => e.stopPropagation()}
      transition:fly={{ y: 30, duration: 180 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
      tabindex="-1"
    >
      <div class="modal-header">
        <div class="icon-container" class:warning={type === 'warning'} class:danger={type === 'danger'}>
          <AlertTriangle size={22} />
        </div>
        <h2 id="modal-title">{title}</h2>
        <button class="close-button" onclick={handleCancel} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div class="modal-body">
        <p id="modal-message">{message}</p>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" onclick={handleCancel}>
          {cancelText}
        </button>
        <button class="confirm-button" class:danger={type === 'danger'} onclick={handleConfirm}>
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
  }

  :global(.dark) .overlay {
    background: rgba(0, 0, 0, 0.6);
  }

  .modal {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: 420px;
    width: 100%;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-4);
    padding: var(--space-5) var(--space-5) var(--space-3);
    position: relative;
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .icon-container.warning {
    background: var(--color-warning-bg);
    color: var(--color-warning);
  }

  .icon-container.danger {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .modal-header h2 {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    margin-top: var(--space-1);
    padding-right: var(--space-6);
  }

  .close-button {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    color: var(--color-text-tertiary);
    display: flex;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
  }

  .close-button:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-alt);
  }

  .modal-body {
    padding: 0 var(--space-5) var(--space-5);
  }

  .modal-body p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  .modal-footer {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    background: var(--color-bg);
    justify-content: flex-end;
  }

  .cancel-button,
  .confirm-button {
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .cancel-button {
    background: var(--color-surface);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
  }

  .cancel-button:hover {
    background: var(--color-surface-alt);
    border-color: var(--color-border-hover);
    color: var(--color-text-primary);
  }

  .confirm-button {
    background: var(--color-accent);
    color: var(--color-accent-text);
    border: 1px solid var(--color-accent);
  }

  .confirm-button:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }

  .confirm-button.danger {
    background: var(--color-danger);
    border-color: var(--color-danger);
  }

  .confirm-button.danger:hover {
    background: #8f2a2a;
    border-color: #8f2a2a;
  }
</style>
