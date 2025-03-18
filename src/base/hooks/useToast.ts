// useToast.ts
import { message } from 'antd';

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastOptions {
  content: string;
  duration?: number;
  type?: MessageType;
  onClose?: () => void;
}

const useToast = () => {
  const showToast = ({ content, duration = 3, type = 'info', onClose = () => {} }: ToastOptions) => {
    switch (type) {
      case 'success':
        message.success(content, duration, onClose);
        break;
      case 'error':
        message.error(content, duration, onClose);
        break;
      case 'info':
        message.info(content, duration, onClose);
        break;
      case 'warning':
        message.warning(content, duration, onClose);
        break;
      case 'loading':
        message.loading(content, duration, onClose);
        break;
      default:
        message.info(content, duration, onClose);
        break;
    }
  };

  return showToast;
};

export default useToast;
