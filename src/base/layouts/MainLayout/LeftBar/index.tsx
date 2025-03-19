import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfigProvider, Menu, MenuProps } from 'antd';
import { useRecoilValue } from 'recoil';

import { BG_COLOR_PRIMARY, BG_COLOR_SELECTED } from '@base/configs/layoutConfig';
import { getIconByKey } from '@base/constant';
import { appConfig } from '@base/store/atoms/appconfig';

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
const LeftBar = () => {
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);
  const [leftBarItems, setLeftBarItems] = useState<any[]>([
    {
      key: 'demo',
      label: 'DEMO',
      icon: getIconByKey('demo'),
      order: 1,
      children: [
        { key: 'demo_dev', label: 'Demo Dev', url: '/demo/dev' },
        { key: 'demo_test', label: 'Demo Test', url: '/demo/product-block' }
      ]
    }
  ]);

  const navigate = useNavigate();

  const appConfigRecoil = useRecoilValue(appConfig);

  const handleChangeItem: MenuProps['onSelect'] = ({ key }) => {
    const selectedItem = findItemByKey(leftBarItems, key);
    const menuKey = key?.split('_')?.[0];
    const isListType = LIST_TYPE_MENUS.includes(menuKey);
    if (selectedItem?.url) navigate(selectedItem.url + (isListType ? '/list' : ''));
  };

  const handleClickItem = (key: string) => {
    const selectedItem = findItemByKey(leftBarItems, key);
    const menuKey = key?.split('_')?.[0];
    const isListType = LIST_TYPE_MENUS.includes(menuKey);
    if (selectedItem?.url) navigate(selectedItem.url + (isListType ? '/list' : ''));
  };

  const activeItem = useMemo(() => findItemByUrl(leftBarItems, window.location.pathname), [leftBarItems]);

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
        style={{ width: 180, backgroundColor: BG_COLOR_PRIMARY, height: '100%' }}
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
