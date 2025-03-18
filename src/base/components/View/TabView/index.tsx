import { ConfigProvider, Tabs } from 'antd';

import './style.css';

interface TabViewProps {
  items: any[];
  containerStyle?: React.CSSProperties;
  tabsStyle?: React.CSSProperties;
  tabBarExtraContent?: React.ReactNode;
  onChange?: ((activeKey: string) => void) | undefined;
  defaultActiveKey?: string | undefined;
}

const TabView = (props: TabViewProps) => {
  const { items, containerStyle, tabsStyle, tabBarExtraContent, onChange, defaultActiveKey } = props;

  if (!items || items?.length === 0) {
    return <></>;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            horizontalItemGutter: 0,
            itemSelectedColor: 'var(--tab-info-stroke-selected, #333C55)',
            itemActiveColor: 'var(--tab-info-fg-pressed, #0F162A)',
            inkBarColor: 'var(--tab-info-fg-selected, #333C55)',
            itemColor: 'var(--tab-info-fg-enabled, #646E8B)'
          }
        }
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          ...containerStyle
        }}
        className={'right-tab-container'}
      >
        <Tabs
          destroyInactiveTabPane
          onChange={(activeKey: string) => {
            onChange && onChange(activeKey);
          }}
          defaultActiveKey={defaultActiveKey}
          tabBarStyle={{
            display: 'flex',
            // justifyContent: 'space-between',
            width: '100%'
          }}
          items={items}
          tabBarExtraContent={tabBarExtraContent}
          style={{ width: '100%' }}
          indicator={{ size: (origin) => origin, align: 'center' }}
        />
      </div>
    </ConfigProvider>
  );
};

export default TabView;
