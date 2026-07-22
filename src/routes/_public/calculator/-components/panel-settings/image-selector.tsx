import { FC } from 'react';
import { IconCheck } from '@tabler/icons-react';
import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';
import { previewImages } from '@/routes/_public/calculator/-consts/preview-images';
import { cn } from '@/lib/utils';

const ImageSelector: FC = () => {
  const { imageKey, setImageKey } = usePanelSettingsProvider(s => ({
    imageKey: s.imageKey,
    setImageKey: s.setImageKey,
  }));

  return (
    <div className="grid grid-cols-3 gap-2">
      {previewImages.map(img => {
        const selected = img.key === imageKey;
        return (
          <button
            key={img.key}
            type="button"
            aria-pressed={selected}
            onClick={() => setImageKey(img.key)}
            className={cn(
              'relative aspect-video overflow-hidden rounded-md border transition-colors',
              selected ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary/50'
            )}
          >
            <img src={img.src} alt={img.label} className="h-full w-full object-cover"/>
            {selected && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <IconCheck className="size-3"/>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ImageSelector;
