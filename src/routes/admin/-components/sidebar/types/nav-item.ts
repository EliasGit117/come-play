import { TablerIcon } from '@tabler/icons-react';
import { LinkOptions } from '@tanstack/react-router';


export interface INavItem {
  title: string;
  linkOptions?: LinkOptions;
  icon?: TablerIcon;
}
