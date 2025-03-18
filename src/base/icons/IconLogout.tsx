import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconLogout(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.3333 9.33342V7.00008C16.3333 6.38124 16.0875 5.78775 15.6499 5.35017C15.2123 4.91258 14.6188 4.66675 14 4.66675H5.83333C5.21449 4.66675 4.621 4.91258 4.18342 5.35017C3.74583 5.78775 3.5 6.38124 3.5 7.00008V21.0001C3.5 21.6189 3.74583 22.2124 4.18342 22.65C4.621 23.0876 5.21449 23.3334 5.83333 23.3334H14C14.6188 23.3334 15.2123 23.0876 15.6499 22.65C16.0875 22.2124 16.3333 21.6189 16.3333 21.0001V18.6667M10.5 14.0001H24.5M24.5 14.0001L21 10.5001M24.5 14.0001L21 17.5001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
