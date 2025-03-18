import { ReactElement, ReactNode } from 'react';

export type MenuItemType = {
  key: string;
  title?: ReactNode | string;
  type?: string;
  url: string;
  icon?: ReactNode;
  color?: string;
  disabled?: boolean;
};
export type sidebarType = {
  activeMenu: MenuItemType;
  listSidebar: {
    [key: string]: MenuItemType[];
  };
};
export type SearchBarType = 'text' | 'datePicker' | 'rangeNumber' | 'select';

export type NavPinTab = {
  key: string;
  label: string;
  url: string;
  children?: any;
  menu: string;
};
