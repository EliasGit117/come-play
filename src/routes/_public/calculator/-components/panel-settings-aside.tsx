import { FC } from 'react';
import PanelSettingsFields from './panel-settings/panel-settings-fields';
import SendRequestDialog from './panel-settings/send-request-dialog';

const PanelSettingsAside: FC = () => (
  // In-flow anchor: holds the column's space inside the container and
  // gives the fixed panel its horizontal position (no left/right set,
  // so it stays where the flow puts it).
  <div className="hidden 2xl:block w-96 shrink-0">
    <aside className="flex flex-col p-4 gap-4 w-96 fixed top-16 bottom-0 z-10">
      <div className="overflow-auto">
        <PanelSettingsFields/>
      </div>

      <SendRequestDialog className="w-full"/>
    </aside>
  </div>
);

export default PanelSettingsAside;
