import { IconSettings } from '@tabler/icons-react';
import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button';

import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';

export interface IProps extends ComponentProps<typeof Button> {

}

const OpenPanelSettingsButton: FC<IProps> = ({ ...props }) => {
  const setOpen = usePanelSettingsProvider(s => s.setIsPanelOpen);

  return (
    <Button
      onClick={() => setOpen(true)}
      {...props}
    >
      <IconSettings className='size-6'/>
    </Button>
  );
};

export default OpenPanelSettingsButton;