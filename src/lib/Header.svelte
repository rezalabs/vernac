<script lang="ts">
  import { Settings, Sun, Moon, Code } from 'lucide-svelte';
  import { onMount } from 'svelte';
  export let onToggleSettings: () => void;

  let isDark = false;

  function applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    isDark = !isDark;
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    applyTheme(isDark);
  });
</script>

<header class="header">
  <div class="logo">
    <div class="logo-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
        <path d="M4 4 L12 20 L20 4"></path>
      </svg>
    </div>
    <h1 class="logo-text">Vernac</h1>
  </div>

  <div class="actions">
    <a
      href="https://github.com/rezalabs/vernac"
      target="_blank"
      rel="noopener noreferrer"
      class="icon-button"
      aria-label="View source code on GitHub"
    >
      <Code size={18} />
    </a>

    <button class="icon-button" on:click={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {#if isDark}
        <Sun size={18} />
      {:else}
        <Moon size={18} />
      {/if}
    </button>

    <button class="icon-button accent" on:click={onToggleSettings} aria-label="Open settings" title="Settings (Ctrl+,)">
      <Settings size={18} />
      <span class="btn-label">Settings</span>
    </button>
  </div>
</header>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-5) 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-6);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .logo-icon {
    width: 34px;
    height: 34px;
    border-radius: var(--radius-md);
    background: var(--color-accent);
    color: var(--color-accent-text);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 36px;
    height: 36px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .icon-button:hover {
    background: var(--color-surface-alt);
    border-color: var(--color-border-hover);
    color: var(--color-text-primary);
  }

  .icon-button.accent {
    width: auto;
    padding: 0 var(--space-4);
    gap: var(--space-2);
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-accent-text);
  }

  .icon-button.accent:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }

  .btn-label {
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
  }

  @media (max-width: 640px) {
    .header {
      padding: var(--space-4) 0;
      margin-bottom: var(--space-4);
    }

    .logo-text {
      font-size: 18px;
    }

    .logo-icon {
      width: 30px;
      height: 30px;
    }
  }
</style>
