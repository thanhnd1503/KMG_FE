import { MenuItemType, sidebarType } from '@base/types/menu';

export const sidebarDefaultData: sidebarType = {
  activeMenu: {
    key: 'product',
    title: '차량',
    url: '/product'
  },
  listSidebar: {}
};

export const topMenuData: MenuItemType[] = [
  {
    key: 'product',
    title: '차량',
    url: '/product'
  },
  {
    key: 'contract',
    title: '렌트 계약',
    url: '/contract'
  },
  {
    key: 'customer',
    title: '고객',
    url: '/customer'
  },
  {
    key: 'notification',
    title: '알림 발송',
    url: '/notification'
  },
  {
    key: 'settlement',
    title: '정산관리',
    url: '/settlement'
  },
  {
    key: 'account',
    title: '계정',
    url: '/account'
  }
];
