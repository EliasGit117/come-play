import { createContext, useContext, useState } from 'react';
import { createStore, ExtractState, StoreApi } from 'zustand/vanilla';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { PanelType, panelTypes } from '@/routes/_public/calculator/-consts/products';
import {
  DEFAULT_TILES_X_COUNT,
  DEFAULT_TILES_Y_COUNT,
  TILE_HEIGHT_CM,
  TILE_WIDTH_CM
} from '@/routes/_public/calculator/-consts/tile';
import { defaultPreviewImage } from '@/routes/_public/calculator/-consts/preview-images';

interface IPanelSettingsProviderStore {
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;

  panelType: PanelType;
  setPanelType: (value: PanelType) => void;

  imageKey: string;
  setImageKey: (value: string) => void;

  tilesXCount: number;
  setTilesXCount: (value: number | ((prevValue: number) => number)) => void;

  tilesYCount: number;
  setTilesYCount: (value: number | ((prevValue: number) => number)) => void;

  /** Never smaller than a single tile */
  wallWidthCm: number;
  setWallWidthCm: (value: number | ((prevValue: number) => number)) => void;

  /** Never smaller than a single tile */
  wallHeightCm: number;
  setWallHeightCm: (value: number | ((prevValue: number) => number)) => void;

  sight: { from: number; to: number };
  setSight: (value: { from: number; to: number } | ((prevValue: { from: number; to: number }) => {
    from: number;
    to: number
  })) => void;
}

const PanelSettingsContext =
  createContext<StoreApi<IPanelSettingsProviderStore> | null>(null);


export const PanelSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() =>
    createStore<IPanelSettingsProviderStore>((set) => ({
      isPanelOpen: false,
      setIsPanelOpen: (open) => set(() => ({ isPanelOpen: open })),

      panelType: panelTypes[0].type,
      setPanelType: (v) => set(() => ({ panelType: v })),

      imageKey: defaultPreviewImage.key,
      setImageKey: (v) => set(() => ({ imageKey: v })),

      tilesXCount: DEFAULT_TILES_X_COUNT,
      setTilesXCount: (value) => set((state) => ({
        tilesXCount: typeof value === 'function' ? value(state.tilesXCount) : value
      })),

      tilesYCount: DEFAULT_TILES_Y_COUNT,
      setTilesYCount: (value) => set((state) => ({
        tilesYCount: typeof value === 'function' ? value(state.tilesYCount) : value
      })),

      wallWidthCm: DEFAULT_TILES_X_COUNT * TILE_WIDTH_CM,
      setWallWidthCm: (value) => set((state) => {
        const next = typeof value === 'function' ? value(state.wallWidthCm) : value;
        const wallWidthCm = Math.max(next, TILE_WIDTH_CM);

        return {
          wallWidthCm,
          // Drop tiles that no longer fit on the wall
          tilesXCount: Math.min(state.tilesXCount, Math.floor(wallWidthCm / TILE_WIDTH_CM))
        };
      }),

      wallHeightCm: DEFAULT_TILES_Y_COUNT * TILE_HEIGHT_CM,
      setWallHeightCm: (value) => set((state) => {
        const next = typeof value === 'function' ? value(state.wallHeightCm) : value;
        const wallHeightCm = Math.max(next, TILE_HEIGHT_CM);

        return {
          wallHeightCm,
          // Drop tiles that no longer fit on the wall
          tilesYCount: Math.min(state.tilesYCount, Math.floor(wallHeightCm / TILE_HEIGHT_CM))
        };
      }),

      sight: { from: 0, to: 30 },
      setSight: (value) => set((state) => ({
        sight: typeof value === 'function' ? value(state.sight) : value
      }))
    }))
  );

  return (
    <PanelSettingsContext.Provider value={store}>
      {children}
    </PanelSettingsContext.Provider>
  );
};


export const usePanelSettingsProvider = <T = ExtractState<IPanelSettingsProviderStore>>(
  selector: (state: IPanelSettingsProviderStore) => T,
  equalityFn?: (left: T, right: T) => boolean
) => {
  const store = useContext(PanelSettingsContext);
  if (!store)
    throw new Error('Missing ImageDialogStoreProvider');

  return useStoreWithEqualityFn(store, selector, equalityFn);
};
