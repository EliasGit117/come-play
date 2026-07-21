import { FC } from 'react';
import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';
import { Label } from '@/components/ui/label';
import { m } from '@/paraglide/messages';
import { TILE_HEIGHT_CM, TILE_WIDTH_CM } from '@/routes/_public/calculator/-consts/tile';
import { NumberInput } from '@/components/ui/number-input';

const WallSizeInput: FC = () => {
  const { wallWidthCm, wallHeightCm, setWallWidthCm, setWallHeightCm } = usePanelSettingsProvider(s => ({
    wallWidthCm: s.wallWidthCm,
    wallHeightCm: s.wallHeightCm,
    setWallWidthCm: s.setWallWidthCm,
    setWallHeightCm: s.setWallHeightCm,
  }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{m['pages.public.calculator.settings.wall_width_label']()}</Label>
        <NumberInput
          maxLength={4}
          min={TILE_WIDTH_CM}
          value={wallWidthCm}
          onValueChange={v => setWallWidthCm(v ?? TILE_WIDTH_CM)}
        />
      </div>

      <div className="space-y-2">
        <Label>{m['pages.public.calculator.settings.wall_height_label']()}</Label>
        <NumberInput
          maxLength={4}
          min={TILE_HEIGHT_CM}
          value={wallHeightCm}
          onValueChange={v => setWallHeightCm(v ?? TILE_HEIGHT_CM)}
        />
      </div>
    </div>
  );
};

export default WallSizeInput;
