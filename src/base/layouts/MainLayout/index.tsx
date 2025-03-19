import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { ConfigProvider, Layout } from 'antd';
import { CollapseType } from 'antd/es/layout/Sider';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { mainLayoutAntdConfig } from '@base/configs/antdConfig';
import { APP_BAR_HEIGHT, SIDE_BAR_WIDTH } from '@base/configs/layoutConfig';
import { useGetConfig } from '@base/hooks/useGetConfig';
import { appSearchAtom, maskAtom } from '@base/store/atoms';
import { appConfig } from '@base/store/atoms/appconfig';
import { authAtom } from '@base/store/atoms/auth';

import Header from './Header';
import PinTabs from './PinTabs';
import SideBar from './SideBar';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const showMask = useRecoilValue(maskAtom);
  const [openDrawerBar, setOpenDrawerBar] = useState(false);
  const [marginLeft, setMarginLeft] = useState(SIDE_BAR_WIDTH);
  const [globalSearch, setGlobalSearch] = useRecoilState(appSearchAtom);
  const authData = useRecoilValue(authAtom);

  const setAppConfigRecoil = useSetRecoilState(appConfig);

  const { data } = useGetConfig({ enabled: Boolean(authData?.user?.accessToken) });

  useEffect(() => {
    if (data && data?.data) {
      setAppConfigRecoil(data?.data);
    }
  }, [data]);

  const onCollapse = (collapsed: boolean, type: CollapseType) => {
    if (collapsed) {
      setMarginLeft(0);
    } else {
      setMarginLeft(SIDE_BAR_WIDTH);
    }
  };

  const handleOpenDrawerBar = () => {
    setOpenDrawerBar(true);
  };

  const handleCloseDrawerBar = () => {
    setOpenDrawerBar(false);
  };

  // const handleGlobalSearch = (value: string) => {
  //   setGlobalSearch((prev) => ({ ...prev, globalSearch: true }));
  // };
  return (
    <ConfigProvider theme={mainLayoutAntdConfig}>
      {showMask && <div className="mask"></div>}
      <Header onClickButtonMenuOutlined={handleOpenDrawerBar} />
      <Layout
        style={{
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,

          overflow: 'hidden'
        }}
      >
        <SideBar openDrawerBar={openDrawerBar} onCloseDrawerBar={handleCloseDrawerBar} onCollapse={onCollapse} />
        <Layout.Content
          style={
            {
              // marginLeft: marginLeft,
              // transition: 'all ease-in-out 0.3s'
            }
          }
        >
          {/* <PinTabs /> */}
          <div style={{ width: '100%', height: '100%' }}>
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
