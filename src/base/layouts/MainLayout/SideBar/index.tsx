import { NavLink, useLocation } from 'react-router-dom';

import { Drawer, Flex, Layout, Menu, Typography } from 'antd';
import { CollapseType } from 'antd/es/layout/Sider';
import classNames from 'classnames/bind';

import { HEADER_HEIGHT, SIDE_BAR_WIDTH } from '@base/configs/layoutConfig';

import LeftBar from '../LeftBar';
import styles from './SideBar.module.css';
const { Text } = Typography;
const cx = classNames.bind(styles);
export interface SideBarProps {
  openDrawerBar?: boolean;
  onCloseDrawerBar?: () => void;
  onCollapse?: (collapsed: boolean, type: CollapseType) => void;
}

export default function SideBar({ openDrawerBar = false, onCloseDrawerBar, onCollapse }: SideBarProps) {
  const { pathname } = useLocation();
  // const { activeSidebar, activeMenu } = useMenus();

  // const isActiveSidebar = (key: string) => {
  //   const [menuKey, sideBarKey] = key.split('_');
  //   return pathname.includes(menuKey) && pathname.includes(sideBarKey);
  // };
  return (
    <Layout.Sider
      className={cx('wrapper', 'scroll-box')}
      breakpoint={'xl'}
      theme="light"
      collapsedWidth={0}
      width={SIDE_BAR_WIDTH}
      trigger={null}
      onCollapse={onCollapse}
      // style={{ height: `calc(100% - ${HEADER_HEIGHT}px)` }}
      style={{ height: '100%' }}
    >
      <LeftBar />
      {/* drawer bar */}
      <Drawer title={''} placement="left" onClick={onCloseDrawerBar} onClose={onCloseDrawerBar} open={openDrawerBar}>
        <Menu mode="horizontal">
          <Flex vertical gap={16} align="center" className={cx('sidebar-drawer')}>
            <div></div>
          </Flex>
        </Menu>
      </Drawer>
    </Layout.Sider>
  );
}
