import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconFolderOpen(props: IconComponentProps) {
  const Svg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.33333 12.667L5.17133 7.76633C5.21896 7.63928 5.30421 7.52978 5.41571 7.45247C5.52722 7.37516 5.65965 7.33371 5.79533 7.33366H14M3.33333 12.667H12.684C12.9942 12.6669 13.2946 12.5587 13.5336 12.3609C13.7726 12.1632 13.9352 11.8883 13.9933 11.5837L14.6573 8.10966C14.6732 8.0142 14.6681 7.91642 14.6424 7.82313C14.6167 7.72984 14.5709 7.64326 14.5084 7.56942C14.4458 7.49558 14.368 7.43624 14.2802 7.39553C14.1924 7.35482 14.0968 7.3337 14 7.33366M3.33333 12.667C2.97971 12.667 2.64057 12.5265 2.39052 12.2765C2.14048 12.0264 2 11.6873 2 11.3337V4.00033C2 3.6467 2.14048 3.30756 2.39052 3.05752C2.64057 2.80747 2.97971 2.66699 3.33333 2.66699H6L8 4.66699H12.6667C13.0203 4.66699 13.3594 4.80747 13.6095 5.05752C13.8595 5.30756 14 5.6467 14 6.00033V7.33366"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
