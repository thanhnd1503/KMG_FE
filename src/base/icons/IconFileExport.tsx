import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconFileExport(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.332 3.5V8.16667C16.332 8.47609 16.4549 8.77283 16.6737 8.99162C16.8925 9.21042 17.1893 9.33333 17.4987 9.33333H22.1654M16.332 3.5H8.16536C7.54653 3.5 6.95303 3.74583 6.51545 4.18342C6.07786 4.621 5.83203 5.21449 5.83203 5.83333V22.1667C5.83203 22.7855 6.07786 23.379 6.51545 23.8166C6.95303 24.2542 7.54653 24.5 8.16536 24.5H13.4154M16.332 3.5L22.1654 9.33333M22.1654 9.33333V15.1667M16.332 22.1667H24.4987M24.4987 22.1667L20.9987 18.6667M24.4987 22.1667L20.9987 25.6667"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
