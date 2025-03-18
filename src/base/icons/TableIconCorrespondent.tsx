import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function TableIconCorrespondent(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 24.5H24.5M10.5 9.33333H11.6667M10.5 14H11.6667M10.5 18.6667H11.6667M16.3333 9.33333H17.5M16.3333 14H17.5M16.3333 18.6667H17.5M5.83333 24.5V5.83333C5.83333 5.21449 6.07917 4.621 6.51675 4.18342C6.95434 3.74583 7.54783 3.5 8.16667 3.5H19.8333C20.4522 3.5 21.0457 3.74583 21.4832 4.18342C21.9208 4.621 22.1667 5.21449 22.1667 5.83333V24.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
