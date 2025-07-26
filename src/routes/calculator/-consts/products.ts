export enum PanelType {
  Indoor = 'indoor',
  Outdoor = 'outdoor',
}

export const panelTypes: { name: string; type: PanelType }[] = [
  { name: 'Indoor LED Display', type: PanelType.Indoor },
  { name: 'Outdoor LED Display', type: PanelType.Outdoor }
];

export interface IPanelModel {
  key: string;
  name: string;
  sightFrom: number,
  sightTo: number;
}

export interface IPanel {
  key: string;
  name: string;
  height: number;
  width: number;
  type: PanelType;
  models?: IPanelModel[];
}

export const products: IPanel[] = [
  // Indoor
  {
    name: 'A series-16:9',
    key: 'a-series-16-9',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p0.9375', name: 'P0.9375', sightFrom: 5, sightTo: 18 },
      { key: 'p.1.19', name: 'P1.19', sightFrom: 7, sightTo: 15 },
      { key: 'p1.25', name: 'P1.25', sightFrom: 12, sightTo: 26 },
      { key: 'p1.45', name: 'P1.45', sightFrom: 1, sightTo: 8 },
      { key: 'p1.5625', name: 'P1.5625', sightFrom: 9, sightTo: 30 }
    ]
  },
  {
    key: 'b-series',
    name: 'B series',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p1-56', name: 'P1.56', sightFrom: 1, sightTo: 5 },
      { key: 'p1-66', name: 'P1.66', sightFrom: 1.5, sightTo: 6 }
    ]
  },
  {
    key: 'c-series-y1',
    name: 'C series-Y1',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p1-25', name: 'P1.25', sightFrom: 0.8, sightTo: 4 },
      { key: 'p1-53', name: 'P1.53', sightFrom: 1, sightTo: 5.5 },
      { key: 'p1-86', name: 'P1.86', sightFrom: 1.2, sightTo: 6.5 }
    ]
  },
  {
    key: 'c-series-y2',
    name: 'C series-Y2',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 },
      { key: 'p3-0', name: 'P3.0', sightFrom: 2.5, sightTo: 12 }
    ]
  },
  {
    key: 'c-series-4-3',
    name: 'C series-4:3',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p2-0', name: 'P2.0', sightFrom: 1.8, sightTo: 8 },
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 },
      { key: 'p3-0', name: 'P3.0', sightFrom: 2.5, sightTo: 12 }
    ]
  },
  {
    key: 'c-series-y3',
    name: 'C series-Y3',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p1-53', name: 'P1.53', sightFrom: 1, sightTo: 5.5 },
      { key: 'p1-86', name: 'P1.86', sightFrom: 1.2, sightTo: 6.5 }
    ]
  },
  {
    key: 'c-series-16-9',
    name: 'C series-16:9',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p1-25', name: 'P1.25', sightFrom: 0.8, sightTo: 4 },
      { key: 'p1-45', name: 'P1.45', sightFrom: 0.9, sightTo: 4.5 },
      { key: 'p1-5625', name: 'P1.5625', sightFrom: 1, sightTo: 5 }
    ]
  },
  {
    key: 'c-series-m1',
    name: 'C series-M1',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p1-53', name: 'P1.53', sightFrom: 1, sightTo: 5.5 },
      { key: 'p1-86', name: 'P1.86', sightFrom: 1.2, sightTo: 6.5 }
    ]
  },
  {
    key: 'c-series-m2',
    name: 'C series-M2',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p2-0', name: 'P2.0', sightFrom: 1.8, sightTo: 8 },
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 },
      { key: 'p3-0', name: 'P3.0', sightFrom: 2.5, sightTo: 12 }
    ]
  },
  {
    key: 'cob-series',
    name: 'COB series',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p0-93', name: 'P0.93', sightFrom: 0.5, sightTo: 2.5 }
    ]
  },
  {
    key: 'g-series',
    name: 'G series',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p', name: 'P', sightFrom: 0.5, sightTo: 2 }
    ]
  },
  {
    key: 'x-series',
    name: 'X series',
    type: PanelType.Indoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p1-27', name: 'P1.27', sightFrom: 0.8, sightTo: 4 },
      { key: 'p1-58', name: 'P1.58', sightFrom: 1, sightTo: 5 },
      { key: 'p1-9', name: 'P1.9', sightFrom: 1.3, sightTo: 6 },
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 }
    ]
  },
  // Outdoor
  {
    key: 'k-pro-series-z',
    name: 'K Pro Series-Z',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 },
      { key: 'p3-0', name: 'P3.0', sightFrom: 2.5, sightTo: 12 },
      { key: 'p4-0', name: 'P4.0', sightFrom: 3, sightTo: 16 },
      { key: 'p5-0', name: 'P5.0', sightFrom: 4, sightTo: 20 },
      { key: 'p5-9', name: 'P5.9', sightFrom: 4.5, sightTo: 24 },
      { key: 'p8-0', name: 'P8.0', sightFrom: 6, sightTo: 32 }
    ]
  },
  {
    key: 'k-pro-series-g',
    name: 'K Pro Series-G',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 },
      { key: 'p3-0', name: 'P3.0', sightFrom: 2.5, sightTo: 12 },
      { key: 'p4-0', name: 'P4.0', sightFrom: 3, sightTo: 16 },
      { key: 'p5-0', name: 'P5.0', sightFrom: 4, sightTo: 20 },
      { key: 'p5-9', name: 'P5.9', sightFrom: 4.5, sightTo: 24 },
      { key: 'p6-6', name: 'P6.6', sightFrom: 5, sightTo: 28 },
      { key: 'p8-0', name: 'P8.0', sightFrom: 6, sightTo: 32 },
      { key: 'p10', name: 'P10', sightFrom: 8, sightTo: 40 }
    ]
  },
  {
    key: 'k-series-y1',
    name: 'K series-Y1',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 }
    ]
  },
  {
    key: 'k-series-y2',
    name: 'K series-Y2',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p3-0', name: 'P3.0', sightFrom: 2.5, sightTo: 12 },
      { key: 'p4-0', name: 'P4.0', sightFrom: 3, sightTo: 16 },
      { key: 'p6-67', name: 'P6.67', sightFrom: 5, sightTo: 28 }
    ]
  },
  {
    key: 'k-series-b1',
    name: 'K series-B1',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 }
    ]
  },
  {
    key: 'k-series-b2',
    name: 'K series-B2',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p3-0', name: 'P3.0', sightFrom: 2.5, sightTo: 12 },
      { key: 'p4-0', name: 'P4.0', sightFrom: 3, sightTo: 16 },
      { key: 'p5-0', name: 'P5.0', sightFrom: 4, sightTo: 20 },
      { key: 'p6-0', name: 'P6.0', sightFrom: 4.5, sightTo: 24 },
      { key: 'p6-67', name: 'P6.67', sightFrom: 5, sightTo: 28 },
      { key: 'p8-0', name: 'P8.0', sightFrom: 6, sightTo: 32 }
    ]
  },
  {
    key: 'k-series-j1',
    name: 'K series-J1',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p2-5', name: 'P2.5', sightFrom: 2, sightTo: 10 }
    ]
  },
  {
    key: 'k-series-j2',
    name: 'K series-J2',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p3-0', name: 'P3.0', sightFrom: 2.5, sightTo: 12 },
      { key: 'p4-0', name: 'P4.0', sightFrom: 3, sightTo: 16 },
      { key: 'p5-0', name: 'P5.0', sightFrom: 4, sightTo: 20 },
      { key: 'p6-0', name: 'P6.0', sightFrom: 4.5, sightTo: 24 },
      { key: 'p6-67', name: 'P6.67', sightFrom: 5, sightTo: 28 },
      { key: 'p8-0', name: 'P8.0', sightFrom: 6, sightTo: 32 },
      { key: 'p10', name: 'P10', sightFrom: 8, sightTo: 40 }
    ]
  },
  {
    key: 'k-series-j3',
    name: 'K series-J3',
    type: PanelType.Outdoor,
    height: 50,
    width: 100,
    models: [
      { key: 'p4-0', name: 'P4.0', sightFrom: 3, sightTo: 16 },
      { key: 'p5-0', name: 'P5.0', sightFrom: 4, sightTo: 20 },
      { key: 'p6-0', name: 'P6.0', sightFrom: 4.5, sightTo: 24 },
      { key: 'p6-67', name: 'P6.67', sightFrom: 5, sightTo: 28 },
      { key: 'p8-0', name: 'P8.0', sightFrom: 6, sightTo: 32 },
      { key: 'p10-0', name: 'P10.0', sightFrom: 8, sightTo: 40 }
    ]
  }
] as const;
