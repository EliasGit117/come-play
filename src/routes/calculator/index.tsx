import { createFileRoute } from '@tanstack/react-router';
import { PanelSettingsProvider } from '@/routes/calculator/-providers/panel-settings-provider';
import PanelSettingsSheet from '@/routes/calculator/-components/panel-settings-sheet';
import OpenPanelSettingsButton from '@/routes/calculator/-components/open-panel-settings-button';

export const Route = createFileRoute('/calculator/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <PanelSettingsProvider>
      <main className="container mx-auto p-4 min-h-svh">
        <OpenPanelSettingsButton
          size='xlIcon'
          className='fixed bottom-6 right-6 border border-border/50 rounded-full'
        />
      </main>

      <PanelSettingsSheet/>
    </PanelSettingsProvider>
  );
}
