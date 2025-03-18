import { CSSProperties, forwardRef, useState } from 'react';

import { ConfigProvider, Flex, Select, SelectProps } from 'antd';

import { ChevronDown } from '@base/icons';

export interface CustomSelectProps extends SelectProps {
  customBgColor?: string;
  active?: boolean;
  danger?: boolean;
  size?: 'small' | 'middle';
  suffixGap?: number;
  suffix?: React.ReactNode;
  containerStyle?: React.CSSProperties;
  customStyle?: React.CSSProperties;
}

const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(
  ({ customBgColor, style, active, danger, suffixGap = 4, suffix, containerStyle, ...props }, ref) => {
    const [rerender, setRerender] = useState<boolean>(false);
    const customStyle: CSSProperties = {
      ...style,
      borderRadius: 0
    };

    return (
      <ConfigProvider
        theme={{
          components: {
            Select:
              props.size === 'small'
                ? {
                    optionHeight: 28,
                    optionPadding: '6px 12px',
                    optionLineHeight: '16px',
                    optionFontSize: 12
                  }
                : {
                    optionHeight: 36,
                    optionPadding: '8px 12px',
                    optionLineHeight: '20px',
                    optionFontSize: 14
                  }
          }
        }}
      >
        <Flex align="center" gap={suffixGap} style={{ ...containerStyle }}>
          <Select
            style={{ flex: 1, ...customStyle }}
            suffixIcon={<ChevronDown style={{ fontSize: props.size === 'small' ? 12 : 16, pointerEvents: 'none' }} />}
            {...props}
            onChange={(value, option) => {
              setRerender((prev: boolean) => !prev);
              if (typeof props.onChange === 'function') {
                props.onChange(value, option);
              }
            }}
            dropdownAlign={{ offset: [0, 0] }}
          />
          {suffix}
        </Flex>
      </ConfigProvider>
    );
  }
);

export default CustomSelect;
