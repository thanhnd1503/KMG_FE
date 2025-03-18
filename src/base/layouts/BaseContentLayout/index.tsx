import { lazy, ReactNode, Suspense, useEffect, useMemo } from 'react';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';

// import GlobalPage from '@base/components/GlobalPage';
import Loader from '@base/components/Loader';
import { APP_BAR_HEIGHT, TAB_CONTAINER_HEIGHT } from '@base/configs/layoutConfig';
import { useTabs } from '@base/hooks/useTabs';
import { appSearchAtom } from '@base/store/atoms';

interface Props {
  children: ReactNode;
}

const BaseContentLayout = (props: Props) => {
  const { children } = props;
  const [globalSearch, setGlobalSearch] = useRecoilState(appSearchAtom);
  const { activeTab } = useTabs();
  const isFetching: number = useIsFetching();
  const isMutating: number = useIsMutating();
  const isLoading = Boolean(isMutating || isFetching);
  useEffect(() => {
    setGlobalSearch({ menuUrl: '', textSearch: '' });
  }, [activeTab?.url]);
  const memoizedGlobalPage = useMemo(() => {
    if (globalSearch.menuUrl !== activeTab?.url) return;

    return (
      <Suspense fallback={<Loader />}>
        {/* <GlobalPage /> */}
      </Suspense>
    );
  }, [globalSearch.menuUrl]);
  return (
    <div
      style={{
        height: `calc(100vh - ${APP_BAR_HEIGHT + TAB_CONTAINER_HEIGHT}px)`,
        position: 'relative'
      }}
    >
      {isLoading && <Loader />}
      {children}
      {/* {memoizedGlobalPage} */}
    </div>
  );
};

export default BaseContentLayout;
