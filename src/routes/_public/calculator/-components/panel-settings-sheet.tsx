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
import { panelTypes } from '@/routes/_public/calculator/-consts/products';
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
      <Label>Panel Type</Label>
      <Select value={panelType} onValueChange={onPanelTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a panel type" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {panelTypes.map(p => (
              <SelectItem value={p.type} key={p.type}>
                {p.name}
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
      <Label>Sight Distance (m)</Label>
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
      <p className="text-xl font-semibold mt-8">2. Set your wall size</p>

      <div className="space-y-2">
        <Label>Wall width (cm)</Label>
        <NumberInput
          maxLength={4}
          min={TILE_WIDTH_CM}
          value={wallWidthCm}
          onValueChange={v => setWallWidthCm(v ?? TILE_WIDTH_CM)}
        />
      </div>

      <div className="space-y-2">
        <Label>Wall height (cm)</Label>
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
      <p className="text-xl font-semibold mt-8">3. Set your dimensions</p>

      <div className="space-y-2">
        <Label>Tiles horizontal</Label>
        <NumberInput
          maxLength={3}
          value={tilesXCount}
          onValueChange={v => setTilesXCount(v ?? 1)}
        />
      </div>

      <div className="space-y-2">
        <Label>Tiles vertical</Label>
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
          <SheetTitle className='sr-only md:not-sr-only'>Panel Settings</SheetTitle>
          <SheetDescription className='sr-only md:not-sr-only'>
            Configure your panel type and dimensions
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-4 overflow-auto">
          <p className="text-xl font-semibold">1. Select a panel type</p>
          <PanelTypeSelector />
          <SightDistanceSlider />
          <WallSizeInput />
          <DimensionsInput />
        </div>

        <SheetFooter className='pt-0'>
          <Button type="submit">Generate results</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PanelSettingsSheet;
