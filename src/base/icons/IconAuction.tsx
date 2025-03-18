import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconAuction(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.1667 13.1667V14.8333C13.1667 15.2754 12.9911 15.6993 12.6785 16.0118C12.366 16.3244 11.942 16.5 11.5 16.5H3.16667C2.72464 16.5 2.30072 16.3244 1.98816 16.0118C1.67559 15.6993 1.5 15.2754 1.5 14.8333V6.5C1.5 6.05797 1.67559 5.63405 1.98816 5.32149C2.30072 5.00893 2.72464 4.83333 3.16667 4.83333H4.83333M10.6667 10.6667V4L9 5.66667M4.83333 3.16667C4.83333 2.72464 5.00893 2.30072 5.32149 1.98816C5.63405 1.67559 6.05797 1.5 6.5 1.5H14.8333C15.2754 1.5 15.6993 1.67559 16.0118 1.98816C16.3244 2.30072 16.5 2.72464 16.5 3.16667V11.5C16.5 11.942 16.3244 12.366 16.0118 12.6785C15.6993 12.9911 15.2754 13.1667 14.8333 13.1667H6.5C6.05797 13.1667 5.63405 12.9911 5.32149 12.6785C5.00893 12.366 4.83333 11.942 4.83333 11.5V3.16667Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
