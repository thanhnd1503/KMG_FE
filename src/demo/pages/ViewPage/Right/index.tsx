import { useMemo } from 'react';

import TabView from '@base/components/View/TabView';

interface RightProps {}

const Right = (props: RightProps) => {
  const {} = props;

  const tabs: any[] = useMemo(() => {
    return [
      {
        label: `상세정보`,
        key: '1',
        children: <div style={{ height: '200vh' }}></div>
      },
      { label: `카히스토리`, key: '2', children: '' },
      {
        label: `외관 점검표`,
        key: '3',
        children: '외관 점검표'
      },
      {
        label: `보험`,
        key: '4',
        children: '보험'
      },
      {
        label: `정산관리`,
        key: '5',
        children: '정산관리'
      },
      {
        label: `후지급`,
        key: '6',
        children: '후지급'
      },
      {
        label: `계좌관리`,
        key: '7',
        children: '계좌관리'
      },
      {
        label: `가상계좌 조정`,
        key: '8',
        children: '가상계좌 조정'
      }
    ];
  }, []);

  return <TabView items={tabs} />;
};

export default Right;
