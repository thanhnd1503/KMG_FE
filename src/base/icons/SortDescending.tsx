import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function SortDescending(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.5 10.5V8C7.5 7.31 7.81 7 8.5 7C9.19 7 9.5 7.31 9.5 8V10.5M9.5 9H7.5M9.5 5H7.5L9.5 1.5H7.5M2 7.5L3.5 9M3.5 9L5 7.5M3.5 9V3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
