import { ConfigProvider, Spin } from 'antd';

const Loader = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366F1'
        }
      }}
    >
      <div className="app-loader">
        <Spin spinning />
      </div>
    </ConfigProvider>
  );
};

export default Loader;
