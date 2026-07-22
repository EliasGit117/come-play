import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import {
  PanelSettingsProvider,
  usePanelSettingsProvider
} from './-providers/panel-settings-provider';
import PanelSettingsSheet from './-components/panel-settings-sheet';
import PanelSettingsAside from './-components/panel-settings-aside';
import OpenPanelSettingsButton from './-components/open-panel-settings-button';
import { Skeleton } from '@/components/ui/skeleton';
import { m } from '@/paraglide/messages';
import { TILE_HEIGHT_MM, TILE_WIDTH_MM } from './-consts/tile';
import { defaultPreviewImage, previewImages } from './-consts/preview-images';

function useWindowHeight() {
  const [height, setHeight] = useState(1080);

  useEffect(() => {
    function handleResize() {
      if (!window.innerHeight) return;
      setHeight(window.innerHeight);
    }

    // Measure on mount, the value above is only an SSR guess
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
}

/** Width of the space actually left for the canvas, the aside takes its share of it */
function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export const Route = createFileRoute('/_public/calculator/')({
  component: () =>
    <PanelSettingsProvider>
      <RouteComponent/>
    </PanelSettingsProvider>
});

function RouteComponent() {
  const tilesYCount = usePanelSettingsProvider((s) => s.tilesYCount);
  const tilesXCount = usePanelSettingsProvider((s) => s.tilesXCount);
  const wallWidthCm = usePanelSettingsProvider((s) => s.wallWidthCm);
  const wallHeightCm = usePanelSettingsProvider((s) => s.wallHeightCm);
  const imageKey = usePanelSettingsProvider((s) => s.imageKey);
  const windowHeight = useWindowHeight();

  const image = previewImages.find((i) => i.key === imageKey) ?? defaultPreviewImage;
  const [canvasRef, canvasWidth] = useElementWidth<HTMLDivElement>();

  // Screen (the LCD panel) is always <= wall, tile counts are clamped to fit
  const screenWidth = tilesXCount * TILE_WIDTH_MM;
  const screenHeight = tilesYCount * TILE_HEIGHT_MM;

  // Wall is the outer bound the whole preview scales to
  const wallWidth = wallWidthCm * 10;
  const wallHeight = wallHeightCm * 10;

  // Calculate the actual displayed size considering max constraints
  const maxHeight = windowHeight * 0.66; // 66vh
  // Room on both sides for the size labels sitting outside the wall
  const maxWidth = Math.max(canvasWidth - LABEL_GUTTER_PX * 2, MIN_CANVAS_WIDTH_PX);

  const scaleX = wallWidth > maxWidth ? maxWidth / wallWidth : 1;
  const scaleY = wallHeight > maxHeight ? maxHeight / wallHeight : 1;
  const scale = Math.min(scaleX, scaleY);

  const displayWallWidth = wallWidth * scale;
  const displayWallHeight = wallHeight * scale;
  const displayScreenWidth = screenWidth * scale;
  const displayScreenHeight = screenHeight * scale;

  // 0 until the ResizeObserver reports, i.e. during SSR and first paint
  const measured = canvasWidth > 0;

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
    <div className="container mx-auto flex min-h-[calc(100dvh-4rem)]">
      <main className="flex-1 min-w-0 p-4">

        <div ref={canvasRef} className="flex justify-center items-center mt-10 relative">
          {!measured ? (
            // The panel can only be sized once the canvas has been measured on
            // the client, so hold the space with a skeleton of the same ratio
            <Skeleton
              style={{ aspectRatio: `${wallWidth} / ${wallHeight}` }}
              className="w-full max-h-[66dvh]"
            />
          ) : (
          // Wall: the surface holding the LCD screen, outer bound of the preview
          <div
            style={{ width: displayWallWidth, height: displayWallHeight }}
            className="relative flex items-center justify-center bg-muted border border-border"
          >
            {/* Screen: the LCD panel, always fits within the wall */}
            <div
              style={{ width: displayScreenWidth, height: displayScreenHeight }}
              className="relative border border-border/30"
            >
              <img src={image.src} alt={image.label} className="object-cover h-full w-full"/>

              {/* Vertical grid lines */}
              {verticalLines.map((line) => (
                <div
                  style={{ left: `${line.left}%` }}
                  className="absolute top-0 bottom-0 w-px bg-white/50"
                  key={line.id}
                />
              ))}

              {/* Horizontal grid lines */}
              {horizontalLines.map((line) => (
                <div
                  style={{ top: `${line.top}%` }}
                  className="absolute left-0 right-0 h-px bg-white/50"
                  key={line.id}
                />
              ))}
            </div>

            {/* Wall height label (on left, centered vertically) */}
            <div className="absolute -left-14 top-1/2 -translate-y-1/2 text-sm -rotate-90">
              {m['pages.public.calculator.size_cm']({ value: wallHeightCm })}
            </div>

            {/* Wall width label (at bottom, centered horizontally) */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm">
              {m['pages.public.calculator.size_cm']({ value: wallWidthCm })}
            </div>
          </div>
          )}
        </div>

        <OpenPanelSettingsButton
          size="icon-xl"
          className="fixed bottom-6 right-6 border border-border/50 rounded-full xl:hidden"
        />
      </main>

      <PanelSettingsAside/>
      <PanelSettingsSheet/>
    </div>
  );
}

const LABEL_GUTTER_PX = 64;
const MIN_CANVAS_WIDTH_PX = 120;