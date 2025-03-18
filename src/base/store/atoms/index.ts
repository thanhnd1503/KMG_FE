import { atom } from 'recoil';

export const maskAtom = atom<any>({
  key: 'maskAtom',
  default: false
});

export const appSearchAtom = atom<{ textSearch: string; menuUrl?: string; countResult?: any }>({
  key: 'appSearchTextAtom',
  default: {
    textSearch: '',
    menuUrl: '',
    countResult: {
      customers: 0,
      vendors: 0,
      stocks: 0,
      purchases: 0,
      sales: 0
    }
  }
});
