import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function SortAscending(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.5 5V2.5C7.5 1.81 7.81 1.5 8.5 1.5C9.19 1.5 9.5 1.81 9.5 2.5V5M9.5 3.5H7.5M9.5 10.5H7.5L9.5 7H7.5M2 7.5L3.5 9M3.5 9L5 7.5M3.5 9V3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
