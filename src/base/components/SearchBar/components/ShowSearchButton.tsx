import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

import Button from '@base/components/Button/CustomButton';

interface ShowSearchButtonProps {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowSearchButton = (props: ShowSearchButtonProps) => {
  const { showSearch, setShowSearch } = props;
  return (
    <Button
      onClick={() => setShowSearch((prev) => !prev)}
      color="primary"
      shape="circle"
      icon={showSearch ? <DoubleLeftOutlined /> : <DoubleRightOutlined />}
      style={{
        background: showSearch ? 'var(--button-secondary-bg-selected, #E0E7FF)' : 'unset'
      }}
    />
  );
};

export default ShowSearchButton;
