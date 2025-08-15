import { LinkOptions } from '@tanstack/react-router';
import { LucideIcon } from 'lucide-react';

export interface INavItem {
  title: string;
  linkOptions?: LinkOptions;
  icon?: LucideIcon;
}
