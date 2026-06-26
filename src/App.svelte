<script lang="ts">
  import Header from './lib/Header.svelte';
  import TranslationWorkspace from './lib/TranslationWorkspace.svelte';
  import QuickSetup from './lib/QuickSetup.svelte';
  import SettingsDrawer from './lib/SettingsDrawer.svelte';

  let isSettingsOpen = false;
  let settingsClosedAt = 0;

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

    // Escape → Close settings if open
    if (event.key === 'Escape' && isSettingsOpen) {
      event.preventDefault();
      handleSettingsClose();
      return;
    }
  }
</script>

<svelte:window onkeydown={handleAppKeydown} />

<div id="app">
  <Header onToggleSettings={toggleSettings} />

  <main>
    <QuickSetup settingsClosedAt={settingsClosedAt} />
    <TranslationWorkspace settingsClosedAt={settingsClosedAt} />
  </main>

  <SettingsDrawer isOpen={isSettingsOpen} onClose={handleSettingsClose} />
</div>

<style>
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
