import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconStatistics(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 3.5V24.5H24.5M23.3333 21V24.5M18.6667 18.6667V24.5M14 15.1667V24.5M9.33333 18.6667V24.5M3.5 12.8333C10.5 12.8333 9.33333 7 14 7C18.6667 7 17.5 12.8333 24.5 12.8333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
