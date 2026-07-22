import { FC } from 'react';
import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';
import { Label } from '@/components/ui/label';
import { m } from '@/paraglide/messages';
import { NumberInput } from '@/components/ui/number-input';
import { TILE_HEIGHT_CM, TILE_WIDTH_CM } from '@/routes/_public/calculator/-consts/tile';

const DimensionsInput: FC = () => {
  const { tilesXCount, tilesYCount, wallWidthCm, wallHeightCm, setTilesXCount, setTilesYCount } =
    usePanelSettingsProvider(s => ({
      tilesXCount: s.tilesXCount,
      tilesYCount: s.tilesYCount,
      wallWidthCm: s.wallWidthCm,
      wallHeightCm: s.wallHeightCm,
      setTilesXCount: s.setTilesXCount,
      setTilesYCount: s.setTilesYCount,
    }));

  // Never more tiles than fit the wall, keeps the screen inside the wall
  const maxTilesX = Math.floor(wallWidthCm / TILE_WIDTH_CM);
  const maxTilesY = Math.floor(wallHeightCm / TILE_HEIGHT_CM);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{m['pages.public.calculator.settings.tiles_horizontal_label']()}</Label>
        <NumberInput
          maxLength={3}
          min={1}
          max={maxTilesX}
          value={tilesXCount}
          onValueChange={v => setTilesXCount(Math.min(v ?? 1, maxTilesX))}
        />
      </div>

      <div className="space-y-2">
        <Label>{m['pages.public.calculator.settings.tiles_vertical_label']()}</Label>
        <NumberInput
          maxLength={3}
          min={1}
          max={maxTilesY}
          value={tilesYCount}
          onValueChange={v => setTilesYCount(Math.min(v ?? 1, maxTilesY))}
        />
      </div>
    </div>
  );
};

export default DimensionsInput;
