import { InfoCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button as AnButton, Flex, Typography } from 'antd';

import Button from '@base/components/Button/CustomButton';
import ViewTopName from '@base/components/View/ViewTopName';

// import Button from '@base/components/Button/CustomButton';

interface TopProps {
  viewData?: any;
}

const Top = (props: TopProps) => {
  const { viewData } = props;
  console.log('viewData', viewData);

  return (
    <>
      <Flex vertical={false} justify="space-between" align="center" style={{ height: 40, paddingLeft: 20, paddingRight: 20 }}>
        <Flex vertical={false} gap={8} align="center">
          {/* <Typography style={{ color: 'var(--primary-fg-color-primary-fg-50, #6366F1)', fontSize: 14, fontWeight: 600 }}>
            {viewData?.['docCode']}
          </Typography>
          <Typography style={{ fontSize: 14, fontWeight: 600 }}> {viewData?.['name']}</Typography> */}
          <ViewTopName name={viewData?.['docCode']} subText={viewData?.['name']} />

          <Button color="secondary">노트보기</Button>
          <Button color="secondary">첨부보기</Button>
        </Flex>

        <Flex vertical={false} gap={8} align="center">
          <Button color="secondary" icon={<InfoCircleOutlined style={{ fontSize: 12 }} />}>
            카카오 알림톡
          </Button>
          <Button color="secondary" icon={<UnorderedListOutlined style={{ fontSize: 12 }} />}>
            추가작업
          </Button>
          <Button color="secondary">노트쓰기</Button>
          <Button color="secondary">상태변경 이력</Button>
          <Button color="success">상담종료</Button>
          <Button color="error">상담종료</Button>
        </Flex>
      </Flex>
    </>
  );
};

export default Top;
