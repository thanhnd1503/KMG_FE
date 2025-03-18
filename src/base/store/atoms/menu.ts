import { atom } from 'recoil';

import { sidebarDefaultData } from '@base/_mocks/menu';
import { navPinTabsData } from '@base/configs';

export const sidebarAtom = atom<any>({
  key: 'sidebarAtom',
  default: sidebarDefaultData
});

export const navPinTabsAtom = atom<any>({
  key: 'navPinTabAtom',
  default: navPinTabsData
});

export const navPinTabsActiveAtom = atom<any>({
  key: 'navPinTabsActiveAtom',
  default: navPinTabsData[0]
  // default: undefined
});

export const showWarningReachingLimitTabsAtom = atom<boolean>({
  key: 'showWarningReachingLimitTabs',
  default: false
});
