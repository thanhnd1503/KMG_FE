import { Flex, Typography } from 'antd';

export interface LabelViewItemType {
  label: string;
  value: any;
  renderValue?: (val: any) => any;
}

interface Props {
  items: LabelViewItemType[];
  labelStyle?: React.CSSProperties;
}

const LabelViewItem = (props: Props) => {
  const { items, labelStyle } = props;
  return (
    <Flex
      vertical={true}
      style={{
        width: '100%',
        border: '1px solid var(--base-stroke-color-base-stroke-20, #E2E5F0)',
        borderBottom: 'none',
        borderRadius: 8,
        overflow: 'hidden'
      }}
    >
      {items.map((item, index) => {
        return (
          <Flex
            key={index}
            vertical={false}
            align="center"
            style={{
              width: '100%',
              height: 28,
              borderBottom: '1px solid var(--base-stroke-color-base-stroke-20, #E2E5F0)'
            }}
          >
            <div
              style={{
                width: 150,
                minHeight: '100%',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--table-bg-label-1, #F1F3F9)',
                ...labelStyle
              }}
            >
              <Typography
                style={{
                  fontSize: 12,
                  paddingLeft: 12,
                  paddingRight: 12
                }}
              >
                {item.label}
              </Typography>
            </div>
            {item?.renderValue ? (
              <div style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>{item?.renderValue(item.value)}</div>
            ) : (
              <Typography style={{ fontSize: 12, fontWeight: 500, flex: 394, paddingLeft: 12, paddingRight: 12 }}>{item.value}</Typography>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default LabelViewItem;
