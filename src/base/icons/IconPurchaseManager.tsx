import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconPurchaseManager(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.83594 24.5V22.1667C5.83594 20.929 6.3276 19.742 7.20277 18.8668C8.07794 17.9917 9.26493 17.5 10.5026 17.5H17.5017C18.7394 17.5 19.9264 17.9917 20.8016 18.8668C21.6767 19.742 22.1684 20.929 22.1684 22.1667V24.5M9.33507 8.16667C9.33507 9.40434 9.82673 10.5913 10.7019 11.4665C11.5771 12.3417 12.7641 12.8333 14.0017 12.8333C15.2394 12.8333 16.4264 12.3417 17.3016 11.4665C18.1767 10.5913 18.6684 9.40434 18.6684 8.16667C18.6684 6.92899 18.1767 5.742 17.3016 4.86683C16.4264 3.99167 15.2394 3.5 14.0017 3.5C12.7641 3.5 11.5771 3.99167 10.7019 4.86683C9.82673 5.742 9.33507 6.92899 9.33507 8.16667Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
