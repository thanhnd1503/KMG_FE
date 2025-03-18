import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconX(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 7L7 21M7 7L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
