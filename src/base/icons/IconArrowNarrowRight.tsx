import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconArrowNarrowRight(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.53516 8.16406L4.78516 7.42578L7.38672 4.82422H0.882812V3.74609H7.38672L4.78516 1.15625L5.53516 0.417969L9.41406 4.28516L5.53516 8.16406Z"
        fill="currentColor"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
