import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

import { Tooltip } from 'antd';

interface OverflowTooltipProps {
  children: ReactNode; // The content inside the component
  style?: CSSProperties; // Optional inline styles for the wrapper
  tooltipProps?: Omit<React.ComponentProps<typeof Tooltip>, 'title'>; //
  contentClassName?: string;
}

const OverflowTooltip = (props: OverflowTooltipProps) => {
  const { children, style, tooltipProps, contentClassName } = props;

  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [children]);

  return (
    <Tooltip title={isOverflowing ? children : ''} {...tooltipProps}>
      <div
        ref={textRef}
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          ...style
        }}
        className={contentClassName}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowTooltip;
