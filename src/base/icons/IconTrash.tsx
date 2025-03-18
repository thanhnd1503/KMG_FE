import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconTrash(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.66797 8.16667H23.3346M11.668 12.8333V19.8333M16.3346 12.8333V19.8333M5.83464 8.16667L7.0013 22.1667C7.0013 22.7855 7.24713 23.379 7.68472 23.8166C8.1223 24.2542 8.7158 24.5 9.33464 24.5H18.668C19.2868 24.5 19.8803 24.2542 20.3179 23.8166C20.7555 23.379 21.0013 22.7855 21.0013 22.1667L22.168 8.16667M10.5013 8.16667V4.66667C10.5013 4.35725 10.6242 4.0605 10.843 3.84171C11.0618 3.62292 11.3585 3.5 11.668 3.5H16.3346C16.6441 3.5 16.9408 3.62292 17.1596 3.84171C17.3784 4.0605 17.5013 4.35725 17.5013 4.66667V8.16667"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
