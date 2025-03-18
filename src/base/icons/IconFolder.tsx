import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconFolder(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.83333 4.66675H10.5L14 8.16675H22.1667C22.7855 8.16675 23.379 8.41258 23.8166 8.85017C24.2542 9.28775 24.5 9.88124 24.5 10.5001V19.8334C24.5 20.4523 24.2542 21.0457 23.8166 21.4833C23.379 21.9209 22.7855 22.1667 22.1667 22.1667H5.83333C5.21449 22.1667 4.621 21.9209 4.18342 21.4833C3.74583 21.0457 3.5 20.4523 3.5 19.8334V7.00008C3.5 6.38124 3.74583 5.78775 4.18342 5.35017C4.621 4.91258 5.21449 4.66675 5.83333 4.66675Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
