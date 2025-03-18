import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconMail(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 8.16659C3.5 7.54775 3.74583 6.95425 4.18342 6.51667C4.621 6.07908 5.21449 5.83325 5.83333 5.83325H22.1667C22.7855 5.83325 23.379 6.07908 23.8166 6.51667C24.2542 6.95425 24.5 7.54775 24.5 8.16659M3.5 8.16659V19.8333C3.5 20.4521 3.74583 21.0456 4.18342 21.4832C4.621 21.9208 5.21449 22.1666 5.83333 22.1666H22.1667C22.7855 22.1666 23.379 21.9208 23.8166 21.4832C24.2542 21.0456 24.5 20.4521 24.5 19.8333V8.16659M3.5 8.16659L14 15.1666L24.5 8.16659"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
