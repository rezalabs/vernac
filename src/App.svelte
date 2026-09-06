<script lang="ts">
  import Header from './lib/Header.svelte';
  import TranslationWorkspace from './lib/TranslationWorkspace.svelte';
  import QuickSetup from './lib/QuickSetup.svelte';
  import SettingsDrawer from './lib/SettingsDrawer.svelte';
  import { onMount } from 'svelte';
  import { WifiOff } from 'lucide-svelte';

  let isSettingsOpen = false;
  let settingsClosedAt = 0;
  let isOnline = true;

  function toggleSettings() {
    isSettingsOpen = !isSettingsOpen;
  }

  function handleSettingsClose() {
    isSettingsOpen = false;
    settingsClosedAt = Date.now();
  }

  function handleAppKeydown(event: KeyboardEvent) {
    const isMod = event.ctrlKey || event.metaKey;

    // Ctrl/Cmd + , → Toggle settings
    if (isMod && event.key === ',') {
      event.preventDefault();
      toggleSettings();
      return;
    }

    // Escape → Close settings if open, but never underneath an open confirm
    // dialog: the modal owns Escape while it is on screen.
    if (event.key === 'Escape' && isSettingsOpen && !document.querySelector('[data-confirm-modal]')) {
      event.preventDefault();
      handleSettingsClose();
      return;
    }
  }

  onMount(() => {
    isOnline = navigator.onLine;
    function goOnline() { isOnline = true; }
    function goOffline() { isOnline = false; }
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  });
</script>

<svelte:window onkeydown={handleAppKeydown} />

<div id="app">
  {#if !isOnline}
    <div class="offline-banner" role="alert">
      <WifiOff size={14} />
      <span>You're offline. Translation requires an internet connection.</span>
    </div>
  {/if}

  <Header onToggleSettings={toggleSettings} />

  <main>
    <QuickSetup settingsClosedAt={settingsClosedAt} />
    <TranslationWorkspace settingsClosedAt={settingsClosedAt} onOpenSettings={toggleSettings} />
  </main>

  <SettingsDrawer isOpen={isSettingsOpen} onClose={handleSettingsClose} />
</div>

<style>
  .offline-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--color-warning-bg);
    border: 1px solid var(--color-warning);
    border-radius: var(--radius-md);
    color: var(--color-warning);
    font-size: 13px;
    font-weight: 500;
    margin-bottom: var(--space-3);
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  main :global(.workspace) {
    animation: leaf-in 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) both;
  }

  @media (max-width: 1024px) {
    main {
      overflow: visible;
    }
  }

  @media (max-width: 640px) {
    #app {
      padding: 0 var(--space-4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    main :global(.workspace) {
      animation: none;
    }
  }
</style>
