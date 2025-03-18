import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

import { title } from 'process';

import { EditFilled } from '@ant-design/icons';
import { Button, ConfigProvider, Divider, Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import classNames from 'classnames/bind';

import styles from './SectionWrapper.module.css';

const cx = classNames.bind(styles);
export interface SectionChildrenProps {
  formItemGap?: 'xs' | 'small' | 'medium' | 'large';
  isHide?: boolean;
  content: ReactNode;
}
export interface ISectionWrapperProps {
  title?: string;
  titleAction?: ReactNode;
  isRequired?: boolean;
  children: Array<SectionChildrenProps>;
  childrenWrapperStyle?: CSSProperties;
  wrapperStyle?: CSSProperties;
  action?: ReactNode;
  size?: 'small' | 'large';
  boxShadow?: boolean;
}

export default function SectionWrapper({
  title,
  titleAction,
  isRequired,
  children,
  childrenWrapperStyle,
  wrapperStyle,
  action,
  size,
  boxShadow = false
}: ISectionWrapperProps) {
  const actionRef = useRef<HTMLDivElement>(null);
  const [widthContent, setWidthContent] = useState<string>('100%');
  const contentStyle: CSSProperties = {
    ...childrenWrapperStyle
  };
  useEffect(() => {
    const handleCalcWidthContent = () => {
      if (actionRef.current) {
        const actionWidth = actionRef.current.offsetWidth;
        if (actionWidth) {
          let calcWidthContent = `calc(100% - ${actionWidth}px - 40px)`;
          if (window.innerWidth <= 550) calcWidthContent = '100%';
          setWidthContent(calcWidthContent);
        }
      }
    };
    handleCalcWidthContent();

    // calc calcWidthContent when resize window
    window.addEventListener('resize', handleCalcWidthContent);

    return () => {
      window.removeEventListener('resize', handleCalcWidthContent);
    };
  }, [action]);
  return (
    <div>
      {title && (
        <Flex wrap gap={8} justify="space-between" align="center" className={cx('title-wrapper')}>
          <Title type="secondary" level={5} className={cx('title')}>
            {title} {isRequired && <span style={{ color: 'red' }}>*</span>}
          </Title>
          {titleAction}
        </Flex>
      )}
      <div
        className={cx('wrapper')}
        style={{
          boxShadow: title || boxShadow ? 'var(--box-shadow)' : 'none',
          ...wrapperStyle
        }}
      >
        <div ref={actionRef} className={cx('actions-wrapper', { small: size === 'small' })}>
          {action}
        </div>
        {children?.map(
          (item, index) =>
            !item.isHide && (
              <ConfigProvider
                theme={{
                  components: {
                    Form: {
                      labelColonMarginInlineEnd:
                        item.formItemGap === 'xs' ? 5 : item.formItemGap === 'small' ? 20 : item.formItemGap === 'large' ? 50 : 35,
                      itemMarginBottom: 0
                    }
                  }
                }}
                key={index}
              >
                {index !== 0 && <Divider style={{ margin: 0 }} />}
                <div style={{ ...contentStyle, width: widthContent }} className={cx('content-wrapper', { sm: size === 'small' })}>
                  {item?.content}
                </div>
              </ConfigProvider>
            )
        )}
      </div>
    </div>
  );
}
