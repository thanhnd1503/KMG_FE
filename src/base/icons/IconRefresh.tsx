import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconRefresh(props: IconComponentProps) {
  const Svg = () => (
    <svg viewBox="0 0 28 28" fill="none" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.3346 12.8331C23.0493 10.78 22.0969 8.87768 20.624 7.41915C19.1512 5.96063 17.2397 5.02681 15.1839 4.76155C13.1282 4.49629 11.0422 4.9143 9.24737 5.95119C7.45255 6.98808 6.04843 8.58633 5.2513 10.4997M4.66797 5.83307V10.4997H9.33464M4.66797 15.1667C4.95329 17.2198 5.90572 19.1221 7.37856 20.5807C8.85139 22.0392 10.7629 22.973 12.8187 23.2383C14.8745 23.5035 16.9604 23.0855 18.7552 22.0486C20.5501 21.0117 21.9542 19.4135 22.7513 17.5001M23.3346 22.1667V17.5001H18.668"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
