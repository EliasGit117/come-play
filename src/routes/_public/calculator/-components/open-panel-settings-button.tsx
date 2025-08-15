import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button';
import { SettingsIcon } from 'lucide-react';
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
      <SettingsIcon/>
    </Button>
  );
};

export default OpenPanelSettingsButton;