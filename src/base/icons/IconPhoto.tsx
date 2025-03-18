import Icon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

export default function IconPhoto(props: IconComponentProps) {
  const Svg = () => (
    <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 9.33333H17.5117M3.5 18.6665L9.33333 12.8331C10.416 11.7913 11.7507 11.7913 12.8333 12.8331L18.6667 18.6665M16.3333 16.3331L17.5 15.1665C18.5827 14.1246 19.9173 14.1246 21 15.1665L24.5 18.6665M3.5 7C3.5 6.07174 3.86875 5.1815 4.52513 4.52513C5.1815 3.86875 6.07174 3.5 7 3.5H21C21.9283 3.5 22.8185 3.86875 23.4749 4.52513C24.1313 5.1815 24.5 6.07174 24.5 7V21C24.5 21.9283 24.1313 22.8185 23.4749 23.4749C22.8185 24.1313 21.9283 24.5 21 24.5H7C6.07174 24.5 5.1815 24.1313 4.52513 23.4749C3.86875 22.8185 3.5 21.9283 3.5 21V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return <Icon component={Svg} {...props} />;
}
