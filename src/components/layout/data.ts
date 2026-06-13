import { LinkOptions } from '@tanstack/react-router';
import { m } from '@/paraglide/messages';

export interface ILinkItem {
  label: string;
  description?: string;
  linkOpt: LinkOptions;
}

export enum MenuItemType {
  Single = 'single',
  Group = 'group',
}

export type TSingleLinkItem = { type: MenuItemType.Single; item: ILinkItem };
export type TLinkGroupItem = { type: MenuItemType.Group; title: string; items: ILinkItem[] };

export type TLinkItem = TSingleLinkItem | TLinkGroupItem;

export const getHeaderLinks = (): TLinkItem[] => [
  {
    type: MenuItemType.Group,
    title: m['layout.header.products.title'](),
    items: [
      { label: m['layout.header.products.indoor.label'](), description: m['layout.header.products.indoor.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.products.outdoor.label'](), description: m['layout.header.products.outdoor.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.products.rental.label'](), description: m['layout.header.products.rental.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.products.transparent.label'](), description: m['layout.header.products.transparent.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.products.soft.label'](), description: m['layout.header.products.soft.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.products.floorTile.label'](), description: m['layout.header.products.floorTile.description'](), linkOpt: { to: '/' } }
    ]
  },
  {
    type: MenuItemType.Group,
    title: m['layout.header.news.title'](),
    items: [
      { label: m['layout.header.news.all.label'](), description: m['layout.header.news.all.description'](), linkOpt: { to: '/news' } },
      { label: m['layout.header.news.company.label'](), description: m['layout.header.news.company.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.news.knowledge.label'](), description: m['layout.header.news.knowledge.description'](), linkOpt: { to: '/' } }
    ]
  },
  {
    type: MenuItemType.Group,
    title: m['layout.header.about.title'](),
    items: [
      { label: m['layout.header.about.company.label'](), description: m['layout.header.about.company.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.about.factory.label'](), description: m['layout.header.about.factory.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.about.certificates.label'](), description: m['layout.header.about.certificates.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.about.vr.label'](), description: m['layout.header.about.vr.description'](), linkOpt: { to: '/' } },
      { label: m['layout.header.about.privacy.label'](), description: m['layout.header.about.privacy.description'](), linkOpt: { to: '/' } }
    ]
  },
  {
    type: MenuItemType.Single,
    item: { label: m['layout.header.contact'](), linkOpt: { to: '/' } }
  },
  {
    type: MenuItemType.Single,
    item: { label: 'Admin', linkOpt: { to: '/admin' } }
  }
];
