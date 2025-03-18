import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconFilter(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.9948 18.0833L23.3281 18.0833M20.9948 18.0833C20.9948 16.7947 19.9501 15.75 18.6615 15.75C17.3728 15.75 16.3281 16.7947 16.3281 18.0833M20.9948 18.0833C20.9948 19.372 19.9501 20.4167 18.6615 20.4167C17.3728 20.4167 16.3281 19.372 16.3281 18.0833M6.9948 9.33333C6.9948 10.622 8.03946 11.6667 9.32813 11.6667C10.6168 11.6667 11.6615 10.622 11.6615 9.33333M6.9948 9.33333C6.9948 8.04467 8.03946 7 9.32813 7C10.6168 7 11.6615 8.04467 11.6615 9.33333M6.9948 9.33333L4.66146 9.33333M11.6615 9.33333L23.3281 9.33333M16.3281 18.0833L4.66146 18.0833"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
