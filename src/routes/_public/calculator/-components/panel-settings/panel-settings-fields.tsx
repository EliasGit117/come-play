import { FC } from 'react';
import { m } from '@/paraglide/messages';
import PanelSettingsStep from './panel-settings-step';
import PanelTypeSelector from './panel-type-selector';
import SightDistanceSlider from './sight-distance-slider';
import WallSizeInput from './wall-size-input';
import DimensionsInput from './dimensions-input';

/** Every panel setting in order, the sheet and the aside both render this */
const PanelSettingsFields: FC = () => (
  <div className="space-y-8">
    <PanelSettingsStep title={m['pages.public.calculator.settings.section_panel_type']()}>
      <PanelTypeSelector />
    </PanelSettingsStep>

    <PanelSettingsStep title={m['pages.public.calculator.settings.sight_distance_label']()}>
      <SightDistanceSlider />
    </PanelSettingsStep>

    <PanelSettingsStep title={m['pages.public.calculator.settings.section_wall']()}>
      <WallSizeInput />
    </PanelSettingsStep>

    <PanelSettingsStep title={m['pages.public.calculator.settings.section_dimensions']()}>
      <DimensionsInput />
    </PanelSettingsStep>
  </div>
);

export default PanelSettingsFields;
