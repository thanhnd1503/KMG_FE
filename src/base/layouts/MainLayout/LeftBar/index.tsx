import React, { useEffect, useMemo, useState } from 'react';

import { ConfigProvider, Menu, MenuProps } from 'antd';
import { useRecoilValue } from 'recoil';


import { BG_COLOR_PRIMARY, BG_COLOR_SELECTED } from '@base/configs/layoutConfig';
import { getIconByKey } from '@base/constant';
import { useTabs } from '@base/hooks/useTabs';
import { appConfig } from '@base/store/atoms/appconfig';

// interface LevelKeysProps {
//   key?: string;
//   children?: LevelKeysProps[];
// }

// const getLevelKeys = (items: LevelKeysProps[]): Record<string, number> => {
//   const key: Record<string, number> = {};
//   const checkLevelKeys = (items: LevelKeysProps[], level = 1) => {
//     items.forEach((item) => {
//       if (item.key) key[item.key] = level;
//       if (item.children) checkLevelKeys(item.children, level + 1);
//     });
//   };
//   checkLevelKeys(items);
//   return key;
// };

const findItemByKey = (items: any[], key: string): any | undefined => {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findItemByKey(item.children, key);
      if (found) return found;
    }
  }
  return undefined;
};

const findItemByUrl = (items: any[], url?: string): any | undefined => {
  for (const item of items) {
    if (url?.includes(item.url)) return item;
    if (item.children) {
      const found = findItemByUrl(item.children, url);
      if (found) return found;
    }
  }
  return undefined;
};

const LIST_TYPE_MENUS = ['customer', 'vendor', 'stock', 'auction', 'purchase', 'sales', 'account'];
const LeftBar: React.FC = () => {
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);
  const [leftBarItems, setLeftBarItems] = useState<any[]>([]);
  const { addOrActivateTab, activeTab, directTo } = useTabs();

  const appConfigRecoil = useRecoilValue(appConfig);

  // useEffect(() => {
  //   const fetchMenuData = async () => {
  //     const data = await fetchLeftBarItems();
  //     setLeftBarItems(data.map((item: any) => ({ ...item, icon: getIconByKey(item.key) })));
  //     // for admin menu only
  //     // setLeftBarItems(
  //     //   data?.filter((ele) => ADMIN_MENU_KEY.includes(ele.key)).map((item: any) => ({ ...item, icon: getIconByKey(item.key) }))
  //     // );
  //   };
  //   fetchMenuData();
  // }, []);

  useEffect(() => {
    if (appConfigRecoil.menuList) {
      const formatItem = (menu: any[]): any[] => {
        const nItems = menu
          .filter((ele) => Boolean(ele.isEnabled))
          .map((item: any) => {
            const { menuKey, upperId, isEnabled, read, create, update, delete: deletePermission, ...other } = item;
            return {
              ...other,
              icon: getIconByKey(item.menuKey),
              label: item.name,
              key: item.menuKey,
              url: item.path,
              children: item.children && item.children.length > 0 ? formatItem(item.children) : undefined
            };
          });

        return nItems;
      };

      setLeftBarItems(
        process.env.REACT_APP_ENV !== 'prod'
          ? [
              {
                key: 'demo',
                label: 'DEMO',
                icon: getIconByKey('demo'),
                order: 1,
                children: [
                  { key: 'demo_dev', label: 'Demo Dev', url: '/demo/dev' },
                  { key: 'demo_test', label: 'Demo Test', url: '/demo/test' }
                ]
              },
              ...formatItem(appConfigRecoil.menuList)
            ]
          : formatItem(appConfigRecoil.menuList)
      );
    }
  }, [appConfigRecoil.menuList]);

  // const levelKeys = useMemo(() => getLevelKeys(leftBarItems as LevelKeysProps[]), [leftBarItems]);

  const handleChangeItem: MenuProps['onSelect'] = ({ key }) => {
    const selectedItem = findItemByKey(leftBarItems, key);
    const menuKey = key?.split('_')?.[0];
    const isListType = LIST_TYPE_MENUS.includes(menuKey);
    if (selectedItem?.url) addOrActivateTab(selectedItem.url + (isListType ? '/list' : ''));
  };

  const handleClickItem = (key: string) => {
    if (activeTab?.url.split('/')[1] === key.split('_')[0] && activeTab?.url.split('/')[2] === key.split('_')[1]) {
      const selectedItem = findItemByKey(leftBarItems, key);
      const menuKey = key?.split('_')?.[0];
      const isListType = LIST_TYPE_MENUS.includes(menuKey);
      if (selectedItem?.url) directTo(selectedItem.url + (isListType ? '/list' : ''));
    }
  };

  const activeItem = useMemo(() => findItemByUrl(leftBarItems, activeTab?.url), [activeTab, leftBarItems]);

  useEffect(() => {
    setStateOpenKeys(activeItem ? activeItem.key?.split('_')?.slice(0, 1) : []);
  }, [activeItem]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            darkItemColor: '#949DB8',
            darkSubMenuItemBg: BG_COLOR_PRIMARY,
            darkItemSelectedBg: BG_COLOR_SELECTED
          }
        }
      }}
    >
      <Menu
        selectedKeys={[activeItem?.key]}
        onSelect={handleChangeItem}
        onClick={(e) => {
          handleClickItem(e.key);
        }}
        mode="inline"
        theme="dark"
        style={{ width: 180, backgroundColor: BG_COLOR_PRIMARY }}
        items={leftBarItems
          ?.sort((a, b) => a.order - b.order)
          ?.map((item) => ({
            key: item.key,
            label: item.label,
            icon: item.icon,
            children: item.children?.sort((a: any, b: any) => a.order - b.order)
          }))}
        className="LeftBar"
      />
    </ConfigProvider>
  );
};

export default LeftBar;
