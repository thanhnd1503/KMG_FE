import { Typography } from 'antd';

interface ViewTopNameProps {
  name?: string;
  subText?: string;
  style?: React.CSSProperties;
  subTextStyle?: React.CSSProperties;
}

const ViewTopName = (props: ViewTopNameProps) => {
  const { name = '', subText, style, subTextStyle } = props;
  return (
    <>
      <Typography className="title-md" style={{ color: 'var(--primary-fg-color-primary-fg-50, #6366F1)', ...style }}>
        {name}
      </Typography>
      {subText && (
        <Typography className="title-md" style={{ ...subTextStyle }}>
          {subText}
        </Typography>
      )}
    </>
  );
};

export default ViewTopName;
