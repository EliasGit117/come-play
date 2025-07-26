import { FC } from 'react';
import { usePanelSettingsProvider } from '@/routes/calculator/-providers/panel-settings-provider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { panelTypes, products } from '@/routes/calculator/-consts/products';
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

const ProductSelector: FC = () => {
  const { panelType, productKey, setProduct } = usePanelSettingsProvider(s => ({
    panelType: s.panelType,
    productKey: s.product.key,
    setProduct: s.setProduct,
  }));

  const productsByType = products.filter(p => p.type === panelType);

  const onProductChange = (productKey: string) => {
    const found = products.find(p => p.key === productKey);
    if (!found) return;
    setProduct(found);
  };

  return (
    <div className="space-y-2">
      <Label>Product</Label>
      <Select value={productKey} onValueChange={onProductChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {productsByType.map(p => (
              <SelectItem value={p.key} key={p.key}>
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
      <Label>Sight Distance(m)</Label>
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

const PanelModelsSelector: FC = () => {
  const { productModels, panelModels, setPanelModels } = usePanelSettingsProvider(s => ({
    productModels: s.product.models ?? [],
    panelModels: s.panelModels,
    setPanelModels: s.setPanelModels,
  }));

  return (
    <div className="space-y-2 mt-8">
      <Label>Recommended Model(mm)</Label>
      <div className="flex flex-wrap gap-2">
        {productModels.map(m => {
          const selected = !!panelModels.find(p => p.key === m.key);
          return (
            <Button
              key={m.key}
              className="border"
              variant={selected ? 'default' : 'outline'}
              onClick={() => {
                if (selected) {
                  setPanelModels(pv => pv.filter(v => v.key !== m.key));
                  return;
                }
                setPanelModels(pv => [...pv, m]);
              }}
            >
              {m.name}
            </Button>
          );
        })}
      </div>
    </div>
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
      <p className="text-xl font-semibold mt-8">2. Set your dimensions</p>

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
          <p className="text-xl font-semibold">1. Select a product</p>
          <PanelTypeSelector />
          <ProductSelector />
          <SightDistanceSlider />
          <PanelModelsSelector />
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
