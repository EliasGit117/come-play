import { LinkOptions } from '@tanstack/react-router';

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

export const headerLinks: TLinkItem[] = [
  {
    type: MenuItemType.Group,
    title: 'Products',
    items: [
      { label: 'Indoor LED Display', description: 'High-quality LED screens for indoor use.', linkOpt: { to: '/' } },
      {
        label: 'Outdoor LED Display',
        description: 'Durable and bright displays for outdoor environments.',
        linkOpt: { to: '/' }
      },
      {
        label: 'Rental LED Display',
        description: 'Portable LED solutions for events and shows.',
        linkOpt: { to: '/' }
      },
      {
        label: 'Transparent LED Screen',
        description: 'See-through LED displays for creative setups.',
        linkOpt: { to: '/' }
      },
      { label: 'Soft LED Screen', description: 'Flexible LED panels for unique installations.', linkOpt: { to: '/' } },
      {
        label: 'Floor Tile Screen',
        description: 'Interactive LED floor tiles for events and spaces.',
        linkOpt: { to: '/' }
      }
    ]
  },
  {
    type: MenuItemType.Group,
    title: 'Solutions',
    items: [
      {
        label: 'Conference Room',
        description: 'Display solutions for meeting and conference spaces.',
        linkOpt: { to: '/' }
      },
      { label: 'Advertising', description: 'LED displays for marketing and promotion.', linkOpt: { to: '/' } },
      { label: 'Race Stadium', description: 'High-visibility screens for sports venues.', linkOpt: { to: '/' } },
      { label: 'Transportation', description: 'Signage and displays for transit hubs.', linkOpt: { to: '/' } },
      {
        label: 'Stage & Events',
        description: 'Dynamic displays for live events and exhibitions.',
        linkOpt: { to: '/' }
      },
      { label: 'Studio', description: 'Professional LED solutions for broadcast and studios.', linkOpt: { to: '/' } },
      {
        label: 'Scenic Spot & Public',
        description: 'Outdoor displays for tourist and public areas.',
        linkOpt: { to: '/' }
      },
      {
        label: 'Control Room',
        description: 'Visualization walls for monitoring and control centers.',
        linkOpt: { to: '/' }
      },
      { label: 'Others', description: 'Flexible LED solutions for custom applications.', linkOpt: { to: '/' } }
    ]
  },
  {
    type: MenuItemType.Group,
    title: 'Cases',
    items: [
      { label: 'Conference Room', description: 'Display solutions for conference environments.', linkOpt: { to: '/' } },
      { label: 'Advertising', description: 'LED displays for marketing and promotion.', linkOpt: { to: '/' } },
      { label: 'Race Stadium', description: 'High-visibility screens for sports venues.', linkOpt: { to: '/' } },
      { label: 'Transportation', description: 'Signage and displays for transit hubs.', linkOpt: { to: '/' } },
      { label: 'Stage & Exhibition', description: 'Dynamic displays for events and expos.', linkOpt: { to: '/' } },
      { label: 'Studio', description: 'Professional LED solutions for studios.', linkOpt: { to: '/' } },
      {
        label: 'Scenic Spot & Public',
        description: 'Outdoor displays for tourist and public areas.',
        linkOpt: { to: '/' }
      },
      { label: 'Control Room', description: 'Visualization walls for monitoring centers.', linkOpt: { to: '/' } }
    ]
  },
  {
    type: MenuItemType.Group,
    title: 'News',
    items: [
      { label: 'All news', description: 'Discover latest news', linkOpt: { to: '/news' } },
      { label: 'Company News', description: 'Updates and announcements from our company.', linkOpt: { to: '/' } },
      {
        label: 'LED Knowledge',
        description: 'Learn tips, insights, and LED display technology basics.',
        linkOpt: { to: '/' }
      }
    ]
  },
  {
    type: MenuItemType.Single,
    item: { label: 'OEM/ODM', linkOpt: { to: '/' } }
  },
  {
    type: MenuItemType.Group,
    title: 'About',
    items: [
      { label: 'Company Information', description: 'Learn more about our company background.', linkOpt: { to: '/' } },
      { label: 'Factory Profile', description: 'Explore our production facilities.', linkOpt: { to: '/' } },
      { label: 'Certificates', description: 'View our quality and compliance certifications.', linkOpt: { to: '/' } },
      { label: 'VR Showroom', description: 'Take a virtual tour of our products.', linkOpt: { to: '/' } },
      { label: 'Privacy Policy', description: 'Learn how we handle your data.', linkOpt: { to: '/' } }
    ]
  },
  {
    type: MenuItemType.Single,
    item: { label: 'Contact', linkOpt: { to: '/' } }
  }
];
