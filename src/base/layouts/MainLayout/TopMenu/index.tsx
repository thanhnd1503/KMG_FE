import { CaretDownOutlined, CaretUpOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { useIcons } from '@base/hooks/useIcons';
import useMenus from '@base/hooks/useMenus';
import { Avatar, Badge, Flex, Input, Layout, Space, Tabs, Typography } from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './TopMenu.module.css';
const { Text } = Typography;
const cx = classNames.bind(styles);
export interface TopMenuProps {
  onSlideHorizontal: (slideHorizontal: boolean) => void;
}

export default function TopMenu({ onSlideHorizontal }: TopMenuProps) {
  const { listMenuDisplay, listMenuDisplayMore, allMenus, activeMenu } = useMenus();
  const { getIconByKey } = useIcons();
  const [listMenuDisplayState, setListMenuDisplayState] = useState(listMenuDisplay);
  const [slideHorizontal, setSlideHorizontal] = useState<boolean>(false);
  const [slideVertical, setSlideVertical] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const handleSlideHorizontal = () => {
    // left - right
    if (!isTransitioning) {
      setIsTransitioning(true);
      onSlideHorizontal(!slideHorizontal);
      setSlideHorizontal((prev) => !prev);
      if (!slideHorizontal) {
        handleDisplayMenu('active');
      } else {
        handleDisplayMenu('full');
      }
    }
  };

  const handleSlideVertical = () => {
    // top - bottom
    setSlideVertical((prev) => !prev);
  };

  const handleDisplayMenu = (mode: 'active' | 'full') => {
    switch (mode) {
      case 'active': // show active menu
        setListMenuDisplayState(listMenuDisplay.filter((item) => item.key === activeMenu.key));
        break;
      case 'full': // show full menu
        setListMenuDisplayState(listMenuDisplay);
        break;
      default: // show full menu
        setListMenuDisplayState(listMenuDisplay);
    }
  };

  useEffect(() => {
    const displayFullMenu = () => {
      if (window.innerWidth < 1200) {
        onSlideHorizontal(false);
        setSlideHorizontal(false);
        handleDisplayMenu('full');
      } else {
        setSlideVertical(false);
      }
    };
    displayFullMenu();
    window.addEventListener('resize', displayFullMenu);
    return () => {
      window.removeEventListener('resize', displayFullMenu);
    };
  }, []);

  return (
    <div
      onTransitionEnd={() => setIsTransitioning(false)}
      className={cx('wrapper', { 'slide-to-left-top-menu': slideHorizontal, 'slide-to-top-top-menu': slideVertical })}
    >
      <Tabs
        tabBarStyle={{ height: '100%' }}
        centered={slideHorizontal}
        className={cx('section-menu', { 'slide-to-left-section-menu': slideHorizontal, 'slide-to-top-section-menu': slideVertical })}
        activeKey={activeMenu.key}
        items={listMenuDisplayState.map((item, index) => {
          return {
            key: item.key,
            label: (
              <Flex
                align="center"
                justify="center"
                style={{
                  width: 100
                }}
                gap={12}
              >
                {getIconByKey(item.key, { width: 20, height: 20 })}
                <Text style={{ color: 'unset' }} strong>
                  {item.title}
                </Text>
              </Flex>
            )
          };
        })}
        onTabClick={(key: string) => navigate(listMenuDisplay.find((item: any) => item.key === key)?.url || '/')}
      />
      {/* slide horizontal button  */}
      <button onMouseEnter={handleSlideHorizontal} className={cx('slide-horizontal-button', 'hovered')}>
        <div>{slideHorizontal ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}</div>
      </button>
      {/* slide vertical button */}
      <button onMouseEnter={handleSlideVertical} className={cx('slide-vertical-button', 'hovered')}>
        {slideVertical ? <CaretDownOutlined /> : <CaretUpOutlined />}
      </button>
    </div>
  );
}
