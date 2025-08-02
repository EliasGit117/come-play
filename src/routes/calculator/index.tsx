import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  PanelSettingsProvider,
  usePanelSettingsProvider
} from '@/routes/calculator/-providers/panel-settings-provider';
import PanelSettingsSheet from '@/routes/calculator/-components/panel-settings-sheet';
import OpenPanelSettingsButton from '@/routes/calculator/-components/open-panel-settings-button';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export const Route = createFileRoute('/calculator/')({
  component: () =>
    <PanelSettingsProvider>
      <RouteComponent/>
    </PanelSettingsProvider>
});

function RouteComponent() {
  const product = usePanelSettingsProvider((s) => s.product);
  const tilesYCount = usePanelSettingsProvider((s) => s.tilesYCount);
  const tilesXCount = usePanelSettingsProvider((s) => s.tilesXCount);
  const setTilesXCount = usePanelSettingsProvider((s) => s.setTilesXCount);
  const setTilesYCount = usePanelSettingsProvider((s) => s.setTilesYCount);
  const windowSize = useWindowSize();

  const height = tilesYCount * product.height;
  const width = tilesXCount * product.width;

  // Calculate the actual displayed size considering max constraints
  const maxHeight = windowSize.height * 0.66; // 66vh
  const maxWidth = windowSize.width * 0.66; // 66vw

  const scaleX = width > maxWidth ? maxWidth / width : 1;
  const scaleY = height > maxHeight ? maxHeight / height : 1;
  const scale = Math.min(scaleX, scaleY);

  const displayWidth = width * scale;
  const displayHeight = height * scale;

  // Create grid lines based on panel count
  const verticalLines = [];
  const horizontalLines = [];

  // Vertical lines (between columns)
  for (let i = 1; i < tilesXCount; i++)
    verticalLines.push({ id: `v-${i}`, left: (i / tilesXCount) * 100 });

  // Horizontal lines (between rows)
  for (let i = 1; i < tilesYCount; i++)
    horizontalLines.push({ id: `h-${i}`, top: (i / tilesYCount) * 100 });


  return (
    <>
      <main className="container mx-auto p-4 min-h-screen">
        <div className="flex gap-4 mx-auto w-fit">

          <div className="flex flex-col gap-2">
            <Label>Vertical count</Label>
            <div className="flex justify-center">
              <Button
                size="smIcon"
                variant="secondary"
                className="rounded-r-none border"
                disabled={tilesYCount <= 1}
                onClick={() => setTilesYCount(pv => pv > 0 ? pv - 1 : pv)}
              >
                <MinusIcon/>
              </Button>
              <Input
                className="h-8 w-12 text-center rounded-none border-x-0"
                value={tilesYCount}
                readOnly
              />
              <Button
                size="smIcon"
                variant="secondary"
                className='rounded-l-none border'
                disabled={tilesYCount >= 100}
                onClick={() => setTilesYCount(pv => pv <= 100 ? pv + 1 : pv)}
              >
                <PlusIcon/>
              </Button>
            </div>
          </div>


          <div className="flex flex-col gap-2">
            <Label>Horizontal count</Label>
            <div className="flex justify-center">
              <Button
                size="smIcon"
                variant="secondary"
                className="rounded-r-none border"
                disabled={tilesXCount <= 1}
                onClick={() => setTilesXCount(pv => pv > 0 ? pv - 1 : pv)}
              >
                <MinusIcon/>
              </Button>
              <Input
                className="h-8 w-12 text-center rounded-none border-x-0"
                value={tilesXCount}
                readOnly
              />
              <Button
                size="smIcon"
                variant="secondary"
                className='rounded-l-none border'
                disabled={tilesXCount >= 100}
                onClick={() => setTilesXCount(pv => pv <= 100 ? pv + 1 : pv)}
              >
                <PlusIcon/>
              </Button>
            </div>
          </div>

        </div>


        <div className="flex justify-center items-center mt-12 relative">
          <div
            style={{
              width: displayWidth,
              height: displayHeight
            }}
            className="relative border border-border/30"
          >
            <img
              src={imgSrc}
              alt={`${product.name} preview`}
              className="object-cover h-full w-full"
            />

            {/* Vertical grid lines */}
            {verticalLines.map((line) => (
              <div
                key={line.id}
                style={{ left: `${line.left}%` }}
                className="absolute top-0 bottom-0 w-[1px] bg-white/50"
              />
            ))}

            {/* Horizontal grid lines */}
            {horizontalLines.map((line) => (
              <div
                key={line.id}
                style={{ top: `${line.top}%` }}
                className="absolute left-0 right-0 h-[1px] bg-white/50"
              />
            ))}

            {/* Total height label (on left, centered vertically) */}
            <div className="absolute -left-14 top-1/2 -translate-y-1/2  text-sm rotate-[-90deg]">
              {height} mm
            </div>

            {/* Total width label (at bottom, centered horizontally) */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 -white text-sm">
              {width} mm
            </div>
          </div>
        </div>

        <OpenPanelSettingsButton
          size="xlIcon"
          className="fixed bottom-6 right-6 border border-border/50 rounded-full"
        />
      </main>

      <PanelSettingsSheet/>
    </>
  );
}

const imgSrc = 'https://www.itcleddisplay.com/wp-content/themes/baolun/images/calcbg.jpg';