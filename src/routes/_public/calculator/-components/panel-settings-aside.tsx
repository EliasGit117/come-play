import { FC } from 'react';
import PanelSettingsFields from './panel-settings/panel-settings-fields';
import SendRequestDialog from './panel-settings/send-request-dialog';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const PanelSettingsAside: FC = () => {

  return (
    <aside className={cn('sticky top-16 pt-14 w-82 max-h-[calc(90dvh-4rem-2rem)] hidden xl:block')}>
      <ScrollArea type="always" className='flex-1 overflow-y-auto pr-4 mr-4'>
        <div className='flex flex-col gap-2 max-h-[calc(100dvh-4rem-2rem-3.5rem)]'>
          <PanelSettingsFields/>
          <SendRequestDialog className="w-full mt-4"/>
        </div>
      </ScrollArea>
    </aside>
  );
};


export default PanelSettingsAside;
