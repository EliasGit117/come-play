import { FC } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';
import { PanelType, panelTypes } from '@/routes/_public/calculator/-consts/products';
import { m } from '@/paraglide/messages';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const panelTypeLabels: Record<PanelType, () => string> = {
  [PanelType.Indoor]: m['pages.public.calculator.panel_types.indoor'],
  [PanelType.Outdoor]: m['pages.public.calculator.panel_types.outdoor'],
};

const PanelTypeSelector: FC = () => {
  const { panelType, setPanelType } = usePanelSettingsProvider(s => ({
    panelType: s.panelType,
    setPanelType: s.setPanelType,
  }));

  const onPanelTypeChange = (v: string) => {
    const found = panelTypes.find(p => p.type === v);
    if (!found) return;
    setPanelType(found.type);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {panelTypeLabels[panelType]()}
          <IconChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuRadioGroup value={panelType} onValueChange={onPanelTypeChange}>
          {panelTypes.map(p => (
            <DropdownMenuRadioItem value={p.type} key={p.type}>
              {panelTypeLabels[p.type]()}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PanelTypeSelector;
