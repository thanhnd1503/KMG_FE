import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconReload(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.2554 15.2142C23.0351 16.8942 22.3616 18.4824 21.3073 19.8087C20.2529 21.135 18.8574 22.1493 17.2704 22.7427C15.6834 23.3362 13.9647 23.4864 12.2988 23.1774C10.6329 22.8683 9.08257 22.1116 7.81404 20.9884C6.54552 19.8652 5.60667 18.4179 5.09818 16.8016C4.5897 15.1854 4.53077 13.4612 4.92771 11.8141C5.32466 10.1669 6.16249 8.65882 7.35137 7.45162C8.54025 6.24442 10.0353 5.38362 11.6762 4.96154C16.2251 3.79487 20.9337 6.13637 22.6721 10.4997M23.3346 4.66675V10.5001H17.5013"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
