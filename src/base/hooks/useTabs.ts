import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRecoilState } from 'recoil';

import { getMenuTabLabel } from '@base/configs/menuMappingConfig';
import { LIMIT_TAB_VIEW } from '@base/constant';
import { navPinTabsActiveAtom, navPinTabsAtom } from '@base/store/atoms/menu';
import { NavPinTab } from '@base/types/menu';
import { generateUUID } from '@base/utils/helper';

import useToast from './useToast';

export type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export const useTabs = () => {
  const showToast = useToast();
  const [tabs, setTabs] = useRecoilState<NavPinTab[]>(navPinTabsAtom);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useRecoilState<NavPinTab | undefined>(navPinTabsActiveAtom);

  let newTabKey: any;

  const openTab = (url: string, label: string, menu: string) => {
    const newPanes = [...tabs];

    if (url === '/' || url === '') return;
    if (newPanes?.length >= LIMIT_TAB_VIEW) {
      showToast({ content: `The number of tabs is already ${LIMIT_TAB_VIEW}`, type: 'warning' });
      return;
    }
    const currTab = newPanes.find((ele) => ele.url === url);

    if (currTab) {
      handleActiveTab(currTab);
    } else {
      newTabKey = generateUUID();
      const newTab = {
        label: label,
        key: newTabKey,
        url: url,
        menu: menu
      };
      setTabs((prevTabs) => {
        return [newTab, ...prevTabs];
      });

      handleActiveTab(newTab);
    }
  };

  const remove = (targetKey: TargetKey) => {
    if (targetKey !== activeTab?.key) {
      const newPanes = tabs.filter((item) => item.key !== targetKey);
      setTabs(newPanes);
    } else {
      const newPanes = tabs.filter((item) => item.key !== targetKey);
      setTabs(newPanes);
      handleActiveTab(newPanes[0]);
    }
  };

  const onTabClick = (key: string, event: React.KeyboardEvent | React.MouseEvent) => {
    if (key === activeTab?.key) {
      return;
    } else {
      const selectTab = tabs.find((ele) => ele.key === key);
      if (selectTab) {
        handleActiveTab(selectTab);
      }
    }
  };

  const updateTab = (targetKey: string, tabValue: NavPinTab) => {
    setTabs((prevItems) => prevItems.map((item) => (item.key === targetKey ? { ...item, ...tabValue } : item)));
  };

  const directTo = (url: string, label?: string, menuUrlSearch?: string) => {
    const urlArrays = url?.split('/');

    const menuUrl = urlArrays?.[1] || '';
    const submenuUrl = urlArrays?.[2] || '';
    const typeUrl = urlArrays?.[3] || 'list';

    const menuLabel = label ? label : getMenuTabLabel(menuUrl, submenuUrl, typeUrl as 'list' | 'view' | 'write');

    if (activeTab) {
      if (!menuUrlSearch && menuUrl !== 'dashboard') {
        const nTab = {
          key: activeTab.key,
          label: menuLabel,
          menu: activeTab.menu,
          url: url
        };

        // updateTab(activeTab.key, nTab);
        // handleActiveTab(nTab);
      } else {
        // openTab(url, menuLabel, menuUrl);
      }
    }
  };

  const findTabByUrl = useCallback(
    (url: string) => {
      const urlArray = url?.split('/');
      const menuUrl = urlArray?.[1] || '';
      const submenuUrl = urlArray?.[2] || '';
      const otherSubmenuUrl = urlArray?.[3] || '';
      if (menuUrl && submenuUrl) {
        if (otherSubmenuUrl) {
          return tabs.find(
            (tab) =>
              tab.url?.split('/')[1] === menuUrl && tab.url?.split('/')[2] === submenuUrl && tab.url?.split('/')[3] === otherSubmenuUrl
          );
        } else {
          return tabs.find((tab) => tab.url?.split('/')[1] === menuUrl && tab.url?.split('/')[2] === submenuUrl);
        }
      } else {
        return tabs.find((tab) => tab.url === url);
      }
    },
    [tabs]
  );

  const addOrActivateTab = (url: string, isNavigate: boolean = true, isGlobalSearch?: any) => {
    const existingTab = findTabByUrl(url);

    if (existingTab) {
      handleActiveTab(existingTab, isNavigate);
    } else {
      const urlArrays = url?.split('/');

      const menuUrl = urlArrays?.[1] || '';
      const submenuUrl = urlArrays?.[2] || '';
      const typeUrl = urlArrays?.[3] || 'list';

      const menuLabel = getMenuTabLabel(menuUrl, submenuUrl, typeUrl as 'list' | 'view' | 'write');
      // openTab(url, menuLabel, menuUrl);
    }
  };

  const handleActiveTab = (tab: NavPinTab, isNavigate: boolean = true) => {
    setActiveTab(tab);
    if (tabs.some((t) => t.key === tab.key && (t.label !== tab.label || t.url !== tab.url))) {
      updateTab(tab.key, tab);
    }
    if (isNavigate) navigate(tab.url);
  };

  return {
    tabs,
    activeTab,
    onTabClick,
    remove,
    addOrActivateTab,
    directTo,
    updateTab,
    findTabByUrl
  };
};
