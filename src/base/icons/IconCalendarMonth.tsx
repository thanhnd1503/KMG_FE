import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconCalendarMonth(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.668 3.5V8.16667M9.33464 3.5V8.16667M4.66797 12.8333H23.3346M8.16797 16.3333H8.18314M11.6794 16.3333H11.6852M15.1794 16.3333H15.1852M18.6862 16.3333H18.692M15.1862 19.8333H15.192M8.17936 19.8333H8.1852M11.6794 19.8333H11.6852M4.66797 8.16667C4.66797 7.54783 4.9138 6.95434 5.35139 6.51675C5.78897 6.07917 6.38246 5.83333 7.0013 5.83333H21.0013C21.6201 5.83333 22.2136 6.07917 22.6512 6.51675C23.0888 6.95434 23.3346 7.54783 23.3346 8.16667V22.1667C23.3346 22.7855 23.0888 23.379 22.6512 23.8166C22.2136 24.2542 21.6201 24.5 21.0013 24.5H7.0013C6.38246 24.5 5.78897 24.2542 5.35139 23.8166C4.9138 23.379 4.66797 22.7855 4.66797 22.1667V8.16667Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
