// import accountConfig from '@account/configs/menuConfig';
// import {
//   menuBasicSettingConfig,
//   menuUserManagementConfig,
//   menuSecurityManagementConfig,
//   menuInfoChangeHistoryConfig,
//   menuLogHistoryConfig
// } from '@adminsetting/configs/menuConfig';
// import { MENU_ADMIN_SETTING_URL } from '@adminsetting/constants/menu';
// import customerConfig from '@customer/configs/menuConfig';
// import dashboardConfig from '@dashboard/configs/menuConfig';
// import demoConfig from '@demo/configs/menuConfig';
// import purchaseConfig from '@purchase/configs/menuConfig';
// import salesConfig from '@sales/configs/menuConfig';
// import settingConfig from '@setting/configs/menuConfig';
// import stockConfig from '@stock/configs/menuConfig';
// import vendorConfig from '@vendor/configs/menuConfig';

// import auctionConfig from '../../auction/configs/menuConfig';
export const parseSubmenu = (menu: string, submenu: string) => {
  // switch (menu) {
  //   case demoConfig.key:
  //     return demoConfig.subMenu?.[submenu as keyof typeof demoConfig.subMenu]?.name;
  //   case accountConfig.key:
  //     return accountConfig.subMenu?.[submenu as keyof typeof accountConfig.subMenu]?.name;
  //   case purchaseConfig.key:
  //     return purchaseConfig.subMenu?.[submenu as keyof typeof purchaseConfig.subMenu]?.name;
  //   case salesConfig.key:
  //     return salesConfig.subMenu?.[submenu as keyof typeof salesConfig.subMenu]?.name;
  //   case stockConfig.key:
  //     return stockConfig.subMenu?.[submenu as keyof typeof stockConfig.subMenu]?.name;
  //   case auctionConfig.key:
  //     return auctionConfig.subMenu?.[submenu as keyof typeof auctionConfig.subMenu]?.name;
  //   case settingConfig.key:
  //     return settingConfig.subMenu?.[submenu as keyof typeof settingConfig.subMenu]?.name;
  //   case vendorConfig.key:
  //     return vendorConfig.subMenu?.[submenu as keyof typeof vendorConfig.subMenu]?.name;

  //   case menuBasicSettingConfig.key:
  //     return menuBasicSettingConfig.subMenu?.[submenu as keyof typeof menuBasicSettingConfig.subMenu]?.name;
  //   case menuUserManagementConfig.key:
  //     return menuUserManagementConfig.subMenu?.[submenu as keyof typeof menuUserManagementConfig.subMenu]?.name;
  //   case menuSecurityManagementConfig.key:
  //     return menuSecurityManagementConfig.subMenu?.[submenu as keyof typeof menuSecurityManagementConfig.subMenu]?.name;
  //   case menuInfoChangeHistoryConfig.key:
  //     return menuInfoChangeHistoryConfig.subMenu?.[submenu as keyof typeof menuInfoChangeHistoryConfig.subMenu]?.name;
  //   case menuLogHistoryConfig.key:
  //     return menuLogHistoryConfig.subMenu?.[submenu as keyof typeof menuLogHistoryConfig.subMenu]?.name;

  //   case customerConfig.key:
  //     return '';
  //   case dashboardConfig.key:
  //     return '';
  //   default:
  //     return [submenu, menu].join(' ');
  // }
};

export const parseMenuName = (menu: string) => {
  // switch (menu) {
  //   case demoConfig.key:
  //     return demoConfig?.name;
  //   case accountConfig.key:
  //     return accountConfig?.name;
  //   case purchaseConfig.key:
  //     return purchaseConfig?.name;
  //   case salesConfig.key:
  //     return salesConfig?.name;
  //   case stockConfig.key:
  //     return stockConfig?.name;
  //   case auctionConfig.key:
  //     return auctionConfig?.name;
  //   case vendorConfig.key:
  //     return vendorConfig?.name;
  //   case dashboardConfig.key:
  //     return dashboardConfig?.name;
  //   case settingConfig.key:
  //     return settingConfig?.name;

  //   case menuBasicSettingConfig.key:
  //     return menuBasicSettingConfig?.name;
  //   case menuUserManagementConfig.key:
  //     return menuUserManagementConfig?.name;
  //   case menuSecurityManagementConfig.key:
  //     return menuSecurityManagementConfig?.name;
  //   case menuInfoChangeHistoryConfig.key:
  //     return menuInfoChangeHistoryConfig?.name;
  //   case menuLogHistoryConfig.key:
  //     return menuLogHistoryConfig?.name;

  //   case customerConfig.key:
  //     return customerConfig?.name;
  //   default:
  //     return menu;
  // }
};

export const parseMenuIncludeName = (menu: string) => {
  // Not all menu has Include name for view, pls check with figma definition
  // switch (menu) {
  //   case demoConfig.key:
  //     return demoConfig?.name;
  //   case accountConfig.key:
  //     return accountConfig?.name;
  //   case purchaseConfig.key:
  //     return purchaseConfig?.viewIncludeName;
  //   case salesConfig.key:
  //     return salesConfig?.viewIncludeName;
  //   case customerConfig.key:
  //     return customerConfig?.viewIncludeName;
  //   case stockConfig.key:
  //     return stockConfig?.viewIncludeName;
  //   case auctionConfig.key:
  //     return auctionConfig?.viewIncludeName;
  //   case settingConfig.key:
  //     return settingConfig?.name;
  //   case vendorConfig.key:
  //     return vendorConfig?.viewIncludeName;
  //   default:
  //     return menu;
  // }
};

export const getMenuTabLabel = (menu: string, submenu: string, type?: 'list' | 'view' | 'write' | string) => {
  // if (menu === customerConfig.key && type === 'write') {
  //   return '고객관리 > 고객등록';
  // } else if (menu === MENU_ADMIN_SETTING_URL) {
  //   return [parseMenuName(submenu), parseSubmenu(submenu, type || '')].filter(Boolean).join(' > ');
  // } else {
  //   return [parseMenuName(menu), parseSubmenu(menu, submenu)].filter(Boolean).join(' > ');
  // }
};
