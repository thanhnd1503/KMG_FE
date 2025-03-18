import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconDeviceImac(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 15.1667H24.5M9.33333 24.5H18.6667M11.6667 19.8333L11.0833 24.5M16.3333 19.8333L16.9167 24.5M3.5 4.66667C3.5 4.35725 3.62292 4.0605 3.84171 3.84171C4.0605 3.62292 4.35725 3.5 4.66667 3.5H23.3333C23.6428 3.5 23.9395 3.62292 24.1583 3.84171C24.3771 4.0605 24.5 4.35725 24.5 4.66667V18.6667C24.5 18.9761 24.3771 19.2728 24.1583 19.4916C23.9395 19.7104 23.6428 19.8333 23.3333 19.8333H4.66667C4.35725 19.8333 4.0605 19.7104 3.84171 19.4916C3.62292 19.2728 3.5 18.9761 3.5 18.6667V4.66667Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
