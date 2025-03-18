import React, { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import { CaretDownOutlined, CaretUpOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import style from './style.module.css';
const cx = classNames.bind(style);

interface Props extends ButtonProps {
  children?: ReactNode;
  toggleState?: boolean;
  iconType?: 'caret' | 'outline';
}

const TextButtonDropdown = ({ children, toggleState, iconType = 'caret', ...props }: Props) => {
  const btnProps: ButtonProps = {
    type: 'text',
    iconPosition: 'end'
  };
  if (iconType === 'caret') {
    btnProps.icon = toggleState ? <CaretUpOutlined /> : <CaretDownOutlined />;
  } else {
    btnProps.icon = toggleState ? <UpOutlined /> : <DownOutlined />;
    btnProps.style = { color: 'var(--secondary-color)' };
  }
  return (
    <Button {...btnProps} {...props}>
      {children}
    </Button>
  );
};

export default TextButtonDropdown;
