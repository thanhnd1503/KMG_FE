import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';

import { BREADCRUMB_HEIGHT } from '@base/configs/layoutConfig';
import { useTabs } from '@base/hooks/useTabs';
import { Clock } from '@base/icons';
// import TopBreadcrumb from '@base/layouts/MainLayout/TopBreadcrumb';
import { sidebarAtom } from '@base/store/atoms/menu';
import { queryKeys } from '@demo/configs/queryKeys';
// import { MENU_PURCHASE_KEY, MENU_PURCHASE_URL, SUBMENU_PARAMS } from 'demo/constants/menu';
// import { MENU_PURCHASE_KEY, MENU_PURCHASE_URL, SUBMENU_PARAMS } from '@purchase/constants/menu';
// import { useGetPurchaseView } from '@purchase/hooks/useGetPurchaseView';

interface MainContainerProps {}

const MainContainer = (props: MainContainerProps) => {
  const { subMenu, list, view } = useParams();
  const params = useParams();
  const sideBarData = useRecoilValue(sidebarAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const { directTo } = useTabs();

  const queryClient = useQueryClient();

  const isList = location.pathname.includes('/list');
  const isView = location.pathname.includes('/view');

  // useEffect(() => {
  //   const listSidebar = sideBarData.listSidebar[MENU_PURCHASE_KEY];
  //   const isValid = listSidebar?.findIndex((item: any) => {
  //     return item.key?.split('_')[1] === subMenu;
  //   });

  //   if (isValid < 0) {
  //     if (subMenu && !SUBMENU_PARAMS.includes(subMenu)) {
  //       directTo(`/${MENU_PURCHASE_URL}/${SUBMENU_PARAMS[0]}/list`);
  //     }
  //   }
  // }, [sideBarData, navigate, subMenu]);

  // const { data } = useGetPurchaseView({ id: params?.id }, subMenu ?? undefined, { enabled: !!params?.id && isView });

  // const breadCrumbItem = useMemo(
  //   () => [
  //     {
  //       title: '매입관리',
  //       onClick: () => {
  //         directTo(`/${MENU_PURCHASE_URL}/${params?.subMenu}/list`);
  //       }
  //     },
  //     {
  //       title: params?.subMenu,
  //       onClick: () => {
  //         directTo(`/${MENU_PURCHASE_URL}/${params?.subMenu}/list`);
  //       }
  //     },
  //     {
  //       title: data?.docCode
  //     }
  //   ],
  //   [isView, data]
  // );

  return (
    <div style={{ height: '100%' }}>
      {/* <TopBreadcrumb
        breadcrumbItems={isView ? breadCrumbItem : []}
        onBack={
          !isList
            ? () => {
                directTo(`/${MENU_PURCHASE_URL}/${subMenu}/list`);
              }
            : undefined
        }
        onRefresh={() => {
          if (isView) {
            // Refresh View
            queryClient.refetchQueries([[queryKeys.getDemoDetail, subMenu ?? '', params?.id].join('_')]);
          } else {
            // Refresh List
            queryClient.refetchQueries([queryKeys.getDemoList]);
          }
        }}
        onWrite={() => {}}
      /> */}
      <div style={{ height: '100%', overflowY: 'auto' }} className="scroll-box">
        <Outlet />
      </div>
    </div>
  );
};

export default MainContainer;
