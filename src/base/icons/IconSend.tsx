import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconSearch(props: IconComponentProps) {
  const Svg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.66659 9.33333L13.9999 2M6.66659 9.33333L9.00029 14C9.02954 14.0638 9.0765 14.1179 9.13559 14.1558C9.19468 14.1938 9.26341 14.2139 9.33362 14.2139C9.40384 14.2139 9.47257 14.1938 9.53166 14.1558C9.59075 14.1179 9.63771 14.0638 9.66696 14L13.9999 2M6.66659 9.33333L2.00029 7C1.93646 6.97075 1.88238 6.92379 1.84446 6.8647C1.80653 6.80561 1.78638 6.73688 1.78638 6.66667C1.78638 6.59646 1.80653 6.52772 1.84446 6.46863C1.88238 6.40954 1.93646 6.36258 2.00029 6.33333L13.9999 2"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
