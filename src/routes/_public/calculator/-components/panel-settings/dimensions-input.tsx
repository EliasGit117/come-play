import { FC } from 'react';
import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';
import { Label } from '@/components/ui/label';
import { m } from '@/paraglide/messages';
import { NumberInput } from '@/components/ui/number-input';

const DimensionsInput: FC = () => {
  const { tilesXCount, tilesYCount, setTilesXCount, setTilesYCount } = usePanelSettingsProvider(s => ({
    tilesXCount: s.tilesXCount,
    tilesYCount: s.tilesYCount,
    setTilesXCount: s.setTilesXCount,
    setTilesYCount: s.setTilesYCount,
  }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{m['pages.public.calculator.settings.tiles_horizontal_label']()}</Label>
        <NumberInput
          maxLength={3}
          value={tilesXCount}
          onValueChange={v => setTilesXCount(v ?? 1)}
        />
      </div>

      <div className="space-y-2">
        <Label>{m['pages.public.calculator.settings.tiles_vertical_label']()}</Label>
        <NumberInput
          maxLength={3}
          value={tilesYCount}
          onValueChange={v => setTilesYCount(v ?? 1)}
        />
      </div>
    </div>
  );
};

export default DimensionsInput;
