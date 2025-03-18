import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconMyAdmin(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 8.16667V24.5L14 19.8333L7 24.5V8.16667C7 6.92899 7.49167 5.742 8.36683 4.86683C9.242 3.99167 10.429 3.5 11.6667 3.5H16.3333C17.571 3.5 18.758 3.99167 19.6332 4.86683C20.5083 5.742 21 6.92899 21 8.16667Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
