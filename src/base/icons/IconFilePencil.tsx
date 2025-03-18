import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconFilePencil(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.668 2.90002V6.23336C11.668 6.45437 11.7558 6.66633 11.912 6.82261C12.0683 6.97889 12.2803 7.06669 12.5013 7.06669H15.8346M11.668 2.90002H5.83464C5.39261 2.90002 4.96868 3.07562 4.65612 3.38818C4.34356 3.70074 4.16797 4.12466 4.16797 4.56669V16.2334C4.16797 16.6754 4.34356 17.0993 4.65612 17.4119C4.96868 17.7244 5.39261 17.9 5.83464 17.9H14.168C14.61 17.9 15.0339 17.7244 15.3465 17.4119C15.659 17.0993 15.8346 16.6754 15.8346 16.2334V7.06669M11.668 2.90002L15.8346 7.06669M8.33464 15.4001L12.5013 11.2335C12.7223 11.0125 12.8465 10.7127 12.8465 10.4001C12.8465 10.0876 12.7223 9.78783 12.5013 9.56682C12.2803 9.3458 11.9805 9.22164 11.668 9.22164C11.3554 9.22164 11.0556 9.3458 10.8346 9.56682L6.66797 13.7335V15.4001H8.33464Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
