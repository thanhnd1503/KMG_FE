import { CustomCheckIcon } from '@base/assets/icons';
import { Flex } from 'antd';
import { ReactNode } from 'react';

export interface ICustomResultProps {
  title?: string;
  content?: string;
  icon?: ReactNode;
}

export default function CustomResult({
  title = 'Title',
  content = '성공적으로 제출되었습니다.',
  icon = <CustomCheckIcon />
}: ICustomResultProps) {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Flex vertical gap={20} align="center" style={{ margin: 'auto', padding: '0px 10px', transform: 'translateY(-10vh)' }}>
        {icon}
        <strong style={{ textAlign: 'center' }}>
          {title}
          <br />
          {content}
        </strong>
      </Flex>
    </div>
  );
}
