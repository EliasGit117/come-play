import { LinkOptions } from '@tanstack/react-router';
import { m } from '@/paraglide/messages';
import { TUser } from '@/lib/auth/better-auth';

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

export const getHeaderLinks = (user?: TUser | null): TLinkItem[] => [
  {
    type: MenuItemType.Group,
    title: m['layout.header.products.title'](),
    items: [
      {
        label: m['layout.header.products.indoor.label'](),
        description: m['layout.header.products.indoor.description'](),
        linkOpt: { to: '/products/$category', params: { category: 'indoor' } }
      },
      {
        label: m['layout.header.products.outdoor.label'](),
        description: m['layout.header.products.outdoor.description'](),
        linkOpt: { to: '/products/$category', params: { category: 'outdoor' } }
      },
      {
        label: m['layout.header.products.rental.label'](),
        description: m['layout.header.products.rental.description'](),
        linkOpt: { to: '/products/$category', params: { category: 'rental' } }
      },
      {
        label: m['layout.header.products.transparent.label'](),
        description: m['layout.header.products.transparent.description'](),
        linkOpt: { to: '/products/$category', params: { category: 'transparent' } }
      },
      {
        label: m['layout.header.products.soft.label'](),
        description: m['layout.header.products.soft.description'](),
        linkOpt: { to: '/products/$category', params: { category: 'soft' } }
      }
    ]
  },
  {
    type: MenuItemType.Single,
    item: {
      label: m['layout.header.news.title'](),
      linkOpt: { to: '/news' }
    }
  },
  {
    type: MenuItemType.Single,
    item: { label: m['layout.header.contact'](), linkOpt: { to: '/contacts' } }
  },
  {
    type: MenuItemType.Single,
    item: { label: m['layout.header.calculator'](), linkOpt: { to: '/calculator' } }
  },
  ...(user?.role === 'admin' ? [{
    type: MenuItemType.Single,
    item: { label: m['layout.header.admin'](), linkOpt: { to: '/admin' } }
  } satisfies TSingleLinkItem] : [])
];
