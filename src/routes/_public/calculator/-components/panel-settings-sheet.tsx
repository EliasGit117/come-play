import { FC } from 'react';
import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { m } from '@/paraglide/messages';
import PanelSettingsFields from './panel-settings/panel-settings-fields';
import SendRequestDialog from './panel-settings/send-request-dialog';

const PanelSettingsSheet: FC = () => {
  const { open, setIsOpen } = usePanelSettingsProvider(s => ({
    open: s.isPanelOpen,
    setIsOpen: s.setIsPanelOpen,
  }));

  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className='sr-only md:not-sr-only'>
            {m['pages.public.calculator.settings.title']()}
          </SheetTitle>
          <SheetDescription className='sr-only md:not-sr-only'>
            {m['pages.public.calculator.settings.description']()}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 overflow-auto">
          <PanelSettingsFields />
        </div>

        <SheetFooter className='pt-0'>
          <SendRequestDialog/>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PanelSettingsSheet;
