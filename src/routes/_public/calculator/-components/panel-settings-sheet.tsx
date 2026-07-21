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
import { Label } from '@/components/ui/label';
import { PanelType, panelTypes } from '@/routes/_public/calculator/-consts/products';
import { m } from '@/paraglide/messages';
import { TILE_HEIGHT_CM, TILE_WIDTH_CM } from '@/routes/_public/calculator/-consts/tile';
import RangeSlider from '@/components/ui/range-slider';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
    <div className="space-y-2">
      <Label>{m['pages.public.calculator.settings.panel_type_label']()}</Label>
      <Select value={panelType} onValueChange={onPanelTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={m['pages.public.calculator.settings.panel_type_placeholder']()} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {panelTypes.map(p => (
              <SelectItem value={p.type} key={p.type}>
                {panelTypeLabels[p.type]()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const SightDistanceSlider: FC = () => {
  const { sight, setSight } = usePanelSettingsProvider(s => ({
    sight: s.sight,
    setSight: s.setSight,
  }));

  return (
    <div className="space-y-2 mt-8">
      <Label>{m['pages.public.calculator.settings.sight_distance_label']()}</Label>
      <p>{sight.from} - {sight.to}</p>
      <RangeSlider
        min={0}
        max={30}
        step={1}
        tickStep={5}
        value={[sight.from, sight.to]}
        onValueChange={val => setSight({ from: val[0], to: val[1] })}
        showTicks={true}
      />
    </div>
  );
};

const WallSizeInput: FC = () => {
  const { wallWidthCm, wallHeightCm, setWallWidthCm, setWallHeightCm } = usePanelSettingsProvider(s => ({
    wallWidthCm: s.wallWidthCm,
    wallHeightCm: s.wallHeightCm,
    setWallWidthCm: s.setWallWidthCm,
    setWallHeightCm: s.setWallHeightCm,
  }));

  return (
    <>
      <p className="text-xl font-semibold mt-8">
        {m['pages.public.calculator.settings.step_wall']()}
      </p>

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
    </>
  );
};

const DimensionsInput: FC = () => {
  const { tilesXCount, tilesYCount, setTilesXCount, setTilesYCount } = usePanelSettingsProvider(s => ({
    tilesXCount: s.tilesXCount,
    tilesYCount: s.tilesYCount,
    setTilesXCount: s.setTilesXCount,
    setTilesYCount: s.setTilesYCount,
  }));

  return (
    <>
      <p className="text-xl font-semibold mt-8">
        {m['pages.public.calculator.settings.step_dimensions']()}
      </p>

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
    </>
  );
};

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

        <div className="px-4 space-y-4 overflow-auto">
          <p className="text-xl font-semibold">
            {m['pages.public.calculator.settings.step_panel_type']()}
          </p>
          <PanelTypeSelector />
          <SightDistanceSlider />
          <WallSizeInput />
          <DimensionsInput />
        </div>

        <SheetFooter className='pt-0'>
          <Button type="submit">{m['pages.public.calculator.settings.submit']()}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PanelSettingsSheet;
