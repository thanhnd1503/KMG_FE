import { useEffect, useState } from 'react';

import { MenuOutlined } from '@ant-design/icons';
import { ConfigProvider, Dropdown, Flex, Input, Layout, MenuProps, Modal, Typography } from 'antd';
import classNames from 'classnames/bind';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Button from '@base/components/Button/CustomButton';
import { BG_COLOR_PRIMARY, HEADER_HEIGHT, HEADER_PADDING } from '@base/configs/layoutConfig';
import useAuth from '@base/hooks/useAuth';
import { useTabs } from '@base/hooks/useTabs';
import useUserActions from '@base/hooks/useUserActions';
import { ChevronDown, PurchaseManager, Search, Settings } from '@base/icons';
import { appSearchAtom, maskAtom } from '@base/store/atoms';
import { authAtom } from '@base/store/atoms/auth';

import styles from './Header.module.css';
import ProfileForm from './ProfileForm';

const cx = classNames.bind(styles);
const { Text } = Typography;

export interface HeaderProps {
  onClickButtonMenuOutlined?: () => void;
}
const headerStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 999,
  height: HEADER_HEIGHT
};
const Header = (props: HeaderProps) => {
  const { onClickButtonMenuOutlined } = props;

  const { user: userInfo } = useAuth();
  const { logout } = useUserActions();
  const setShowMask = useSetRecoilState(maskAtom);
  const [globalSearch, setGlobalSearch] = useRecoilState(appSearchAtom);

  const [searchFormOpen, setSearchFormOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<boolean | undefined>(false);

  const [globalSearchText, setGlobalSearchText] = useState<string>('');
  const { activeTab, directTo, addOrActivateTab } = useTabs();

  const authData = useRecoilValue(authAtom);

  useEffect(() => {
    if (globalSearch.menuUrl !== activeTab?.url) {
      setGlobalSearchText('');
    } else {
      setGlobalSearchText(globalSearch.textSearch);
    }
  }, [globalSearch, activeTab]);

  const defaultOptions: MenuProps['items'] = [
    {
      label: <Text>내 프로필 수정</Text>,
      key: '0',
      onClick: () => {
        setDropdownContent(profileContent);
      }
    },
    {
      label: <Text>로그아웃</Text>,
      key: '1',
      onClick: () => logout(authData?.user?.accessToken || '')
    }
  ];

  const profileContent: MenuProps['items'] = [
    {
      label: (
        <ProfileForm
          handleClose={() => {
            setOpenDropdown(false);
            setShowMask(false);
            setDropdownContent(defaultOptions);
          }}
        />
      ),
      key: '2',
      type: 'group'
    }
  ];

  const [dropdownContent, setDropdownContent] = useState<MenuProps['items']>(defaultOptions);

  const handleEnter = () => {
    setGlobalSearch((prev) => ({
      ...prev,
      textSearch: globalSearchText,
      globalSearch: globalSearchText ? true : false,
      menuUrl: activeTab?.url
    }));
    addOrActivateTab(activeTab?.url || '', globalSearchText ? true : false);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: { headerPadding: `0 ${HEADER_PADDING}px`, headerBg: BG_COLOR_PRIMARY, headerHeight: HEADER_HEIGHT, colorText: '#fff' },
          Input: { borderRadiusLG: 10, paddingInlineLG: 13, paddingBlockLG: 8, colorText: '#333' },
          Badge: { lineWidth: 0 },
          Form: {
            labelColonMarginInlineEnd: 24,
            itemMarginBottom: 12
          }
        }
      }}
    >
      <Layout.Header style={headerStyle} className={cx('header')}>
        <Flex style={{ height: '100%' }} align="center" justify="space-between">
          <Flex align="center" gap={8} style={{ flex: '1' }}>
            <Button
              className={cx('button-menu-outlined')}
              type="primary"
              icon={<MenuOutlined />}
              size="middle"
              onClick={onClickButtonMenuOutlined}
            />
            <Typography
              className={cx('main-logo')}
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={() => {
                directTo(`/dashboard`);
              }}
            >
              702 Prime
            </Typography>
          </Flex>
          <Flex align="center" justify="end" gap={16} style={{ flex: '1' }}>
            {/* search input */}
            <Input
              className={cx('main-search-input') + ' body-text-lg'}
              style={{ maxWidth: 500, flex: '1', borderRadius: 4 }}
              size="large"
              placeholder="통합검색"
              suffix={
                <Search
                  style={{ fontSize: 20 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEnter();
                  }}
                />
              }
              allowClear
              value={globalSearchText}
              onChange={(e) => setGlobalSearchText(e.target.value)}
              onPressEnter={handleEnter}
            />
          </Flex>
          <Flex align="center" justify="end" gap={16} style={{ flex: '1' }}>
            {/* search-form-popup button */}
            <Button
              onClick={() => {
                console.log('RunThis');
                setSearchFormOpen(true);
              }}
              className={cx('button-search-responsive-outlined')}
              type="primary"
              icon={<Search />}
              size="middle"
            />
            {/* search-form-popup */}
            <Modal
              title=""
              closable={false}
              style={{ top: 2 }}
              footer={null}
              open={searchFormOpen}
              getContainer={false}
              onOk={() => setSearchFormOpen(false)}
              onCancel={() => setSearchFormOpen(false)}
            >
              <div style={{ padding: 10 }}>
                <Input
                  className={cx('sub-search-input')}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="예약 검색(이름, 휴대폰, 차량 번호, 예약번호)"
                  prefix={<Search style={{ fontSize: 16 }} />}
                  allowClear
                />
              </div>
            </Modal>
            {/* <Badge count={9} size="small" color="var(--primary-color)">
              <BellOutlined style={{ fontSize: 22, color: '#fff' }} className={cx('main-icon')}></BellOutlined>
            </Badge> */}
            <Flex gap={10} align="center">
              {/* <Avatar
                size={36}
                style={{ backgroundColor: '#fff', cursor: 'pointer' }}
                icon={<PurchaseManager style={{ color: 'red', fontSize: 20 }} />}
              /> */}
              <Button
                shape="circle"
                style={{ width: 36, height: 36 }}
                variant="outlined"
                color="secondary"
                icon={<PurchaseManager style={{ fontSize: 20 }} />}
              />
              <Flex vertical>
                <Text style={{ color: '#fff' }} className="body-text-lg">
                  직책
                  {/* User position */}
                </Text>
                <Text style={{ color: '#fff' }} className="body-text-lg">
                  {userInfo?.name}
                </Text>
              </Flex>
              <ChevronDown style={{ fontSize: 16 }} />
              <Dropdown
                placement="bottomRight"
                menu={{ items: dropdownContent, style: { minWidth: 200, maxWidth: 700 } }}
                trigger={['click']}
                open={openDropdown}
                getPopupContainer={(triggerNode: HTMLElement): HTMLElement => {
                  return triggerNode.parentElement ? triggerNode.parentElement : document.body;
                }}
                onOpenChange={(open, info) => {
                  if (info.source === 'trigger' || open) {
                    setOpenDropdown(open);
                    setDropdownContent(defaultOptions);
                  }
                }}
              >
                <Settings style={{ fontSize: 28, color: '#fff', paddingLeft: 24 }} className={cx('main-icon')} />
              </Dropdown>
            </Flex>
          </Flex>
        </Flex>
      </Layout.Header>
    </ConfigProvider>
  );
};

export default Header;
