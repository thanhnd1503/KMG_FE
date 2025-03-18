import { atom } from 'recoil';

export const appConfig = atom<{
  baseSetting: {
    [x: string]: string;
  };
  menuList: any[];
  permission: {
    [x: string]: any;
  };
}>({
  key: 'appConfig',
  default: {
    baseSetting: {},
    menuList: [],
    permission: {}
  }
});
