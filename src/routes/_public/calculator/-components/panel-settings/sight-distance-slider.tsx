import { ComponentProps, FC, useCallback } from 'react';
import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';
import RangeSlider from '@/components/ui/range-slider';

const SightDistanceSlider: FC = () => {
  const { sight, setSight } = usePanelSettingsProvider(s => ({
    sight: s.sight,
    setSight: s.setSight
  }));

  // RangeSlider owns its value internally (defaultValue + onChange API);
  // passing `value`/`onValueChange` would override its root and freeze the
  // thumb badges. Stable identity keeps its debounced effect from looping.
  // Cast: RangeSlider's prop type intersects its tuple onChange with the DOM
  // form handler it inherits from the Root props, runtime only calls the tuple.
  const onChange = useCallback(
    (val: [number, number]) => setSight({ from: val[0], to: val[1] }),
    [setSight]
  ) as ComponentProps<typeof RangeSlider>['onChange'];

  return (
    <RangeSlider
      min={0}
      max={30}
      step={1}
      tickStep={5}
      defaultValue={[sight.from, sight.to]}
      onChange={onChange}
      showTicks={true}
    />
  );
};

export default SightDistanceSlider;
