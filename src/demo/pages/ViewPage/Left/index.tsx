import { FileImageOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

import Button from '@base/components/Button/CustomButton';
import LabelViewItem, { LabelViewItemType } from '@base/components/View/LabelViewItem';
import TitleName from '@base/components/View/TitleName';
import { Photo } from '@base/icons';

interface LeftProps {}

const Left = (props: LeftProps) => {
  const {} = props;

  const itemPurchaseDetail: LabelViewItemType[] = [
    {
      label: '매입가',
      value: 'value'
    },
    {
      label: '추정상품화비용',
      value: 'value'
    },
    {
      label: '예상판매가',
      value: 'value'
    },
    {
      label: '추정수익',
      value: 'value'
    },
    {
      label: '자동견적가',
      value: 'value'
    },
    {
      label: '1차견적가',
      value: 'value'
    },
    {
      label: '최종견적가',
      value: 'value'
    },
    {
      label: '수익율',
      value: 'value'
    },
    {
      label: '상태',
      value: 'value'
    },
    {
      label: '신차 SC 소속',
      value: 'value'
    },
    {
      label: '신차 SC 대리점',
      value: 'value'
    },
    {
      label: '신차 SC 이름',
      value: 'value'
    },
    {
      label: '신차 SC 전화번호',
      value: 'value'
    }
  ];

  const contactInfoDetail: LabelViewItemType[] = [
    {
      label: '소속',
      value: 'value'
    },
    {
      label: '담당자',
      value: 'value'
    },
    {
      label: '휴대폰번호',
      value: 'value'
    },
    {
      label: '직급',
      value: 'value'
    }
  ];

  const commonTitleStyle: React.CSSProperties = {
    fontWeight: 600,
    fontSize: 12
  };

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }} className="scroll-box">
      <Flex gap={40} vertical style={{ width: '100%' }}>
        {/* Section 1 */}
        <Flex gap={12} vertical style={{ width: '100%' }}>
          {/* <Typography style={commonTitleStyle}>매입 상세정보</Typography> */}
          <TitleName title={'매입 상세정보'} />
          <LabelViewItem items={itemPurchaseDetail} />
        </Flex>

        {/* Section 2 */}
        <Flex gap={12} vertical style={{ width: '100%' }}>
          {/* <Typography style={commonTitleStyle}>내차팔기 사진</Typography> */}
          <TitleName title={'내차팔기 사진'} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, index) => {
              return (
                <div
                  key={index}
                  style={{
                    flex: '1 1 calc(33.33% - 20px)' /* 3 items per row with gap */,
                    boxSizing: 'border-box',
                    height: 112,
                    border: '1px solid var(--base-stroke-color-base-stroke-20, #E2E5F0)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* <FileImageOutlined style={{ color: 'var(--base-stroke-color-base-stroke-20, #E2E5F0)', fontSize: 20 }} /> */}
                  <Photo style={{ color: 'var(--base-fg-color-base-fg-40, #949DB8)', fontSize: 24 }} />
                </div>
              );
            })}
          </div>
        </Flex>

        {/* Section 3 */}
        <Flex gap={12} vertical style={{ width: '100%' }}>
          <Flex gap={16} vertical={false} align="center" justify="space-between" style={{ width: '100%' }}>
            {/* <Typography style={commonTitleStyle}>담당자 정보</Typography> */}
            <TitleName title={'담당자 정보'} />

            <Flex gap={8}>
              <Button size="small" variant="outlined" color="secondary">
                담당자 변경이력
              </Button>
              <Button size="small" variant="outlined" color="secondary">
                내담당
              </Button>
              <Button size="small" variant="outlined" color="secondary">
                담당자 지정
              </Button>
            </Flex>
          </Flex>
          <LabelViewItem items={contactInfoDetail} />
        </Flex>
      </Flex>
    </div>
  );
};

export default Left;
