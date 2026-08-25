import { FC } from 'react';
import PanelSettingsFields from './panel-settings/panel-settings-fields';
import SendRequestDialog from './panel-settings/send-request-dialog';
import { cn } from '@/lib/utils';

const PanelSettingsAside: FC = () => {

  return (
    <aside
      className={cn(
      'sticky top-16 hidden xl:block',
        'w-86 p-4 max-h-[calc(100dvh-4rem-2rem)]',
        'overflow-y-auto'
      )}
    >
      <div className="flex flex-col gap-2">
        <PanelSettingsFields/>
        <SendRequestDialog className="w-full mt-4"/>
      </div>
    </aside>
  );
};


export default PanelSettingsAside;
