import { Typography } from 'antd';

interface TitleNameProps {
  title: string;
}

const TitleName = (props: TitleNameProps) => {
  const { title } = props;
  return <Typography className="title-sm">{title}</Typography>;
};

export default TitleName;
