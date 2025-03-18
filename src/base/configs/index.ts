import { NavPinTab } from '@base/types/menu';

export const LIST_TABLE_PAGE_SIZE = 20;

const HOST_SERVER = 'http://211.234.116.228:7011';

export const API_URL = `${HOST_SERVER}/api`;

export const navPinTabsData: NavPinTab[] = [
  {
    key: '0',
    label: '대시보드',
    url: '/dashboard',
    menu: 'dashboard'
  }
];
