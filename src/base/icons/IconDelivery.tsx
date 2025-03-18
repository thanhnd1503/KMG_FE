import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconDelivery(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.66797 8.75V19.25L14.0013 24.5V14M4.66797 8.75L14.0013 3.5L23.3346 8.75M4.66797 8.75L14.0013 14M23.3346 8.75V14M23.3346 8.75L14.0013 14M17.5013 21H25.668M25.668 21L22.168 17.5M25.668 21L22.168 24.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
