import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconEdit(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.7513 7.58325L20.418 12.2499M4.66797 23.3336H9.33464L21.5846 11.0836C21.8911 10.7772 22.1341 10.4134 22.3 10.0131C22.4658 9.61271 22.5511 9.18361 22.5511 8.75027C22.5511 8.31693 22.4658 7.88783 22.3 7.48748C22.1341 7.08713 21.8911 6.72336 21.5846 6.41694C21.2782 6.11052 20.9144 5.86746 20.5141 5.70162C20.1137 5.53579 19.6846 5.45044 19.2513 5.45044C18.818 5.45044 18.3889 5.53579 17.9885 5.70162C17.5882 5.86746 17.2244 6.11052 16.918 6.41694L4.66797 18.6669V23.3336Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
