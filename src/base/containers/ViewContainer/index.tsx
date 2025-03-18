import { Col, Flex, Row } from 'antd';

interface ViewContainerProps {
  Top: any;
  Left?: any;
  Right: any;
  viewData?: any;
  [x: string]: any;
}

const ViewContainer = (props: ViewContainerProps) => {
  const { Left, Right, Top, viewData, ...other } = props;
  return (
    <Flex vertical style={{ height: '100%', width: '100%' }}>
      <div style={{ paddingTop: 16, paddingBottom: 16, height: 72 }}>
        <Top viewData={viewData} {...other} />
      </div>
      <div
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          overflow: 'hidden',
          gap: 20,
          width: '100%',
          height: 'calc(100% - 72px)',
          display: 'flex'
        }}
      >
        <div style={{ width: '30%', height: '100%' }}>
          <Left viewData={viewData} {...other} />
        </div>
        <div style={{ width: 'calc(70% - 20px)', height: '100%', paddingTop: 30 }}>
          <Right viewData={viewData} {...other} />
        </div>
      </div>
    </Flex>
  );
};

export default ViewContainer;
