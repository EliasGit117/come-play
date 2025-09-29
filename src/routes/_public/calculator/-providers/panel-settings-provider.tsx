import { createContext, useContext, useState } from 'react';
import { createStore, ExtractState, StoreApi } from 'zustand/vanilla';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { IPanel, IPanelModel, PanelType, panelTypes, products } from '@/routes/_public/calculator/-consts/products';

interface IPanelSettingsProviderStore {
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;

  panelType: PanelType;
  setPanelType: (value: PanelType) => void;

  product: IPanel;
  setProduct: (product: IPanel) => void;

  panelModels: IPanelModel[];
  setPanelModels: (value: IPanelModel[] | ((prevValue: IPanelModel[]) => IPanelModel[])) => void;

  tilesXCount: number;
  setTilesXCount: (value: number | ((prevValue: number) => number)) => void;

  tilesYCount: number;
  setTilesYCount: (value: number | ((prevValue: number) => number)) => void;

  sight: { from: number; to: number };
  setSight: (value: { from: number; to: number } | ((prevValue: { from: number; to: number }) => {
    from: number;
    to: number
  })) => void;
}

const PanelSettingsContext =
  createContext<StoreApi<IPanelSettingsProviderStore> | null>(null);


const getDefaultPanelModels = (type: PanelType) =>
  products.find(p => p.type === type)?.models ?? [];

export const PanelSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() =>
    createStore<IPanelSettingsProviderStore>((set) => ({
      isPanelOpen: false,
      setIsPanelOpen: (open) => set(() => ({ isPanelOpen: open })),

      panelType: panelTypes[0].type,
      setPanelType: (v) => set(() => ({
        panelType: v,
        product: products.find(p => p.type === v) ?? products[0],
        panelModels: getDefaultPanelModels(v)
      })),

      product: products.find(p => p.type === panelTypes[0].type) ?? products[0],
      setProduct: (product: IPanel) => set(() => ({
        product: product,
        panelModels: product.models
      })),

      panelModels: getDefaultPanelModels(panelTypes[0].type),
      setPanelModels: (value) => set((state) => {
        const nextModels =
          typeof value === 'function' ? value(state.panelModels) : value;

        const minSight = Math.min(...nextModels.map((m) => m.sightFrom));
        const maxSight = Math.max(...nextModels.map((m) => m.sightTo));

        const newSight = {
          from: Math.min(state.sight.from, minSight),
          to: Math.max(state.sight.to, maxSight),
        };

        return { panelModels: nextModels, sight: newSight };
      }),

      tilesXCount: 5,
      setTilesXCount: (value) => set((state) => ({
        tilesXCount: typeof value === 'function' ? value(state.tilesXCount) : value
      })),

      tilesYCount: 5,
      setTilesYCount: (value) => set((state) => ({
        tilesYCount: typeof value === 'function' ? value(state.tilesYCount) : value
      })),

      sight: { from: 0, to: 30 },
      setSight: (value) => set((state) => {
        const nextValue = typeof value === 'function' ? value(state.sight) : value;
        const filteredModels = state.product.models?.filter((p) => p.sightFrom <= nextValue.to && p.sightTo >= nextValue.from);

        return { sight: nextValue, panelModels: filteredModels };
      })
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
