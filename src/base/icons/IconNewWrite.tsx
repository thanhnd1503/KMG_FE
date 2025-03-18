import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconNewWrite(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.16797 8.16667H7.0013C6.38246 8.16667 5.78897 8.4125 5.35139 8.85008C4.9138 9.28767 4.66797 9.88116 4.66797 10.5V21C4.66797 21.6188 4.9138 22.2123 5.35139 22.6499C5.78897 23.0875 6.38246 23.3333 7.0013 23.3333H17.5013C18.1201 23.3333 18.7136 23.0875 19.1512 22.6499C19.5888 22.2123 19.8346 21.6188 19.8346 21V19.8333M18.668 5.83333L22.168 9.33333M23.7838 7.68263C24.2433 7.22314 24.5014 6.59994 24.5014 5.95012C24.5014 5.30031 24.2433 4.67711 23.7838 4.21762C23.3243 3.75814 22.7011 3.5 22.0513 3.5C21.4015 3.5 20.7783 3.75814 20.3188 4.21762L10.5013 14.0001V17.5001H14.0013L23.7838 7.68263Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
