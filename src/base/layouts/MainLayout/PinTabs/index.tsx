import { useCallback, useEffect, useMemo } from 'react';

import { ConfigProvider, Tabs } from 'antd';
import { useRecoilState } from 'recoil';

import OverflowTooltip from '@base/components/OverflowTooltip';
import { TAB_CONTAINER_HEIGHT } from '@base/configs/layoutConfig';
import { useTabs } from '@base/hooks/useTabs';
import BaseContentLayout from '@base/layouts/BaseContentLayout';
import { appSearchAtom } from '@base/store/atoms';

import DynamicOutlet from './DynamicOutlet';

import './style.css';
interface PinTabsProps {}
const PinTabs = (props: PinTabsProps) => {
  const [globalSearch, setGlobalSearch] = useRecoilState(appSearchAtom);
  const { tabs, activeTab, onTabClick, remove, addOrActivateTab } = useTabs();

  useEffect(() => {
    if (window.location.pathname) {
      addOrActivateTab(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: any) => {
      addOrActivateTab(event.target.location.pathname, false);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [tabs]);

  const tabsMemo = useMemo(
    () =>
      tabs.map((tab) => ({
        key: tab.key,
        label: tab.key === activeTab?.key && globalSearch.textSearch ? `${tab.label} > ${globalSearch.textSearch} 검색결과` : tab.label,
        children: (
          <BaseContentLayout key={tab.key}>
            <DynamicOutlet dynamicPath={tab.url || ''} tabKey={tab.key} />
          </BaseContentLayout>
        ),
        closable: Boolean(tabs?.length > 1)
      })),
    [tabs, globalSearch.textSearch]
  );

  const handleTabClick = useCallback(
    (key: string, event: React.MouseEvent | React.KeyboardEvent) => {
      onTabClick(key, event);
    },
    [onTabClick]
  );

  const handleRemove = useCallback(
    (targetKey: string, action: 'add' | 'remove') => {
      if (action === 'remove') {
        setGlobalSearch((prev) => ({ ...prev, menuUrl: '' }));
        remove(targetKey);
      }
    },
    [remove]
  );

  return (
    <div
      style={{
        width: '100%'
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              cardBg: 'var(--tab-screen-bg-enabled, #FFFFFF)',
              itemColor: 'var(--tab-screen-fg-enabled, #646E8B)',
              itemHoverColor: 'var(--tab-screen-fg-hovered, #333c55)',
              itemSelectedColor: 'var(--tab-screen-fg-selected, #6366f1)'
            }
          }
        }}
      >
        <Tabs
          activeKey={activeTab?.key}
          type="editable-card"
          more={undefined}
          hideAdd
          onTabClick={handleTabClick}
          onEdit={(targetKey, action) => {
            handleRemove(targetKey as string, action);
          }}
          renderTabBar={(tabBarProps, DefaultTabBar) => {
            return (
              <DefaultTabBar
                {...tabBarProps}
                style={{
                  height: TAB_CONTAINER_HEIGHT
                }}
                className={'header-tab-container'}
              >
                {(node: any) => {
                  const updatedNode = {
                    ...node,
                    props: {
                      ...node?.props,
                      children: node?.props?.children?.map((child: any, index: number) => {
                        if (index === 0) {
                          return {
                            ...child,
                            props: {
                              ...child.props,
                              children: child.props.children?.map((subChild: any, subIndex: number) => {
                                if (subIndex === 1) {
                                  return (
                                    <OverflowTooltip key={subIndex}>{node?.props?.children?.[0]?.props?.children?.[1]}</OverflowTooltip>
                                  );
                                }
                                return subChild;
                              })
                            }
                          };
                        }
                        return child;
                      })
                    }
                  };
                  return (
                    <div style={{ width: 224, height: 36 }} className="button-md">
                      {/* {node} */}
                      {updatedNode}
                    </div>
                  );
                }}
              </DefaultTabBar>
            );
          }}
          items={tabsMemo}
        />
        {/* <Outlet /> */}
      </ConfigProvider>
    </div>
  );
};

export default PinTabs;
